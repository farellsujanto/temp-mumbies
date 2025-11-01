/*
  # Add Giveaway Lead Attribution System

  1. Schema Changes
    - Add `lead_status` to giveaway_entries:
      - 'new_lead' - Email wasn't in system before giveaway entry
      - 'active' - New lead made first purchase within 90 days
      - 'expired' - New lead didn't purchase within 90 days
      - 'existing_customer' - Was already a customer when entered
    - Add `is_new_lead` boolean flag
    - Add `first_purchase_date` to track conversion
    - Add `lifetime_gmv` calculated field

  2. Lead Attribution Logic
    - Check if email exists in users table before giveaway entry
    - If new → Create partner_leads record
    - If existing → Mark as existing customer (no lead attribution)
    - Track 90-day conversion window
    - Calculate lifetime GMV from all purchases

  3. Security
    - Maintain existing RLS policies
    - Add indexes for performance
*/

-- Add new columns to giveaway_entries
ALTER TABLE giveaway_entries
ADD COLUMN IF NOT EXISTS lead_status TEXT DEFAULT 'new_lead' CHECK (lead_status IN ('new_lead', 'active', 'expired', 'existing_customer')),
ADD COLUMN IF NOT EXISTS is_new_lead BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS first_purchase_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS lifetime_gmv DECIMAL(10,2) DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_email ON giveaway_entries(email);
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_partner_lead_status ON giveaway_entries(attributed_partner_id, lead_status);

-- Function to check if email is new lead when creating giveaway entry
CREATE OR REPLACE FUNCTION check_giveaway_lead_status()
RETURNS TRIGGER AS $$
DECLARE
  user_exists BOOLEAN;
  user_created_date TIMESTAMPTZ;
BEGIN
  -- Check if user exists and when they were created
  SELECT
    EXISTS(SELECT 1 FROM auth.users WHERE email = NEW.email),
    created_at INTO user_exists, user_created_date
  FROM auth.users
  WHERE email = NEW.email;

  IF user_exists THEN
    -- Check if user was created before this giveaway entry
    IF user_created_date < NEW.created_at THEN
      -- Existing customer
      NEW.is_new_lead := false;
      NEW.lead_status := 'existing_customer';
    ELSE
      -- New lead (user created around same time as entry)
      NEW.is_new_lead := true;
      NEW.lead_status := 'new_lead';

      -- Create partner_leads record if doesn't exist and partner is attributed
      IF NEW.attributed_partner_id IS NOT NULL THEN
        INSERT INTO partner_leads (
          partner_id,
          email,
          registration_date,
          source,
          status
        ) VALUES (
          NEW.attributed_partner_id,
          NEW.email,
          NEW.created_at,
          'giveaway',
          'active'
        )
        ON CONFLICT (partner_id, email) DO NOTHING;
      END IF;
    END IF;
  ELSE
    -- Brand new lead
    NEW.is_new_lead := true;
    NEW.lead_status := 'new_lead';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS check_giveaway_lead_status_trigger ON giveaway_entries;
CREATE TRIGGER check_giveaway_lead_status_trigger
  BEFORE INSERT ON giveaway_entries
  FOR EACH ROW
  EXECUTE FUNCTION check_giveaway_lead_status();

-- Function to update lead status based on purchases
CREATE OR REPLACE FUNCTION update_giveaway_lead_status()
RETURNS void AS $$
BEGIN
  -- Update lead status to 'active' for leads who made their first purchase within 90 days
  UPDATE giveaway_entries ge
  SET
    lead_status = 'active',
    first_purchase_date = o.first_order_date
  FROM (
    SELECT
      u.email,
      MIN(created_at) as first_order_date
    FROM orders o
    JOIN users u ON o.user_id = u.id
    GROUP BY u.email
  ) o
  WHERE ge.email = o.email
    AND ge.is_new_lead = true
    AND ge.lead_status = 'new_lead'
    AND o.first_order_date <= (ge.created_at + INTERVAL '90 days');

  -- Update lead status to 'expired' for leads who didn't purchase within 90 days
  UPDATE giveaway_entries
  SET lead_status = 'expired'
  WHERE is_new_lead = true
    AND lead_status = 'new_lead'
    AND created_at < (NOW() - INTERVAL '90 days')
    AND first_purchase_date IS NULL;

  -- Update lifetime GMV for all entries
  UPDATE giveaway_entries ge
  SET lifetime_gmv = COALESCE(o.total_spent, 0)
  FROM (
    SELECT
      u.email,
      SUM(total_amount) as total_spent
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.status = 'completed'
    GROUP BY u.email
  ) o
  WHERE ge.email = o.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run daily (note: requires pg_cron extension)
-- This will be manually called or can be scheduled via Supabase Edge Functions
COMMENT ON FUNCTION update_giveaway_lead_status() IS
'Run daily to update giveaway lead statuses and lifetime GMV.
Call via: SELECT update_giveaway_lead_status();';