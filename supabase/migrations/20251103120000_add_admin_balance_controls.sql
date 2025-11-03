/*
  # Admin Balance Control System

  1. New Functions
    - `admin_adjust_partner_balance()` - Safe balance adjustments by admins
    - `admin_get_partner_details()` - Comprehensive partner data for admin view
    - `admin_get_balance_health()` - System-wide balance health check
    - `admin_fix_balance_mismatch()` - Auto-fix sync issues between tables

  2. New Tables
    - `admin_balance_adjustments` - Audit trail for manual balance changes

  3. Security
    - Only admins (users.role = 'admin') can execute these functions
    - All adjustments logged with reason and admin ID
    - Prevents negative balances
    - Checks for pending reservations
*/

-- ============================================================================
-- TABLES
-- ============================================================================

-- Admin Balance Adjustments Audit Trail
CREATE TABLE IF NOT EXISTS admin_balance_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Adjustment details
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('add', 'remove', 'fix_sync', 'refund', 'bonus', 'penalty', 'correction')),
  reason TEXT NOT NULL,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_balance_adjustments_partner ON admin_balance_adjustments(partner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_balance_adjustments_admin ON admin_balance_adjustments(admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_balance_adjustments_type ON admin_balance_adjustments(adjustment_type, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE admin_balance_adjustments ENABLE ROW LEVEL SECURITY;

-- Only admins can view adjustment history
CREATE POLICY "Admins can view balance adjustments"
  ON admin_balance_adjustments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Admin Adjust Partner Balance (SAFE)
CREATE OR REPLACE FUNCTION admin_adjust_partner_balance(
  p_partner_id UUID,
  p_amount DECIMAL,
  p_adjustment_type TEXT,
  p_reason TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_admin_id UUID;
  v_partner_auth_user_id UUID;
  v_current_balance DECIMAL;
  v_new_balance DECIMAL;
  v_pending_reservations DECIMAL;
  v_transaction_id UUID;
  v_adjustment_id UUID;
  v_is_admin BOOLEAN;
BEGIN
  -- Get admin user ID
  v_admin_id := auth.uid();

  -- Verify user is admin
  SELECT role = 'admin' INTO v_is_admin
  FROM users
  WHERE id = v_admin_id;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Only admins can adjust balances';
  END IF;

  -- Get partner's auth user ID
  SELECT auth_user_id INTO v_partner_auth_user_id
  FROM nonprofits
  WHERE id = p_partner_id;

  IF v_partner_auth_user_id IS NULL THEN
    RAISE EXCEPTION 'Partner not found or not linked to user account';
  END IF;

  -- Get current balance from nonprofits table
  SELECT COALESCE(mumbies_cash_balance, 0)
  INTO v_current_balance
  FROM nonprofits
  WHERE id = p_partner_id;

  -- Check for pending reservations
  SELECT COALESCE(SUM(amount), 0)
  INTO v_pending_reservations
  FROM balance_reservations
  WHERE user_id = v_partner_auth_user_id
  AND status = 'pending'
  AND expires_at > NOW();

  -- Calculate new balance
  v_new_balance := v_current_balance + p_amount;

  -- Prevent negative balance (considering reservations)
  IF (v_new_balance - v_pending_reservations) < 0 THEN
    RAISE EXCEPTION 'Cannot set balance below pending reservations. Current: $%, Pending: $%, Attempted new: $%',
      v_current_balance, v_pending_reservations, v_new_balance;
  END IF;

  -- Validate adjustment type
  IF p_adjustment_type NOT IN ('add', 'remove', 'fix_sync', 'refund', 'bonus', 'penalty', 'correction') THEN
    RAISE EXCEPTION 'Invalid adjustment type: %', p_adjustment_type;
  END IF;

  -- Update nonprofits balance
  UPDATE nonprofits
  SET
    mumbies_cash_balance = v_new_balance,
    updated_at = NOW()
  WHERE id = p_partner_id;

  -- Update users balance (sync)
  UPDATE users
  SET
    total_cashback_earned = v_new_balance,
    updated_at = NOW()
  WHERE id = v_partner_auth_user_id;

  -- Record transaction
  INSERT INTO partner_transactions (
    user_id,
    nonprofit_id,
    transaction_type,
    amount,
    balance_type,
    balance_before,
    balance_after,
    description,
    reference_type,
    metadata
  ) VALUES (
    v_partner_auth_user_id,
    p_partner_id,
    p_adjustment_type,
    p_amount,
    'mumbies_cash',
    v_current_balance,
    v_new_balance,
    format('Admin adjustment: %s', p_reason),
    'admin_adjustment',
    jsonb_build_object(
      'admin_id', v_admin_id,
      'reason', p_reason,
      'notes', p_notes,
      'adjustment_type', p_adjustment_type
    )
  )
  RETURNING id INTO v_transaction_id;

  -- Log adjustment
  INSERT INTO admin_balance_adjustments (
    partner_id,
    admin_user_id,
    amount,
    balance_before,
    balance_after,
    adjustment_type,
    reason,
    notes,
    metadata
  ) VALUES (
    p_partner_id,
    v_admin_id,
    p_amount,
    v_current_balance,
    v_new_balance,
    p_adjustment_type,
    p_reason,
    p_notes,
    jsonb_build_object(
      'transaction_id', v_transaction_id,
      'pending_reservations', v_pending_reservations
    )
  )
  RETURNING id INTO v_adjustment_id;

  -- Log admin activity
  INSERT INTO admin_activity_log (
    admin_user_id,
    action_type,
    entity_type,
    entity_id,
    changes,
    notes
  ) VALUES (
    v_admin_id,
    'adjust_balance',
    'partner',
    p_partner_id,
    jsonb_build_object(
      'balance_before', v_current_balance,
      'balance_after', v_new_balance,
      'adjustment_amount', p_amount,
      'adjustment_type', p_adjustment_type
    ),
    format('%s: %s', p_adjustment_type, p_reason)
  );

  RETURN jsonb_build_object(
    'success', true,
    'adjustment_id', v_adjustment_id,
    'transaction_id', v_transaction_id,
    'balance_before', v_current_balance,
    'balance_after', v_new_balance,
    'amount_adjusted', p_amount,
    'pending_reservations', v_pending_reservations
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get Comprehensive Partner Details for Admin
CREATE OR REPLACE FUNCTION admin_get_partner_details(p_partner_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_is_admin BOOLEAN;
BEGIN
  -- Verify user is admin
  SELECT role = 'admin' INTO v_is_admin
  FROM users
  WHERE id = auth.uid();

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Only admins can view partner details';
  END IF;

  -- Build comprehensive partner data
  SELECT jsonb_build_object(
    'partner', row_to_json(n.*),
    'user', (
      SELECT row_to_json(u.*)
      FROM users u
      WHERE u.id = n.auth_user_id
    ),
    'balance_info', jsonb_build_object(
      'current_balance', n.mumbies_cash_balance,
      'user_balance', (SELECT total_cashback_earned FROM users WHERE id = n.auth_user_id),
      'balance_synced', n.mumbies_cash_balance = (SELECT total_cashback_earned FROM users WHERE id = n.auth_user_id),
      'pending_reservations', (
        SELECT COALESCE(SUM(amount), 0)
        FROM balance_reservations
        WHERE user_id = n.auth_user_id
        AND status = 'pending'
        AND expires_at > NOW()
      ),
      'available_balance', n.mumbies_cash_balance - (
        SELECT COALESCE(SUM(amount), 0)
        FROM balance_reservations
        WHERE user_id = n.auth_user_id
        AND status = 'pending'
        AND expires_at > NOW()
      )
    ),
    'statistics', jsonb_build_object(
      'total_transactions', (SELECT COUNT(*) FROM partner_transactions WHERE nonprofit_id = p_partner_id),
      'total_earned', (SELECT COALESCE(SUM(amount), 0) FROM partner_transactions WHERE nonprofit_id = p_partner_id AND amount > 0),
      'total_spent', (SELECT COALESCE(ABS(SUM(amount)), 0) FROM partner_transactions WHERE nonprofit_id = p_partner_id AND amount < 0),
      'total_leads', (SELECT COUNT(*) FROM partner_leads WHERE partner_id = p_partner_id),
      'active_giveaways', (SELECT COUNT(*) FROM partner_giveaways WHERE partner_id = p_partner_id AND status = 'active'),
      'completed_rewards', (SELECT COUNT(*) FROM partner_reward_progress WHERE partner_id = p_partner_id AND status = 'claimed')
    ),
    'recent_transactions', (
      SELECT COALESCE(jsonb_agg(t ORDER BY t.created_at DESC), '[]'::jsonb)
      FROM (
        SELECT * FROM partner_transactions
        WHERE nonprofit_id = p_partner_id
        ORDER BY created_at DESC
        LIMIT 10
      ) t
    ),
    'recent_adjustments', (
      SELECT COALESCE(jsonb_agg(a ORDER BY a.created_at DESC), '[]'::jsonb)
      FROM (
        SELECT
          a.*,
          u.email as admin_email,
          u.full_name as admin_name
        FROM admin_balance_adjustments a
        JOIN users u ON u.id = a.admin_user_id
        WHERE a.partner_id = p_partner_id
        ORDER BY a.created_at DESC
        LIMIT 10
      ) a
    )
  )
  INTO v_result
  FROM nonprofits n
  WHERE n.id = p_partner_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get Balance Health Check
CREATE OR REPLACE FUNCTION admin_get_balance_health()
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_is_admin BOOLEAN;
BEGIN
  -- Verify user is admin
  SELECT role = 'admin' INTO v_is_admin
  FROM users
  WHERE id = auth.uid();

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Only admins can view balance health';
  END IF;

  SELECT jsonb_build_object(
    'system_totals', jsonb_build_object(
      'total_partners', (SELECT COUNT(*) FROM nonprofits WHERE status = 'active'),
      'total_mumbies_cash', (SELECT COALESCE(SUM(mumbies_cash_balance), 0) FROM nonprofits),
      'total_user_balance', (SELECT COALESCE(SUM(total_cashback_earned), 0) FROM users),
      'total_pending_reservations', (
        SELECT COALESCE(SUM(amount), 0)
        FROM balance_reservations
        WHERE status = 'pending'
        AND expires_at > NOW()
      )
    ),
    'health_status', jsonb_build_object(
      'mismatched_accounts', (
        SELECT COUNT(*)
        FROM users u
        LEFT JOIN nonprofits n ON n.auth_user_id = u.id
        WHERE u.total_cashback_earned != COALESCE(n.mumbies_cash_balance, 0)
        AND (u.is_partner = true OR n.id IS NOT NULL)
      ),
      'expired_reservations_pending_cleanup', (
        SELECT COUNT(*)
        FROM balance_reservations
        WHERE status = 'pending'
        AND expires_at < NOW()
      ),
      'failed_webhooks_last_24h', (
        SELECT COUNT(*)
        FROM webhook_logs
        WHERE status = 'failed'
        AND created_at > NOW() - INTERVAL '24 hours'
      )
    ),
    'mismatched_partners', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'partner_id', n.id,
          'organization_name', n.organization_name,
          'user_balance', u.total_cashback_earned,
          'partner_balance', n.mumbies_cash_balance,
          'difference', u.total_cashback_earned - n.mumbies_cash_balance
        )
      ), '[]'::jsonb)
      FROM users u
      JOIN nonprofits n ON n.auth_user_id = u.id
      WHERE u.total_cashback_earned != n.mumbies_cash_balance
    ),
    'last_reconciliation', (
      SELECT row_to_json(bal.*)
      FROM balance_audit_log bal
      ORDER BY audit_date DESC
      LIMIT 1
    )
  )
  INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Fix Balance Mismatch
CREATE OR REPLACE FUNCTION admin_fix_balance_mismatch(
  p_partner_id UUID,
  p_use_source TEXT DEFAULT 'user' -- 'user' or 'partner'
)
RETURNS JSONB AS $$
DECLARE
  v_admin_id UUID;
  v_user_id UUID;
  v_user_balance DECIMAL;
  v_partner_balance DECIMAL;
  v_correct_balance DECIMAL;
  v_is_admin BOOLEAN;
BEGIN
  -- Get admin user ID
  v_admin_id := auth.uid();

  -- Verify user is admin
  SELECT role = 'admin' INTO v_is_admin
  FROM users
  WHERE id = v_admin_id;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Only admins can fix balance mismatches';
  END IF;

  -- Get user_id and balances
  SELECT
    auth_user_id,
    mumbies_cash_balance
  INTO v_user_id, v_partner_balance
  FROM nonprofits
  WHERE id = p_partner_id;

  SELECT total_cashback_earned
  INTO v_user_balance
  FROM users
  WHERE id = v_user_id;

  -- Check if they're already synced
  IF v_user_balance = v_partner_balance THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Balances already synced',
      'balance', v_user_balance
    );
  END IF;

  -- Determine correct balance
  IF p_use_source = 'user' THEN
    v_correct_balance := v_user_balance;
  ELSIF p_use_source = 'partner' THEN
    v_correct_balance := v_partner_balance;
  ELSE
    RAISE EXCEPTION 'Invalid source: must be "user" or "partner"';
  END IF;

  -- Sync both tables
  UPDATE users
  SET total_cashback_earned = v_correct_balance
  WHERE id = v_user_id;

  UPDATE nonprofits
  SET mumbies_cash_balance = v_correct_balance
  WHERE id = p_partner_id;

  -- Log the fix
  INSERT INTO admin_balance_adjustments (
    partner_id,
    admin_user_id,
    amount,
    balance_before,
    balance_after,
    adjustment_type,
    reason,
    notes,
    metadata
  ) VALUES (
    p_partner_id,
    v_admin_id,
    v_correct_balance - v_partner_balance,
    v_partner_balance,
    v_correct_balance,
    'fix_sync',
    'Automatic balance sync fix',
    format('Synced from %s table. User balance was $%, Partner balance was $%',
      p_use_source, v_user_balance, v_partner_balance),
    jsonb_build_object(
      'source', p_use_source,
      'user_balance_before', v_user_balance,
      'partner_balance_before', v_partner_balance
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Balances synced successfully',
    'source_used', p_use_source,
    'balance_before', jsonb_build_object(
      'user', v_user_balance,
      'partner', v_partner_balance
    ),
    'balance_after', v_correct_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE admin_balance_adjustments IS 'Audit trail for all manual balance adjustments by admins';
COMMENT ON FUNCTION admin_adjust_partner_balance IS 'Safely adjust partner Mumbies Cash balance with full audit trail';
COMMENT ON FUNCTION admin_get_partner_details IS 'Get comprehensive partner data for admin detail view';
COMMENT ON FUNCTION admin_get_balance_health IS 'System-wide balance health check for admin dashboard';
COMMENT ON FUNCTION admin_fix_balance_mismatch IS 'Auto-fix sync issues between users and nonprofits tables';
