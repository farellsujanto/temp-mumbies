/*
  # Create Partner Transactions System

  1. New Tables
    - `partner_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - The auth user
      - `nonprofit_id` (uuid, references nonprofits, nullable)
      - `transaction_type` (varchar: commission, referral, withdrawal, conversion, gift_send, gift_refund, shopping, giveaway)
      - `amount` (decimal, can be negative for debits)
      - `balance_type` (varchar: cash_balance, mumbies_cash)
      - `balance_before` (decimal)
      - `balance_after` (decimal)
      - `description` (text)
      - `reference_id` (uuid, nullable - links to related record)
      - `reference_type` (varchar, nullable - what the reference_id points to)
      - `created_at` (timestamptz)

  2. Functions
    - `sync_partner_shopping_balance()` - Syncs nonprofit Mumbies Cash to user shopping balance
    - `record_transaction()` - Records a transaction and updates balances

  3. Security
    - Enable RLS on `partner_transactions`
    - Users can view their own transactions
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS partner_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nonprofit_id UUID REFERENCES nonprofits(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
    'commission', 'referral', 'withdrawal', 'conversion', 
    'gift_send', 'gift_refund', 'shopping', 'giveaway', 
    'manual_adjustment', 'reward_redemption'
  )),
  amount DECIMAL(10,2) NOT NULL,
  balance_type VARCHAR(20) NOT NULL CHECK (balance_type IN ('cash_balance', 'mumbies_cash')),
  balance_before DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference_id UUID,
  reference_type VARCHAR(50),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_partner_transactions_user ON partner_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_transactions_nonprofit ON partner_transactions(nonprofit_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_transactions_type ON partner_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_partner_transactions_reference ON partner_transactions(reference_id, reference_type);

-- Enable RLS
ALTER TABLE partner_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON partner_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert transactions
CREATE POLICY "System can insert transactions"
  ON partner_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to sync partner Mumbies Cash to shopping balance
CREATE OR REPLACE FUNCTION sync_partner_shopping_balance(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_mumbies_cash DECIMAL(10,2);
BEGIN
  -- Get partner's Mumbies Cash balance
  SELECT COALESCE(mumbies_cash_balance, 0)
  INTO v_mumbies_cash
  FROM nonprofits
  WHERE auth_user_id = p_user_id;

  -- Update user's shopping balance
  IF FOUND THEN
    UPDATE users
    SET total_cashback_earned = v_mumbies_cash
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a transaction
CREATE OR REPLACE FUNCTION record_transaction(
  p_user_id UUID,
  p_nonprofit_id UUID,
  p_transaction_type VARCHAR,
  p_amount DECIMAL,
  p_balance_type VARCHAR,
  p_description TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type VARCHAR DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_balance_before DECIMAL(10,2);
  v_balance_after DECIMAL(10,2);
BEGIN
  -- Get current balance based on balance type
  IF p_balance_type = 'cash_balance' THEN
    SELECT COALESCE(total_commissions_earned, 0) + COALESCE(total_referral_earnings, 0)
    INTO v_balance_before
    FROM nonprofits
    WHERE id = p_nonprofit_id;
  ELSE -- mumbies_cash
    SELECT COALESCE(mumbies_cash_balance, 0)
    INTO v_balance_before
    FROM nonprofits
    WHERE id = p_nonprofit_id;
  END IF;

  v_balance_after := v_balance_before + p_amount;

  -- Insert transaction record
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
    p_user_id,
    p_nonprofit_id,
    p_transaction_type,
    p_amount,
    p_balance_type,
    v_balance_before,
    v_balance_after,
    p_description,
    p_reference_id,
    p_reference_type,
    p_metadata
  ) RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to convert cash balance to Mumbies Cash
CREATE OR REPLACE FUNCTION convert_cash_to_mumbies(
  p_user_id UUID,
  p_nonprofit_id UUID,
  p_amount DECIMAL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_available_cash DECIMAL(10,2);
  v_bonus_amount DECIMAL(10,2);
  v_total_mumbies DECIMAL(10,2);
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  -- Get available cash balance
  SELECT COALESCE(total_commissions_earned, 0) + COALESCE(total_referral_earnings, 0)
  INTO v_available_cash
  FROM nonprofits
  WHERE id = p_nonprofit_id AND auth_user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Partner not found';
  END IF;

  IF v_available_cash < p_amount THEN
    RAISE EXCEPTION 'Insufficient cash balance';
  END IF;

  -- Calculate bonus (10%)
  v_bonus_amount := p_amount * 0.10;
  v_total_mumbies := p_amount + v_bonus_amount;

  -- Deduct from cash balance (split proportionally between commissions and referrals)
  UPDATE nonprofits
  SET total_commissions_earned = GREATEST(0, total_commissions_earned - p_amount),
      mumbies_cash_balance = mumbies_cash_balance + v_total_mumbies
  WHERE id = p_nonprofit_id;

  -- Record debit transaction
  v_transaction_id := record_transaction(
    p_user_id,
    p_nonprofit_id,
    'conversion',
    -p_amount,
    'cash_balance',
    format('Converted $%s to Mumbies Cash', p_amount::text),
    NULL,
    NULL,
    jsonb_build_object('original_amount', p_amount, 'bonus', v_bonus_amount)
  );

  -- Record credit transaction
  v_transaction_id := record_transaction(
    p_user_id,
    p_nonprofit_id,
    'conversion',
    v_total_mumbies,
    'mumbies_cash',
    format('Converted $%s Cash Balance to $%s Mumbies Cash (+10%% bonus)', 
      p_amount::text, v_total_mumbies::text),
    v_transaction_id,
    'conversion',
    jsonb_build_object('original_amount', p_amount, 'bonus', v_bonus_amount)
  );

  -- Sync to shopping balance
  PERFORM sync_partner_shopping_balance(p_user_id);

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync shopping balance when Mumbies Cash changes
CREATE OR REPLACE FUNCTION sync_shopping_balance_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.mumbies_cash_balance != OLD.mumbies_cash_balance THEN
    PERFORM sync_partner_shopping_balance(NEW.auth_user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_shopping_balance_on_mumbies_change ON nonprofits;
CREATE TRIGGER sync_shopping_balance_on_mumbies_change
  AFTER UPDATE OF mumbies_cash_balance ON nonprofits
  FOR EACH ROW
  WHEN (NEW.mumbies_cash_balance IS DISTINCT FROM OLD.mumbies_cash_balance)
  EXECUTE FUNCTION sync_shopping_balance_trigger();

-- Sync existing balances
DO $$
DECLARE
  v_nonprofit RECORD;
BEGIN
  FOR v_nonprofit IN SELECT id, auth_user_id, mumbies_cash_balance FROM nonprofits WHERE auth_user_id IS NOT NULL
  LOOP
    PERFORM sync_partner_shopping_balance(v_nonprofit.auth_user_id);
  END LOOP;
END $$;
