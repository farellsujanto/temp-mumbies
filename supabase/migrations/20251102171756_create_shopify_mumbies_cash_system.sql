/*
  # Shopify Mumbies Cash Integration System

  1. New Tables
    - `balance_reservations` - Track Mumbies Cash reservations during checkout
    - `webhook_logs` - Audit trail for Shopify webhooks
    - `balance_audit_log` - Daily snapshots for reconciliation

  2. Updates to Existing Tables
    - `orders` - Add Shopify integration fields

  3. Functions
    - `reserve_mumbies_balance()` - Reserve balance for checkout
    - `process_mumbies_order()` - Atomic order processing from webhook
    - `expire_old_reservations()` - Clean up expired reservations
    - `daily_balance_reconciliation()` - Check for discrepancies

  4. Security
    - Enable RLS on all tables
    - Users can only see their own reservations
*/

-- ============================================================================
-- TABLES
-- ============================================================================

-- Balance Reservations
CREATE TABLE IF NOT EXISTS balance_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Reservation details
  reservation_code TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
  
  -- Shopify integration
  shopify_discount_code TEXT UNIQUE NOT NULL,
  shopify_cart_id TEXT,
  shopify_order_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_reservations_user ON balance_reservations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON balance_reservations(reservation_code);
CREATE INDEX IF NOT EXISTS idx_reservations_discount ON balance_reservations(shopify_discount_code);
CREATE INDEX IF NOT EXISTS idx_reservations_status_expiry ON balance_reservations(status, expires_at);

-- Webhook Logs
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_type TEXT NOT NULL, -- 'order_create', 'order_update', 'refund_create'
  shopify_order_id TEXT,
  status TEXT NOT NULL, -- 'success', 'failed', 'pending'
  payload JSONB NOT NULL,
  error_message TEXT,
  processing_time_ms INTEGER,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_type ON webhook_logs(webhook_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_order ON webhook_logs(shopify_order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status, created_at DESC);

-- Balance Audit Log (daily snapshots)
CREATE TABLE IF NOT EXISTS balance_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_date DATE NOT NULL,
  total_users INTEGER NOT NULL,
  total_user_balance DECIMAL(12,2) NOT NULL,
  total_partner_balance DECIMAL(12,2) NOT NULL,
  mismatched_accounts INTEGER NOT NULL,
  total_reservations DECIMAL(12,2) NOT NULL,
  discrepancies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(audit_date)
);

CREATE INDEX IF NOT EXISTS idx_audit_date ON balance_audit_log(audit_date DESC);

-- ============================================================================
-- UPDATE EXISTING TABLES
-- ============================================================================

-- Add Shopify fields to orders table
DO $$
BEGIN
  -- shopify_order_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shopify_order_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN shopify_order_id TEXT UNIQUE;
    CREATE INDEX idx_orders_shopify ON orders(shopify_order_id);
  END IF;

  -- mumbies_cash_used
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'mumbies_cash_used'
  ) THEN
    ALTER TABLE orders ADD COLUMN mumbies_cash_used DECIMAL(10,2) DEFAULT 0;
  END IF;

  -- final_amount
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'final_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN final_amount DECIMAL(10,2);
  END IF;

  -- payment_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
  END IF;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE balance_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own reservations
CREATE POLICY "Users can view own reservations"
  ON balance_reservations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can manage reservations
CREATE POLICY "System can manage reservations"
  ON balance_reservations FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Only service role can access webhook logs
CREATE POLICY "Service role can access webhook logs"
  ON webhook_logs FOR ALL
  TO service_role
  USING (true);

