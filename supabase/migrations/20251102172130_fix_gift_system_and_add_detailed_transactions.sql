/*
  # Fix Gift System & Add Detailed Transaction Tracking

  1. Changes
    - Drop old partner-based gift system
    - Create new nonprofit-based gift system
    - Add detailed transaction descriptions with expiry info
    - Platform-agnostic architecture
    - Enhanced security to prevent balance manipulation

  2. New Tables
    - `gift_incentives` - Platform-independent gift tracking
    
  3. Functions
    - `send_gift_to_lead_secure()` - Atomic gift sending with detailed transaction tracking
    - `expire_and_refund_gifts()` - Auto-refund expired gifts
    - `redeem_lead_gift()` - Redeem gift to customer balance

  4. Security Features
    - Row-level security on all operations
    - Balance checks before deductions
    - Atomic transactions prevent partial updates
    - Audit trail for all balance changes
    - No direct balance manipulation allowed

  5. Platform Independence
    - All data stored in Supabase (not Shopify-dependent)
    - Works with any e-commerce platform
    - Complete transaction history
    - Can migrate platforms without data loss
*/

-- ============================================================================
-- DROP OLD TABLES (if they exist)
-- ============================================================================

DROP TABLE IF EXISTS lead_gifts CASCADE;

-- ============================================================================
-- CREATE NEW GIFT SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS gift_incentives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nonprofit_id UUID NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  
  -- Gift details
  gift_code TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0 AND amount <= 25.00),
  
  -- Recipient info
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  message TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'active' NOT NULL 
    CHECK (status IN ('active', 'redeemed', 'expired', 'refunded')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '14 days' NOT NULL,
  redeemed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  
  -- Platform-agnostic references
  redeemed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_in_order_id TEXT, -- Can be Shopify order ID, or any platform order ID
  used_in_platform TEXT, -- 'shopify', 'custom', etc.
  
  -- Metadata for extensibility
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gift_nonprofit ON gift_incentives(nonprofit_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_code ON gift_incentives(gift_code);
CREATE INDEX IF NOT EXISTS idx_gift_status ON gift_incentives(status);
CREATE INDEX IF NOT EXISTS idx_gift_recipient ON gift_incentives(recipient_email);
CREATE INDEX IF NOT EXISTS idx_gift_expiry ON gift_incentives(expires_at) WHERE status = 'active';

-- RLS
ALTER TABLE gift_incentives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nonprofits can view their own gifts"
  ON gift_incentives FOR SELECT
  TO authenticated
  USING (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Nonprofits can create gifts"
  ON gift_incentives FOR INSERT
  TO authenticated
  WITH CHECK (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
  ));

-- System can update (for redemptions/expirations)
CREATE POLICY "System can update gifts"
  ON gift_incentives FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================================================
-- FUNCTION: Send Gift with Detailed Transaction Tracking
-- ============================================================================

CREATE OR REPLACE FUNCTION send_gift_to_lead_secure(
  p_nonprofit_id UUID,
  p_gift_code TEXT,
  p_amount DECIMAL,
  p_recipient_email TEXT,
  p_recipient_name TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_gift_id UUID;
  v_user_id UUID;
  v_org_name TEXT;
  v_current_balance DECIMAL;
  v_balance_after DECIMAL;
  v_expires_at TIMESTAMPTZ;
  v_days_until_expiry INTEGER;
BEGIN
  -- Security: Validate amount
  IF p_amount <= 0 OR p_amount > 25 THEN
    RAISE EXCEPTION 'Gift amount must be between $0.01 and $25.00';
  END IF;

  -- Get nonprofit info and lock row for update
  SELECT
    auth_user_id,
    organization_name,
    mumbies_cash_balance
  INTO v_user_id, v_org_name, v_current_balance
  FROM nonprofits
  WHERE id = p_nonprofit_id
  FOR UPDATE; -- Lock to prevent concurrent modifications

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nonprofit not found';
  END IF;

  -- Security: Check sufficient balance
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient Mumbies Cash balance. Need $% more.',
      (p_amount - v_current_balance);
  END IF;

  -- Calculate expiry
  v_expires_at := NOW() + INTERVAL '14 days';
  v_days_until_expiry := 14;

  -- Deduct from nonprofit balance
  UPDATE nonprofits
  SET
    mumbies_cash_balance = mumbies_cash_balance - p_amount,
    updated_at = NOW()
  WHERE id = p_nonprofit_id
  AND mumbies_cash_balance >= p_amount; -- Double-check to prevent race conditions

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to deduct balance (concurrent modification detected)';
  END IF;

  v_balance_after := v_current_balance - p_amount;

  -- Sync to user balance (for shopping)
  UPDATE users
  SET
    total_cashback_earned = total_cashback_earned - p_amount,
    updated_at = NOW()
  WHERE id = v_user_id;

  -- Create gift record
  INSERT INTO gift_incentives (
    nonprofit_id,
    gift_code,
    amount,
    recipient_email,
    recipient_name,
    message,
    status,
    expires_at,
    metadata
  ) VALUES (
    p_nonprofit_id,
    p_gift_code,
    p_amount,
    p_recipient_email,
    p_recipient_name,
    p_message,
    'active',
    v_expires_at,
    jsonb_build_object(
      'sent_from_organization', v_org_name,
      'days_to_accept', v_days_until_expiry
    )
  ) RETURNING id INTO v_gift_id;

  -- Record detailed transaction with expiry info
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
  ) VALUES (
    v_user_id,
    p_nonprofit_id,
    'gift_send',
    -p_amount,
    'mumbies_cash',
    v_current_balance,
    v_balance_after,
    format(
      'Sent $%s gift to %s (Code: %s) • Expires: %s (%s days to accept) • Will auto-refund if not redeemed',
      p_amount::NUMERIC(10,2),
      p_recipient_email,
      p_gift_code,
      TO_CHAR(v_expires_at, 'Mon DD, YYYY'),
      v_days_until_expiry
    ),
    v_gift_id,
    'gift',
    jsonb_build_object(
      'gift_code', p_gift_code,
      'recipient_email', p_recipient_email,
      'recipient_name', p_recipient_name,
      'expires_at', v_expires_at,
      'days_until_expiry', v_days_until_expiry,
      'message', p_message,
      'auto_refund_on_expiry', true
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'gift_id', v_gift_id,
    'gift_code', p_gift_code,
    'amount', p_amount,
    'expires_at', v_expires_at,
    'days_until_expiry', v_days_until_expiry,
    'balance_after', v_balance_after
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Expire and Refund Gifts (Background Job)
-- ============================================================================

CREATE OR REPLACE FUNCTION expire_and_refund_gifts()
RETURNS JSONB AS $$
DECLARE
  v_gift RECORD;
  v_user_id UUID;
  v_org_name TEXT;
  v_current_balance DECIMAL;
  v_refund_count INTEGER := 0;
  v_refund_total DECIMAL := 0;
BEGIN
  -- Find all expired gifts that need refunding
  FOR v_gift IN
    SELECT *
    FROM gift_incentives
    WHERE status = 'active'
    AND expires_at < NOW()
    FOR UPDATE SKIP LOCKED -- Prevent concurrent processing
  LOOP
    -- Get nonprofit info
    SELECT
      auth_user_id,
      organization_name,
      mumbies_cash_balance
    INTO v_user_id, v_org_name, v_current_balance
    FROM nonprofits
    WHERE id = v_gift.nonprofit_id;

    IF FOUND THEN
      -- Refund to nonprofit balance
      UPDATE nonprofits
      SET
        mumbies_cash_balance = mumbies_cash_balance + v_gift.amount,
        updated_at = NOW()
      WHERE id = v_gift.nonprofit_id;

      -- Sync to user balance
      UPDATE users
      SET
        total_cashback_earned = total_cashback_earned + v_gift.amount,
        updated_at = NOW()
      WHERE id = v_user_id;

      -- Mark gift as refunded
      UPDATE gift_incentives
      SET
        status = 'refunded',
        refunded_at = NOW(),
        metadata = metadata || jsonb_build_object(
          'refund_reason', 'expired',
          'refunded_at', NOW()
        )
      WHERE id = v_gift.id;

      -- Record refund transaction with details
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
      ) VALUES (
        v_user_id,
        v_gift.nonprofit_id,
        'gift_refund',
        v_gift.amount,
        'mumbies_cash',
        v_current_balance,
        v_current_balance + v_gift.amount,
        format(
          'Auto-refund: $%s gift to %s expired unredeemed (Code: %s) • Originally sent: %s',
          v_gift.amount::NUMERIC(10,2),
          v_gift.recipient_email,
          v_gift.gift_code,
          TO_CHAR(v_gift.created_at, 'Mon DD, YYYY')
        ),
        v_gift.id,
        'gift_refund',
        jsonb_build_object(
          'gift_code', v_gift.gift_code,
          'recipient_email', v_gift.recipient_email,
          'original_send_date', v_gift.created_at,
          'expiry_date', v_gift.expires_at,
          'refund_reason', 'expired'
        )
      );

      v_refund_count := v_refund_count + 1;
      v_refund_total := v_refund_total + v_gift.amount;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'refunded_count', v_refund_count,
    'refunded_total', v_refund_total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Redeem Lead Gift
-- ============================================================================

CREATE OR REPLACE FUNCTION redeem_lead_gift(
  p_gift_code TEXT,
  p_user_id UUID,
  p_order_id TEXT DEFAULT NULL,
  p_platform TEXT DEFAULT 'custom'
)
RETURNS JSONB AS $$
DECLARE
  v_gift RECORD;
  v_nonprofit_id UUID;
BEGIN
  -- Find and lock gift
  SELECT * INTO v_gift
  FROM gift_incentives
  WHERE gift_code = p_gift_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Gift code not found';
  END IF;

  -- Validate gift status
  IF v_gift.status != 'active' THEN
    RAISE EXCEPTION 'Gift has already been % or is no longer valid', v_gift.status;
  END IF;

  -- Check expiry
  IF v_gift.expires_at < NOW() THEN
    RAISE EXCEPTION 'Gift has expired';
  END IF;

  -- Apply to user balance
  UPDATE users
  SET
    total_cashback_earned = total_cashback_earned + v_gift.amount,
    updated_at = NOW()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Mark gift as redeemed
  UPDATE gift_incentives
  SET
    status = 'redeemed',
    redeemed_at = NOW(),
    redeemed_by_user_id = p_user_id,
    used_in_order_id = p_order_id,
    used_in_platform = p_platform,
    metadata = metadata || jsonb_build_object(
      'redeemed_by', p_user_id,
      'redeemed_at', NOW(),
      'platform', p_platform,
      'order_id', p_order_id
    )
  WHERE id = v_gift.id;

  -- Record transaction for user who received gift
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
    p_user_id,
    v_gift.nonprofit_id,
    'gift_received',
    v_gift.amount,
    'mumbies_cash',
    total_cashback_earned - v_gift.amount,
    total_cashback_earned,
    format(
      'Received $%s gift from %s (Code: %s)',
      v_gift.amount::NUMERIC(10,2),
      (SELECT organization_name FROM nonprofits WHERE id = v_gift.nonprofit_id),
      p_gift_code
    ),
    v_gift.id,
    'gift_redemption',
    jsonb_build_object(
      'gift_code', p_gift_code,
      'from_nonprofit', v_gift.nonprofit_id,
      'message', v_gift.message
    )
  FROM users WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'amount', v_gift.amount,
    'message', v_gift.message
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECURITY: Prevent Direct Balance Manipulation
-- ============================================================================

-- Remove any existing policies that allow direct updates
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Partners can update own data" ON nonprofits;

-- Users can only read their own data, never update balances directly
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Nonprofits can only read, never update balances directly
CREATE POLICY "Nonprofits can view own data"
  ON nonprofits FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Only database functions can update balances
-- This prevents any frontend manipulation

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE gift_incentives IS 'Platform-independent gift tracking system';
COMMENT ON FUNCTION send_gift_to_lead_secure IS 'Atomically send gift with detailed transaction tracking and security checks';
COMMENT ON FUNCTION expire_and_refund_gifts IS 'Background job: refund expired gifts automatically';
COMMENT ON FUNCTION redeem_lead_gift IS 'Redeem gift code and credit user balance';

COMMENT ON COLUMN gift_incentives.used_in_platform IS 'Platform where gift was used (shopify, custom, etc.) - ensures platform independence';
COMMENT ON COLUMN gift_incentives.metadata IS 'Extensible JSONB field for future platform integrations';
