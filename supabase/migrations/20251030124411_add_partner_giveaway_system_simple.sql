/*
  # Partner Giveaway System

  1. New Tables
    - `giveaway_bundles` - Pre-configured product bundles
    - `partner_giveaways` - Giveaway campaigns for partners
    - `giveaway_entries` - Customer entries and leads

  2. Features
    - Auto-generate landing pages
    - Track entries as leads
    - Auto winner selection
    - TikTok-style giveaway system

  3. Security
    - RLS enabled
    - Public can enter giveaways
    - Partners manage their giveaways
*/

-- Giveaway Bundles
CREATE TABLE IF NOT EXISTS giveaway_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  retail_value numeric NOT NULL,
  tier text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  sales_threshold numeric NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Partner Giveaways
CREATE TABLE IF NOT EXISTS partner_giveaways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  bundle_id uuid NOT NULL REFERENCES giveaway_bundles(id),
  
  title text NOT NULL,
  description text NOT NULL,
  terms_conditions text,
  landing_page_slug text UNIQUE NOT NULL,
  
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL,
  winner_selected_at timestamptz,
  
  selection_method text NOT NULL DEFAULT 'random',
  winner_entry_id uuid,
  max_entries integer,
  
  status text NOT NULL DEFAULT 'active',
  
  total_entries integer DEFAULT 0,
  total_leads_generated integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

-- Giveaway Entries
CREATE TABLE IF NOT EXISTS giveaway_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id uuid NOT NULL REFERENCES partner_giveaways(id) ON DELETE CASCADE,
  
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  zip_code text,
  
  attributed_partner_id uuid REFERENCES nonprofits(id),
  
  referral_source text,
  ip_address text,
  
  is_winner boolean DEFAULT false,
  is_verified boolean DEFAULT true,
  disqualified boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(giveaway_id, email)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_giveaways_partner ON partner_giveaways(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_giveaways_status ON partner_giveaways(status);
CREATE INDEX IF NOT EXISTS idx_partner_giveaways_slug ON partner_giveaways(landing_page_slug);
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_giveaway ON giveaway_entries(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_email ON giveaway_entries(email);

-- Enable RLS
ALTER TABLE giveaway_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_giveaways ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view bundles"
  ON giveaway_bundles FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Anyone can view active giveaways"
  ON partner_giveaways FOR SELECT TO authenticated, anon
  USING (status = 'active');

CREATE POLICY "Partners view own giveaways"
  ON partner_giveaways FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()));

CREATE POLICY "Partners create giveaways"
  ON partner_giveaways FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()));

CREATE POLICY "Partners update own giveaways"
  ON partner_giveaways FOR UPDATE TO authenticated
  USING (partner_id IN (SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()));

CREATE POLICY "Anyone can submit entries"
  ON giveaway_entries FOR INSERT TO authenticated, anon WITH CHECK (true);

CREATE POLICY "Partners view their entries"
  ON giveaway_entries FOR SELECT TO authenticated
  USING (giveaway_id IN (
    SELECT id FROM partner_giveaways 
    WHERE partner_id IN (SELECT id FROM nonprofits WHERE auth_user_id = auth.uid())
  ));

CREATE POLICY "Partners update their entries"
  ON giveaway_entries FOR UPDATE TO authenticated
  USING (giveaway_id IN (
    SELECT id FROM partner_giveaways 
    WHERE partner_id IN (SELECT id FROM nonprofits WHERE auth_user_id = auth.uid())
  ));

-- Function to update giveaway stats
CREATE OR REPLACE FUNCTION update_giveaway_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE partner_giveaways 
  SET 
    total_entries = total_entries + 1,
    total_leads_generated = total_leads_generated + 1
  WHERE id = NEW.giveaway_id;

  NEW.attributed_partner_id := (SELECT partner_id FROM partner_giveaways WHERE id = NEW.giveaway_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS update_stats_trigger ON giveaway_entries;
CREATE TRIGGER update_stats_trigger
  BEFORE INSERT ON giveaway_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_giveaway_stats();

-- Sample Bundles
INSERT INTO giveaway_bundles (name, description, retail_value, tier, sales_threshold, image_url)
VALUES
  ('Starter Pack', 'Perfect for new pet parents! 5 lbs treats, 2 toys, premium collar.', 75.00, 'bronze', 5000, 'https://images.pexels.com/photos/4588441/pexels-photo-4588441.jpeg'),
  ('Deluxe Bundle', 'Everything your pup needs! 10 lbs treats, 5 toys, collar, leash, bedding.', 150.00, 'silver', 10000, 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg'),
  ('Ultimate Care Package', '3-month supply treats, 10 premium toys, full accessory set, grooming kit.', 300.00, 'gold', 25000, 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg'),
  ('VIP Year Supply', '1 year premium treats, complete toy collection, all accessories, custom items.', 1000.00, 'platinum', 50000, 'https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg')
ON CONFLICT DO NOTHING;