-- Only service role can access audit logs
CREATE POLICY "Service role can access audit logs"
  ON balance_audit_log FOR ALL
  TO service_role
  USING (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Reserve Mumbies Balance for Checkout
CREATE OR REPLACE FUNCTION reserve_mumbies_balance(
  p_user_id UUID,
  p_amount DECIMAL,
  p_cart_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_available_balance DECIMAL;
  v_reserved_amount DECIMAL;
  v_reservation_code TEXT;
  v_expires_at TIMESTAMPTZ;
  v_result JSONB;
BEGIN
  -- Get current balance
  SELECT COALESCE(total_cashback_earned, 0)
  INTO v_available_balance
  FROM users
  WHERE id = p_user_id;

  IF v_available_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance: have $%, need $%',
      v_available_balance, p_amount;
  END IF;

  -- Check existing pending reservations
  SELECT COALESCE(SUM(amount), 0)
  INTO v_reserved_amount
  FROM balance_reservations
  WHERE user_id = p_user_id
  AND status = 'pending'
  AND expires_at > NOW();

  IF (v_available_balance - v_reserved_amount) < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance: $% reserved, $% available, $% needed',
      v_reserved_amount, (v_available_balance - v_reserved_amount), p_amount;
  END IF;

  -- Generate unique reservation code
  v_reservation_code := 'MUMBIES-' || UPPER(
    encode(gen_random_bytes(6), 'hex')
  );

  -- Set expiry (15 minutes)
  v_expires_at := NOW() + INTERVAL '15 minutes';

  -- Create reservation
  INSERT INTO balance_reservations (
    user_id,
    reservation_code,
    shopify_discount_code,
    shopify_cart_id,
    amount,
    expires_at
  ) VALUES (
    p_user_id,
    v_reservation_code,
    v_reservation_code, -- Same as reservation code for simplicity
    p_cart_id,
    p_amount,
    v_expires_at
  );

  v_result := jsonb_build_object(
    'success', true,
    'reservation_code', v_reservation_code,
    'discount_code', v_reservation_code,
    'amount', p_amount,
    'expires_at', v_expires_at,
    'available_balance', v_available_balance - v_reserved_amount - p_amount
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Process Mumbies Order (Called by Webhook)
CREATE OR REPLACE FUNCTION process_mumbies_order(
  p_reservation_code TEXT,
  p_shopify_order_id TEXT,
  p_subtotal DECIMAL,
  p_total DECIMAL
)
RETURNS JSONB AS $$
DECLARE
  v_reservation RECORD;
  v_user_id UUID;
  v_amount DECIMAL;
  v_nonprofit_id UUID;
BEGIN
  -- Lock reservation
  SELECT * INTO v_reservation
  FROM balance_reservations
  WHERE reservation_code = p_reservation_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found: %', p_reservation_code;
  END IF;

  -- Check status
  IF v_reservation.status = 'completed' THEN
    -- Already processed (idempotency)
    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'mumbies_used', v_reservation.amount
    );
  END IF;

  IF v_reservation.status != 'pending' THEN
    RAISE EXCEPTION 'Invalid reservation status: %', v_reservation.status;
  END IF;

  -- Check expiry
  IF v_reservation.expires_at < NOW() THEN
    RAISE EXCEPTION 'Reservation expired at %', v_reservation.expires_at;
  END IF;

  v_user_id := v_reservation.user_id;
  v_amount := v_reservation.amount;

  -- Get nonprofit_id for this user (if they're a partner)
  SELECT id INTO v_nonprofit_id
  FROM nonprofits
  WHERE auth_user_id = v_user_id;

  -- Deduct from user balance
  UPDATE users
  SET total_cashback_earned = total_cashback_earned - v_amount
  WHERE id = v_user_id
  AND total_cashback_earned >= v_amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient balance for user % at completion time', v_user_id;
  END IF;

  -- Sync to partner balance if applicable
  IF v_nonprofit_id IS NOT NULL THEN
    UPDATE nonprofits
    SET mumbies_cash_balance = mumbies_cash_balance - v_amount
    WHERE id = v_nonprofit_id;
  END IF;

  -- Mark reservation completed
  UPDATE balance_reservations
  SET
    status = 'completed',
    completed_at = NOW(),
    shopify_order_id = p_shopify_order_id
  WHERE id = v_reservation.id;

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
    reference_id,
    reference_type,
    metadata
  )
  SELECT
    v_user_id,
    v_nonprofit_id,
    'shopping',
    -v_amount,
    'mumbies_cash',
    total_cashback_earned + v_amount,
    total_cashback_earned,
    format('Order #%s on Mumbies.com', p_shopify_order_id),
    p_shopify_order_id::TEXT::UUID,
    'shopify_order',
    jsonb_build_object(
      'subtotal', p_subtotal,
      'mumbies_used', v_amount,
      'final_amount', p_total,
      'reservation_code', p_reservation_code
    )
  FROM users WHERE id = v_user_id;

  -- Record order in our system
  INSERT INTO orders (
    order_number,
    user_id,
    shopify_order_id,
    subtotal,
    mumbies_cash_used,
    final_amount,
    status,
    payment_status,
    attributed_rescue_id
  )
  SELECT
    'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('orders_id_seq')::TEXT, 6, '0'),
    v_user_id,
    p_shopify_order_id,
    p_subtotal,
    v_amount,
    p_total,
    'completed',
    'paid',
    attributed_rescue_id
  FROM users WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'mumbies_used', v_amount,
    'user_id', v_user_id,
    'reservation_id', v_reservation.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Expire Old Reservations
CREATE OR REPLACE FUNCTION expire_old_reservations()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE balance_reservations
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Daily Balance Reconciliation
CREATE OR REPLACE FUNCTION daily_balance_reconciliation()
RETURNS JSONB AS $$
DECLARE
  v_total_users INTEGER;
  v_total_user_balance DECIMAL;
  v_total_partner_balance DECIMAL;
  v_mismatched INTEGER;
  v_total_reservations DECIMAL;
  v_discrepancies JSONB;
  v_result JSONB;
BEGIN
  -- Count total users with balance
  SELECT COUNT(*) INTO v_total_users
  FROM users WHERE total_cashback_earned > 0;

  -- Sum user balances
  SELECT COALESCE(SUM(total_cashback_earned), 0)
  INTO v_total_user_balance
  FROM users;

  -- Sum partner balances
  SELECT COALESCE(SUM(mumbies_cash_balance), 0)
  INTO v_total_partner_balance
  FROM nonprofits;

  -- Find mismatches
  SELECT
    COUNT(*),
    jsonb_agg(
      jsonb_build_object(
        'user_id', u.id,
        'email', u.email,
        'user_balance', u.total_cashback_earned,
        'partner_balance', COALESCE(n.mumbies_cash_balance, 0),
        'difference', u.total_cashback_earned - COALESCE(n.mumbies_cash_balance, 0)
      )
    )
  INTO v_mismatched, v_discrepancies
  FROM users u
  LEFT JOIN nonprofits n ON n.auth_user_id = u.id
  WHERE u.total_cashback_earned != COALESCE(n.mumbies_cash_balance, 0)
  AND u.total_cashback_earned > 0;

  -- Sum pending reservations
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_reservations
  FROM balance_reservations
  WHERE status = 'pending'
  AND expires_at > NOW();

  -- Insert audit record
  INSERT INTO balance_audit_log (
    audit_date,
    total_users,
    total_user_balance,
    total_partner_balance,
    mismatched_accounts,
    total_reservations,
    discrepancies
  ) VALUES (
    CURRENT_DATE,
    v_total_users,
    v_total_user_balance,
    v_total_partner_balance,
    v_mismatched,
    v_total_reservations,
    COALESCE(v_discrepancies, '[]'::jsonb)
  )
  ON CONFLICT (audit_date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    total_user_balance = EXCLUDED.total_user_balance,
    total_partner_balance = EXCLUDED.total_partner_balance,
    mismatched_accounts = EXCLUDED.mismatched_accounts,
    total_reservations = EXCLUDED.total_reservations,
    discrepancies = EXCLUDED.discrepancies,
    created_at = NOW();

  v_result := jsonb_build_object(
    'audit_date', CURRENT_DATE,
    'total_users', v_total_users,
    'total_user_balance', v_total_user_balance,
    'total_partner_balance', v_total_partner_balance,
    'mismatched_accounts', v_mismatched,
    'total_reservations', v_total_reservations,
    'health_status', CASE
      WHEN v_mismatched = 0 THEN 'healthy'
      WHEN v_mismatched < 5 THEN 'warning'
      ELSE 'critical'
    END
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE balance_reservations IS 'Tracks Mumbies Cash reservations during Shopify checkout';
COMMENT ON TABLE webhook_logs IS 'Audit trail for all Shopify webhook processing';
COMMENT ON TABLE balance_audit_log IS 'Daily snapshots for balance reconciliation and monitoring';

COMMENT ON FUNCTION reserve_mumbies_balance IS 'Reserve Mumbies Cash for checkout (15min expiry)';
COMMENT ON FUNCTION process_mumbies_order IS 'Process order from Shopify webhook (atomic transaction)';
COMMENT ON FUNCTION expire_old_reservations IS 'Clean up expired reservations (run every minute)';
COMMENT ON FUNCTION daily_balance_reconciliation IS 'Daily health check for balance accuracy';
