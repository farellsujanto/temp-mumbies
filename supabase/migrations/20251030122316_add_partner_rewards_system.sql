/*
  # Partner Rewards & Challenges System

  1. New Tables
    - `partner_rewards`
      - Reward definitions (challenges, bonuses, competitions)
      - Types: milestone, time_based, competition, bonus_commission, free_product
      - Status: active, upcoming, expired, completed
    - `partner_reward_progress`
      - Tracks each partner's progress toward rewards
      - Links partners to rewards
      - Tracks completion status and redemption
    - `partner_reward_redemptions`
      - Records when partners claim/redeem rewards
      - Tracks what was given and when

  2. Security
    - Enable RLS on all tables
    - Partners can read active/upcoming rewards
    - Partners can view their own progress
    - Only authenticated partners can access

  3. Notes
    - Rewards can be global or targeted to specific partners
    - Multiple reward types for flexibility
    - Progress tracking for gamification
*/

-- Partner Rewards (Challenges, Bonuses, Competitions)
CREATE TABLE IF NOT EXISTS partner_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('milestone', 'time_based', 'competition', 'bonus_commission', 'free_product', 'gift_card')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'expired', 'completed')),
  
  -- Reward Details
  reward_value numeric DEFAULT 0,
  reward_description text,
  badge_icon text,
  badge_color text,
  
  -- Requirements
  requirement_type text CHECK (requirement_type IN ('sales_amount', 'sales_count', 'customer_count', 'lead_count', 'referral_count', 'time_period')),
  requirement_value numeric DEFAULT 0,
  requirement_description text,
  
  -- Timing
  starts_at timestamptz,
  ends_at timestamptz,
  
  -- Competition specific
  max_winners integer,
  current_participants integer DEFAULT 0,
  
  -- Targeting
  is_global boolean DEFAULT true,
  target_partner_ids uuid[],
  
  -- Metadata
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Partner Reward Progress
CREATE TABLE IF NOT EXISTS partner_reward_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES partner_rewards(id) ON DELETE CASCADE,
  
  -- Progress Tracking
  current_value numeric DEFAULT 0,
  target_value numeric NOT NULL,
  progress_percentage integer DEFAULT 0,
  
  -- Status
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'claimed', 'expired')),
  completed_at timestamptz,
  claimed_at timestamptz,
  
  -- Rank (for competitions)
  current_rank integer,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(partner_id, reward_id)
);

-- Partner Reward Redemptions
CREATE TABLE IF NOT EXISTS partner_reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES partner_rewards(id) ON DELETE CASCADE,
  progress_id uuid REFERENCES partner_reward_progress(id) ON DELETE CASCADE,
  
  -- Redemption Details
  reward_type text NOT NULL,
  reward_amount numeric,
  reward_description text,
  
  -- Product rewards
  product_id uuid REFERENCES products(id),
  
  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'fulfilled', 'cancelled')),
  fulfilled_at timestamptz,
  
  -- Notes
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_rewards_status ON partner_rewards(status);
CREATE INDEX IF NOT EXISTS idx_partner_rewards_dates ON partner_rewards(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_partner_rewards_featured ON partner_rewards(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_partner_reward_progress_partner ON partner_reward_progress(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_reward_progress_status ON partner_reward_progress(status);
CREATE INDEX IF NOT EXISTS idx_partner_reward_redemptions_partner ON partner_reward_redemptions(partner_id);

-- Enable RLS
ALTER TABLE partner_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_reward_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_rewards
CREATE POLICY "Partners can view active and upcoming rewards"
  ON partner_rewards
  FOR SELECT
  TO authenticated
  USING (
    status IN ('active', 'upcoming') AND
    (is_global = true OR auth.uid() = ANY(
      SELECT auth_user_id FROM nonprofits WHERE id = ANY(target_partner_ids)
    ))
  );

-- RLS Policies for partner_reward_progress
CREATE POLICY "Partners can view their own progress"
  ON partner_reward_progress
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update their own progress"
  ON partner_reward_progress
  FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for partner_reward_redemptions
CREATE POLICY "Partners can view their own redemptions"
  ON partner_reward_redemptions
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can create redemption requests"
  ON partner_reward_redemptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

-- Sample Rewards Data
INSERT INTO partner_rewards (title, description, reward_type, status, reward_value, reward_description, requirement_type, requirement_value, requirement_description, starts_at, ends_at, featured, sort_order, badge_color)
VALUES
  (
    'Black Friday Bonus',
    'Earn an extra 2% commission on all sales made between Black Friday and Cyber Monday!',
    'bonus_commission',
    'active',
    2.0,
    '2% bonus commission (7% total)',
    'time_period',
    0,
    'Make any sale between Nov 24-27',
    '2024-11-24 00:00:00',
    '2024-11-27 23:59:59',
    true,
    1,
    'black'
  ),
  (
    'Holiday Sprint Challenge',
    'First 10 partners to reach $2,500 in sales this month win a $500 cash bonus!',
    'competition',
    'active',
    500.0,
    '$500 cash bonus',
    'sales_amount',
    2500,
    'Reach $2,500 in sales this month',
    now(),
    now() + interval '30 days',
    true,
    2,
    'red'
  ),
  (
    'Customer Champion',
    'Bring in 25 new customers this quarter and get $250 in Mumbies credit',
    'milestone',
    'active',
    250.0,
    '$250 Mumbies gift card',
    'customer_count',
    25,
    'Acquire 25 new customers',
    now(),
    now() + interval '90 days',
    true,
    3,
    'blue'
  ),
  (
    'Free Premium Treats Box',
    'Make 10 sales this week and get a free $75 Premium Treats Variety Pack!',
    'free_product',
    'active',
    75.0,
    'Premium Treats Variety Pack (30 items)',
    'sales_count',
    10,
    'Complete 10 sales this week',
    now(),
    now() + interval '7 days',
    true,
    4,
    'amber'
  ),
  (
    'Lead Generation Master',
    'Register 50 new leads and unlock a permanent +0.5% commission boost',
    'milestone',
    'active',
    0.5,
    'Permanent +0.5% commission rate increase',
    'lead_count',
    50,
    'Register 50 new leads',
    now(),
    now() + interval '180 days',
    false,
    5,
    'green'
  ),
  (
    'New Year Kickoff',
    'Coming January 1st: Triple referral bonuses for 30 days!',
    'bonus_commission',
    'upcoming',
    3000.0,
    '$3,000 per qualified referral (triple bonus)',
    'referral_count',
    1,
    'Refer partners during January',
    '2025-01-01 00:00:00',
    '2025-01-31 23:59:59',
    true,
    6,
    'purple'
  );
