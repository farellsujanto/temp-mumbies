/*
  # Add Opportunities System for Partner Dashboard

  1. Schema Changes
    - Add `average_adoptions_per_year` to nonprofits table
    - Create `partner_leads` table to track registered users/leads
    - Create `partner_incentives` table to track gifts sent to leads
    - Create `lead_balances` table to track gift balances for leads

  2. Tables
    - `partner_leads`: Tracks leads referred by partners with expiration dates
    - `partner_incentives`: Records of gifts sent from partners to leads
    - `lead_balances`: Current balance of gifts for each lead

  3. Security
    - Enable RLS on all new tables
    - Add policies for partner access to their own data
*/

-- Add average adoptions field to nonprofits
ALTER TABLE nonprofits
ADD COLUMN IF NOT EXISTS average_adoptions_per_year integer;

-- Create partner_leads table
CREATE TABLE IF NOT EXISTS partner_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES nonprofits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  registered_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz NOT NULL,
  first_purchase_at timestamptz,
  total_spent decimal(10,2) DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'converted', 'expired')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partner_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own leads"
  ON partner_leads FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE partner_user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_partner_leads_partner_id ON partner_leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_leads_expires_at ON partner_leads(expires_at);
CREATE INDEX IF NOT EXISTS idx_partner_leads_status ON partner_leads(status);

-- Create partner_incentives table
CREATE TABLE IF NOT EXISTS partner_incentives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES nonprofits(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES partner_leads(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  refunded_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'refunded')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partner_incentives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own incentives"
  ON partner_incentives FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE partner_user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can create incentives"
  ON partner_incentives FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE partner_user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_partner_incentives_partner_id ON partner_incentives(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_incentives_lead_id ON partner_incentives(lead_id);
CREATE INDEX IF NOT EXISTS idx_partner_incentives_expires_at ON partner_incentives(expires_at);

-- Create lead_balances table
CREATE TABLE IF NOT EXISTS lead_balances (
  lead_id uuid PRIMARY KEY REFERENCES partner_leads(id) ON DELETE CASCADE,
  balance decimal(10,2) DEFAULT 0 NOT NULL,
  lifetime_received decimal(10,2) DEFAULT 0 NOT NULL,
  lifetime_spent decimal(10,2) DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lead_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own balance"
  ON lead_balances FOR SELECT
  TO authenticated
  USING (
    lead_id IN (
      SELECT id FROM partner_leads WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can view lead balances"
  ON lead_balances FOR SELECT
  TO authenticated
  USING (
    lead_id IN (
      SELECT id FROM partner_leads
      WHERE partner_id IN (
        SELECT id FROM nonprofits WHERE partner_user_id = auth.uid()
      )
    )
  );

-- Function to automatically expire incentives and refund
CREATE OR REPLACE FUNCTION expire_and_refund_incentives()
RETURNS void AS $$
BEGIN
  -- Mark expired incentives as refunded
  UPDATE partner_incentives
  SET status = 'refunded', refunded_at = now()
  WHERE status = 'active'
    AND expires_at < now()
    AND used_at IS NULL;

  -- Update lead balances by removing expired amounts
  UPDATE lead_balances lb
  SET balance = balance - COALESCE((
    SELECT SUM(amount)
    FROM partner_incentives
    WHERE lead_id = lb.lead_id
      AND status = 'refunded'
      AND refunded_at >= now() - interval '1 minute'
  ), 0)
  WHERE lead_id IN (
    SELECT DISTINCT lead_id
    FROM partner_incentives
    WHERE status = 'refunded'
      AND refunded_at >= now() - interval '1 minute'
  );

  -- Mark expired leads
  UPDATE partner_leads
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < now()
    AND first_purchase_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to upsert lead balance
CREATE OR REPLACE FUNCTION upsert_lead_balance(p_lead_id uuid, p_amount decimal)
RETURNS void AS $$
BEGIN
  INSERT INTO lead_balances (lead_id, balance, lifetime_received)
  VALUES (p_lead_id, p_amount, p_amount)
  ON CONFLICT (lead_id)
  DO UPDATE SET
    balance = lead_balances.balance + p_amount,
    lifetime_received = lead_balances.lifetime_received + p_amount,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add sample lead data for testing (only active leads within 90 days)
DO $$
DECLARE
  nonprofit_record RECORD;
  days_ago INT;
  expiry_date TIMESTAMPTZ;
BEGIN
  FOR nonprofit_record IN
    SELECT id FROM nonprofits WHERE status = 'approved' LIMIT 1
  LOOP
    -- Create 15 sample leads with varying expiration dates
    FOR i IN 1..15 LOOP
      days_ago := 60 + (i * 2); -- Registered 60-90 days ago
      expiry_date := now() + ((90 - days_ago) || ' days')::interval;

      INSERT INTO partner_leads (
        partner_id,
        email,
        registered_at,
        expires_at,
        status,
        total_spent,
        first_purchase_at
      ) VALUES (
        nonprofit_record.id,
        'lead' || i || '.test@example.com',
        now() - (days_ago || ' days')::interval,
        expiry_date,
        'active',
        0,
        NULL
      );
    END LOOP;

    -- Add a few with existing gift balances
    INSERT INTO lead_balances (lead_id, balance, lifetime_received)
    SELECT id, 10.00, 10.00
    FROM partner_leads
    WHERE partner_id = nonprofit_record.id
    LIMIT 3;
  END LOOP;
END $$;
