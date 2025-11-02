/*
  # Fix send_gift_to_lead_secure Function - Correct transaction type

  1. Changes
    - Change transaction_type from 'gift_sent' to 'gift_send' to match CHECK constraint
    - This is the only allowed value for gift sending transactions
*/

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
  v_balance_before DECIMAL;
  v_balance_after DECIMAL;
  v_nonprofit_name TEXT;
  v_auth_user_id UUID;
BEGIN
  -- Validate amount
  IF p_amount <= 0 OR p_amount > 25 THEN
    RAISE EXCEPTION 'Gift amount must be between $0.01 and $25.00';
  END IF;

  -- Get nonprofit info including auth_user_id
  SELECT 
    organization_name,
    mumbies_cash_balance,
    auth_user_id
  INTO v_nonprofit_name, v_balance_before, v_auth_user_id
  FROM nonprofits
  WHERE id = p_nonprofit_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nonprofit not found';
  END IF;

  -- Check sufficient balance
  IF v_balance_before < p_amount THEN
    RAISE EXCEPTION 'Insufficient Mumbies Cash balance';
  END IF;

  -- Calculate new balance
  v_balance_after := v_balance_before - p_amount;

  -- Deduct from nonprofit balance
  UPDATE nonprofits
  SET mumbies_cash_balance = mumbies_cash_balance - p_amount
  WHERE id = p_nonprofit_id
  AND mumbies_cash_balance >= p_amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient balance or concurrent update';
  END IF;

  -- Create gift incentive
  INSERT INTO gift_incentives (
    nonprofit_id,
    gift_code,
    amount,
    recipient_email,
    recipient_name,
    message,
    status,
    expires_at
  ) VALUES (
    p_nonprofit_id,
    p_gift_code,
    p_amount,
    p_recipient_email,
    p_recipient_name,
    p_message,
    'active',
    NOW() + INTERVAL '14 days'
  )
  RETURNING id INTO v_gift_id;

  -- Record detailed transaction (changed gift_sent to gift_send)
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
    v_auth_user_id,
    p_nonprofit_id,
    'gift_send',
    -p_amount,
    'mumbies_cash',
    v_balance_before,
    v_balance_after,
    format('Sent $%s gift to %s', p_amount, p_recipient_email),
    v_gift_id,
    'gift',
    jsonb_build_object(
      'gift_id', v_gift_id,
      'gift_code', p_gift_code,
      'recipient_email', p_recipient_email,
      'recipient_name', p_recipient_name
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'gift_id', v_gift_id,
    'gift_code', p_gift_code,
    'balance_after', v_balance_after
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION send_gift_to_lead_secure IS 'Atomically send gift to lead, deduct from nonprofit balance, and record transaction';
