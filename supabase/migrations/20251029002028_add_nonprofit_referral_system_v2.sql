/*
  # Add Nonprofit Referral System

  ## Overview
  This migration creates a referral system that allows existing nonprofit partners to refer 
  other nonprofits and earn a $1000 bounty when their referral makes $500+ in sales within 
  the first 6 months.

  ## New Tables
  
  ### `nonprofit_referrals`
  Tracks referrals from one nonprofit to another
  - `id` (uuid, primary key) - Unique identifier
  - `referrer_nonprofit_id` (uuid, foreign key) - The nonprofit making the referral
  - `referred_nonprofit_id` (uuid, foreign key, nullable) - The referred nonprofit (null until they sign up)
  - `referred_email` (text) - Email of the referred nonprofit
  - `referral_code` (text, unique) - Unique code for tracking the referral
  - `status` (text) - Status: pending, signed_up, qualified, paid
  - `signup_date` (timestamptz, nullable) - When the referred nonprofit signed up
  - `qualification_date` (timestamptz, nullable) - When they hit $500 in sales
  - `bounty_paid_date` (timestamptz, nullable) - When the $1000 bounty was paid
  - `total_sales` (numeric) - Current sales total for the referred nonprofit
  - `bounty_amount` (numeric) - Bounty amount ($1000)
  - `created_at` (timestamptz) - When referral was created

  ## Modified Tables
  
  ### `nonprofits`
  - Add `referral_link` (text) - Unique link for referring other nonprofits
  - Add `total_referral_earnings` (numeric) - Total earned from referrals
  - Add `active_referrals_count` (integer) - Count of pending/active referrals
  - Add `qualified_referrals_count` (integer) - Count of qualified referrals

  ## Security
  - Enable RLS on `nonprofit_referrals` table
  - Nonprofits can view their own referrals (as referrer)
  - Nonprofits can view referrals where they are the referred party
  - Only authenticated nonprofit partners can create referrals
  - Nonprofits can update their own referrals (as referrer)

  ## Important Notes
  1. Referral qualification period: 6 months from signup
  2. Qualification threshold: $500 in sales
  3. Bounty amount: $1000 per qualified referral
  4. Referral codes are auto-generated and unique
*/

-- Add referral tracking columns to nonprofits table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'referral_link'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN referral_link text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'total_referral_earnings'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN total_referral_earnings numeric(10, 2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'active_referrals_count'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN active_referrals_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nonprofits' AND column_name = 'qualified_referrals_count'
  ) THEN
    ALTER TABLE nonprofits ADD COLUMN qualified_referrals_count integer DEFAULT 0;
  END IF;
END $$;

-- Create nonprofit_referrals table
CREATE TABLE IF NOT EXISTS nonprofit_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_nonprofit_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  referred_nonprofit_id uuid REFERENCES nonprofits(id) ON DELETE SET NULL,
  referred_email text NOT NULL,
  referral_code text UNIQUE NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'qualified', 'paid')),
  signup_date timestamptz,
  qualification_date timestamptz,
  bounty_paid_date timestamptz,
  total_sales numeric(10, 2) DEFAULT 0,
  bounty_amount numeric(10, 2) DEFAULT 1000.00,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_email CHECK (referred_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON nonprofit_referrals(referrer_nonprofit_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON nonprofit_referrals(referred_nonprofit_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON nonprofit_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON nonprofit_referrals(status);

-- Generate unique referral links for existing nonprofits
UPDATE nonprofits
SET referral_link = 'REF-' || UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 8))
WHERE referral_link IS NULL;

-- Enable RLS
ALTER TABLE nonprofit_referrals ENABLE ROW LEVEL SECURITY;

-- Nonprofits can view referrals they made
CREATE POLICY "Nonprofits can view their own referrals"
  ON nonprofit_referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_referrals.referrer_nonprofit_id
      AND nonprofits.auth_user_id = auth.uid()
    )
  );

-- Nonprofits can view referrals where they were referred
CREATE POLICY "Nonprofits can view referrals about them"
  ON nonprofit_referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_referrals.referred_nonprofit_id
      AND nonprofits.auth_user_id = auth.uid()
    )
  );

-- Nonprofits can create referrals
CREATE POLICY "Nonprofits can create referrals"
  ON nonprofit_referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = referrer_nonprofit_id
      AND nonprofits.auth_user_id = auth.uid()
    )
  );

-- Nonprofits can update their own referrals
CREATE POLICY "Nonprofits can update their referrals"
  ON nonprofit_referrals
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = referrer_nonprofit_id
      AND nonprofits.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = referrer_nonprofit_id
      AND nonprofits.auth_user_id = auth.uid()
    )
  );

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := 'NPO-' || UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM nonprofit_referrals WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Trigger to auto-generate referral code if not provided
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_insert_nonprofit_referral
  BEFORE INSERT ON nonprofit_referrals
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

-- Function to update nonprofit referral counts
CREATE OR REPLACE FUNCTION update_nonprofit_referral_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE nonprofits
  SET active_referrals_count = (
    SELECT COUNT(*)
    FROM nonprofit_referrals
    WHERE referrer_nonprofit_id = NEW.referrer_nonprofit_id
    AND status IN ('pending', 'signed_up')
  ),
  qualified_referrals_count = (
    SELECT COUNT(*)
    FROM nonprofit_referrals
    WHERE referrer_nonprofit_id = NEW.referrer_nonprofit_id
    AND status IN ('qualified', 'paid')
  )
  WHERE id = NEW.referrer_nonprofit_id;

  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    UPDATE nonprofits
    SET total_referral_earnings = COALESCE(total_referral_earnings, 0) + NEW.bounty_amount
    WHERE id = NEW.referrer_nonprofit_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER after_referral_change
  AFTER INSERT OR UPDATE ON nonprofit_referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_nonprofit_referral_counts();