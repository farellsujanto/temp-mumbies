/*
  # Partner Rewards & Challenges System
  
  1. Tables
    - partner_rewards: Challenge definitions
    - partner_reward_progress: Partner progress tracking
    - partner_reward_redemptions: Claimed rewards
    
  2. Features
    - Sales challenges (amount, count, customer count)
    - Lead challenges (lead count, referral count)
    - Multiple reward types (free product, cash bonus, mumbies cash)
    - Automatic progress tracking
    - Featured/upcoming challenges
    
  3. Security
    - RLS policies for partners and admins
    - Audit trails for claims
*/

-- Partner Rewards (Challenge Definitions)
CREATE TABLE IF NOT EXISTS partner_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('free_product', 'cash_bonus', 'mumbies_cash_bonus', 'gift_card', 'bonus_commission', 'milestone')),
  reward_value numeric(10,2) NOT NULL DEFAULT 0,
  reward_description text NOT NULL,
  requirement_type text NOT NULL CHECK (requirement_type IN ('sales_amount', 'sales_count', 'customer_count', 'lead_count', 'referral_count', 'time_period')),
  requirement_value numeric(10,2) NOT NULL,
  requirement_description text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'expired', 'paused')),
  starts_at timestamptz,
  ends_at timestamptz,
  max_winners integer,
  current_participants integer DEFAULT 0,
  featured boolean DEFAULT false,
  badge_color text,
  product_id uuid REFERENCES shopify_products(id),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Partner Reward Progress (Partner Tracking)
CREATE TABLE IF NOT EXISTS partner_reward_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES partner_rewards(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'claimed', 'expired')),
  current_value numeric(10,2) NOT NULL DEFAULT 0,
  target_value numeric(10,2) NOT NULL,
  progress_percentage numeric(5,2) NOT NULL DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  claimed_at timestamptz,
  current_rank integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, reward_id)
);

-- Partner Reward Redemptions (Claimed Rewards)
CREATE TABLE IF NOT EXISTS partner_reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES partner_rewards(id),
  progress_id uuid NOT NULL REFERENCES partner_reward_progress(id),
  reward_type text NOT NULL,
  reward_value numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipped', 'completed', 'rejected')),
  shipping_address jsonb,
  tracking_number text,
  notes text,
  admin_notes text,
  processed_by uuid REFERENCES users(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_rewards_status ON partner_rewards(status);
CREATE INDEX IF NOT EXISTS idx_partner_rewards_featured ON partner_rewards(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_partner_reward_progress_partner ON partner_reward_progress(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_reward_progress_status ON partner_reward_progress(status);
CREATE INDEX IF NOT EXISTS idx_partner_reward_redemptions_partner ON partner_reward_redemptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_reward_redemptions_status ON partner_reward_redemptions(status);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_partner_rewards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partner_rewards_updated_at BEFORE UPDATE ON partner_rewards
  FOR EACH ROW EXECUTE FUNCTION update_partner_rewards_updated_at();

CREATE TRIGGER partner_reward_progress_updated_at BEFORE UPDATE ON partner_reward_progress
  FOR EACH ROW EXECUTE FUNCTION update_partner_rewards_updated_at();

CREATE TRIGGER partner_reward_redemptions_updated_at BEFORE UPDATE ON partner_reward_redemptions
  FOR EACH ROW EXECUTE FUNCTION update_partner_rewards_updated_at();

-- RLS Policies
ALTER TABLE partner_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_reward_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Everyone can view active rewards
CREATE POLICY "Anyone can view active rewards"
  ON partner_rewards FOR SELECT
  TO authenticated, anon
  USING (status IN ('active', 'upcoming'));

-- Admins can manage all rewards
CREATE POLICY "Admins can manage rewards"
  ON partner_rewards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Partners can view their own progress
CREATE POLICY "Partners can view own progress"
  ON partner_reward_progress FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = auth.uid()
    )
  );

-- Partners can insert their own progress
CREATE POLICY "Partners can start challenges"
  ON partner_reward_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = auth.uid()
    )
  );

-- Admins can manage all progress
CREATE POLICY "Admins can manage all progress"
  ON partner_reward_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Partners can view and create redemptions
CREATE POLICY "Partners can manage own redemptions"
  ON partner_reward_redemptions FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = auth.uid()
    )
  );

-- Admins can manage all redemptions
CREATE POLICY "Admins can manage all redemptions"
  ON partner_reward_redemptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
