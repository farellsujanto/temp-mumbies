/*
  # Shopify Settings & Giveaway Winner Automation
  
  1. New Tables
    - `shopify_settings` - Store Shopify API credentials
    - `giveaway_winners` - Track winners and Shopify orders
    
  2. Updates
    - Add auto_create_order to partner_giveaways
    
  3. New Functions
    - `select_giveaway_winner()` - Random winner selection
    - `get_giveaway_bundle_products()` - Get products for bundle
    
  4. Features
    - Secure Shopify credentials
    - Automatic winner selection
    - Shopify order creation tracking
    - TikTok-style automation
    
  5. Security
    - Admin-only access
    - Complete audit trail
*/

-- Shopify Settings Table
CREATE TABLE IF NOT EXISTS shopify_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- API Credentials
  shop_url TEXT NOT NULL,
  access_token TEXT NOT NULL,
  api_version TEXT DEFAULT '2024-01',
  
  -- Sync Settings
  auto_sync_enabled BOOLEAN DEFAULT false,
  sync_frequency_hours INTEGER DEFAULT 24,
  last_sync_at TIMESTAMPTZ,
  
  -- Order Settings
  default_fulfillment_location TEXT,
  send_customer_notifications BOOLEAN DEFAULT true,
  
  -- Metadata
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Giveaway Winners Table
CREATE TABLE IF NOT EXISTS giveaway_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id UUID NOT NULL REFERENCES partner_giveaways(id) ON DELETE CASCADE,
  
  -- Winner Info
  entry_id UUID NOT NULL REFERENCES giveaway_entries(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  
  -- Selection Info
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  selection_method TEXT DEFAULT 'random',
  
  -- Shopify Order
  shopify_order_id TEXT,
  shopify_order_number TEXT,
  shopify_order_created_at TIMESTAMPTZ,
  shopify_order_status TEXT,
  shopify_order_data JSONB DEFAULT '{}'::jsonb,
  
  -- Fulfillment
  tracking_number TEXT,
  tracking_url TEXT,
  fulfillment_status TEXT DEFAULT 'pending',
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Notifications
  winner_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(giveaway_id)
);

-- Add automation field to partner_giveaways
ALTER TABLE partner_giveaways ADD COLUMN IF NOT EXISTS auto_create_order BOOLEAN DEFAULT true;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_giveaway_winners_giveaway ON giveaway_winners(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_giveaway_winners_entry ON giveaway_winners(entry_id);
CREATE INDEX IF NOT EXISTS idx_giveaway_winners_shopify ON giveaway_winners(shopify_order_id);

-- Enable RLS
ALTER TABLE shopify_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_winners ENABLE ROW LEVEL SECURITY;

-- RLS: Admins only for Shopify settings
CREATE POLICY "Admins manage Shopify settings"
  ON shopify_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- RLS: Partners can view their winners
CREATE POLICY "Partners view own giveaway winners"
  ON giveaway_winners FOR SELECT
  TO authenticated
  USING (
    giveaway_id IN (
      SELECT pg.id FROM partner_giveaways pg
      INNER JOIN nonprofits n ON n.id = pg.partner_id
      WHERE n.auth_user_id = auth.uid()
    )
  );

-- RLS: Admins can manage all winners
CREATE POLICY "Admins manage all winners"
  ON giveaway_winners FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- Function: Select Random Winner
CREATE OR REPLACE FUNCTION select_giveaway_winner(
  p_giveaway_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_winner RECORD;
  v_entry RECORD;
  v_giveaway RECORD;
BEGIN
  -- Get giveaway
  SELECT * INTO v_giveaway FROM partner_giveaways WHERE id = p_giveaway_id;
  
  IF v_giveaway IS NULL THEN
    RAISE EXCEPTION 'Giveaway not found';
  END IF;
  
  -- Check if ended
  IF v_giveaway.ends_at > NOW() THEN
    RAISE EXCEPTION 'Giveaway has not ended yet';
  END IF;
  
  -- Check if winner exists
  IF EXISTS (SELECT 1 FROM giveaway_winners WHERE giveaway_id = p_giveaway_id) THEN
    RAISE EXCEPTION 'Winner already selected';
  END IF;
  
  -- Select random entry
  SELECT * INTO v_entry
  FROM giveaway_entries
  WHERE giveaway_id = p_giveaway_id
  ORDER BY RANDOM()
  LIMIT 1;
  
  IF v_entry IS NULL THEN
    RAISE EXCEPTION 'No entries found';
  END IF;
  
  -- Create winner
  INSERT INTO giveaway_winners (
    giveaway_id,
    entry_id,
    user_email,
    user_name,
    selection_method
  ) VALUES (
    p_giveaway_id,
    v_entry.id,
    v_entry.email,
    v_entry.full_name,
    'random'
  ) RETURNING * INTO v_winner;
  
  -- Update giveaway
  UPDATE partner_giveaways
  SET 
    winner_selected_at = NOW(),
    winner_entry_id = v_entry.id,
    status = 'completed'
  WHERE id = p_giveaway_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'winner_id', v_winner.id,
    'winner_email', v_winner.user_email,
    'winner_name', v_winner.user_name,
    'entry_id', v_entry.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get Bundle Products
CREATE OR REPLACE FUNCTION get_giveaway_bundle_products(
  p_bundle_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_products JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'product_id', sp.id,
      'shopify_id', sp.shopify_id,
      'title', sp.title,
      'image', sp.featured_image,
      'price', sp.price,
      'quantity', gbp.quantity,
      'variant_id', gbp.variant_id,
      'variant_title', gbp.variant_title
    ) ORDER BY gbp.display_order
  ) INTO v_products
  FROM giveaway_bundle_products gbp
  INNER JOIN shopify_products sp ON sp.id = gbp.shopify_product_id
  WHERE gbp.bundle_id = p_bundle_id;
  
  RETURN COALESCE(v_products, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reload schema
NOTIFY pgrst, 'reload schema';
