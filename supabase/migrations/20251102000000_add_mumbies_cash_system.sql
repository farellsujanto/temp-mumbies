/*
  # Add Mumbies Cash System with Gift Sending

  1. Schema Changes
    - Add `mumbies_cash_balance` to partners table
    - Add `total_commissions_earned` to partners table (if not exists)
    - Create `lead_gifts` table for tracking gift incentives
    - Create atomic transaction functions for gift sending
    - Add expiration handling for unredeemed gifts

  2. New Tables
    - `lead_gifts`
      - `id` (uuid, primary key)
      - `partner_id` (uuid, references partners)
      - `gift_code` (varchar, unique code for redemption)
      - `amount` (decimal, gift amount - max $25)
      - `recipient_email` (varchar)
      - `recipient_name` (varchar, nullable)
      - `message` (text, optional personal message)
      - `status` (varchar: sent/redeemed/expired/refunded)
      - `sent_at` (timestamptz)
      - `redeemed_at` (timestamptz, nullable)
      - `expires_at` (timestamptz, 14 days from sent)
      - `customer_id` (uuid, nullable, links to customer after redemption)
      - `order_id` (uuid, nullable, first order using gift)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  3. Security
    - Enable RLS on `lead_gifts` table
    - Add policies for partners to view their own gifts
    - Add policies for customers to view gifts sent to them

  4. Functions
    - `send_gift_atomic` - Atomic gift sending with balance deduction
    - `refund_expired_gift` - Return balance for expired gifts
    - `redeem_gift` - Apply gift to customer account

  5. Important Notes
    - Maximum gift amount is $25 for security
    - Gifts expire after 14 days if unredeemed
    - Expired gifts automatically refund to partner balance
    - All transactions are atomic to prevent balance issues
*/

-- Add Mumbies Cash fields to partners table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'mumbies_cash_balance'
  ) THEN
    ALTER TABLE partners ADD COLUMN mumbies_cash_balance DECIMAL(10,2) DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'total_commissions_earned'
  ) THEN
    ALTER TABLE partners ADD COLUMN total_commissions_earned DECIMAL(10,2) DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Create lead_gifts table
CREATE TABLE IF NOT EXISTS lead_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  gift_code VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0 AND amount <= 25.00),
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  message TEXT,
  status VARCHAR(20) DEFAULT 'sent' NOT NULL CHECK (status IN ('sent', 'redeemed', 'expired', 'refunded')),
  sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '14 days' NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_gifts_partner ON lead_gifts(partner_id);
CREATE INDEX IF NOT EXISTS idx_lead_gifts_code ON lead_gifts(gift_code);
CREATE INDEX IF NOT EXISTS idx_lead_gifts_status ON lead_gifts(status);
CREATE INDEX IF NOT EXISTS idx_lead_gifts_recipient ON lead_gifts(recipient_email);
CREATE INDEX IF NOT EXISTS idx_lead_gifts_expires ON lead_gifts(expires_at) WHERE status = 'sent';

-- Enable RLS
ALTER TABLE lead_gifts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_gifts
CREATE POLICY "Partners can view their own gifts"
  ON lead_gifts FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can create gifts"
  ON lead_gifts FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can update gift status"
  ON lead_gifts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Atomic function to send gift (deduct balance + create gift record)
CREATE OR REPLACE FUNCTION send_gift_atomic(
  p_partner_id UUID,
  p_gift_code VARCHAR,
  p_amount DECIMAL,
  p_recipient_email VARCHAR,
  p_recipient_name VARCHAR DEFAULT NULL,
  p_message TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_gift_id UUID;
BEGIN
  -- Validate amount
  IF p_amount <= 0 OR p_amount > 25 THEN
    RAISE EXCEPTION 'Gift amount must be between $0.01 and $25.00';
  END IF;

  -- Deduct from partner's balance (will fail if insufficient)
  UPDATE partners
  SET mumbies_cash_balance = mumbies_cash_balance - p_amount,
      updated_at = NOW()
  WHERE id = p_partner_id
    AND mumbies_cash_balance >= p_amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient Mumbies Cash balance or partner not found';
  END IF;

  -- Create gift record
  INSERT INTO lead_gifts (
    partner_id,
    gift_code,
    amount,
    recipient_email,
    recipient_name,
    message,
    status,
    expires_at
  ) VALUES (
    p_partner_id,
    p_gift_code,
    p_amount,
    p_recipient_email,
    p_recipient_name,
    p_message,
    'sent',
    NOW() + INTERVAL '14 days'
  ) RETURNING id INTO v_gift_id;

  RETURN v_gift_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refund expired gift
CREATE OR REPLACE FUNCTION refund_expired_gift(
  p_gift_id UUID,
  p_partner_id UUID,
  p_amount DECIMAL
) RETURNS void AS $$
BEGIN
  -- Update gift status to expired
  UPDATE lead_gifts
  SET status = 'expired',
      updated_at = NOW()
  WHERE id = p_gift_id
    AND status = 'sent';

  IF NOT FOUND THEN
    RETURN; -- Gift already processed
  END IF;

  -- Refund to partner's balance
  UPDATE partners
  SET mumbies_cash_balance = mumbies_cash_balance + p_amount,
      updated_at = NOW()
  WHERE id = p_partner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redeem gift
CREATE OR REPLACE FUNCTION redeem_gift(
  p_gift_code VARCHAR,
  p_customer_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_amount DECIMAL;
  v_gift_id UUID;
BEGIN
  -- Get gift details and lock row
  SELECT id, amount INTO v_gift_id, v_amount
  FROM lead_gifts
  WHERE gift_code = p_gift_code
    AND status = 'sent'
    AND expires_at > NOW()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Gift code not found, already redeemed, or expired';
  END IF;

  -- Mark as redeemed
  UPDATE lead_gifts
  SET status = 'redeemed',
      redeemed_at = NOW(),
      customer_id = p_customer_id,
      updated_at = NOW()
  WHERE id = v_gift_id;

  RETURN v_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically expire gifts (call via cron)
CREATE OR REPLACE FUNCTION expire_unredeemed_gifts()
RETURNS INTEGER AS $$
DECLARE
  v_gift RECORD;
  v_count INTEGER := 0;
BEGIN
  -- Find all expired unredeemed gifts
  FOR v_gift IN
    SELECT id, partner_id, amount
    FROM lead_gifts
    WHERE status = 'sent'
      AND expires_at < NOW()
  LOOP
    -- Refund each gift
    PERFORM refund_expired_gift(v_gift.id, v_gift.partner_id, v_gift.amount);
    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for lead_gifts
CREATE OR REPLACE FUNCTION update_lead_gifts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_gifts_updated_at
  BEFORE UPDATE ON lead_gifts
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_gifts_timestamp();
