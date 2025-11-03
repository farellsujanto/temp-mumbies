/*
  # Shopify Products Integration
  
  1. New Tables
    - `shopify_products` - Synced products from Shopify
    - `giveaway_bundle_products` - Link products to giveaway bundles
  
  2. Features
    - Store Shopify product data
    - Link products to giveaway bundles
    - Support for product variants
    - Image and pricing sync
  
  3. Security
    - RLS enabled
    - Public can view products
    - Only service role can sync
*/

-- Shopify Products Table
CREATE TABLE IF NOT EXISTS shopify_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_id TEXT UNIQUE NOT NULL,
  
  -- Product Info
  title TEXT NOT NULL,
  description TEXT,
  vendor TEXT,
  product_type TEXT,
  handle TEXT UNIQUE NOT NULL,
  
  -- Pricing
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  
  -- Images
  featured_image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Variants
  variants JSONB DEFAULT '[]'::jsonb,
  has_variants BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT DEFAULT 'active',
  published_at TIMESTAMPTZ,
  
  -- SEO
  tags TEXT[],
  
  -- Metadata
  shopify_data JSONB DEFAULT '{}'::jsonb,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Giveaway Bundle Products Junction Table
CREATE TABLE IF NOT EXISTS giveaway_bundle_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES giveaway_bundles(id) ON DELETE CASCADE,
  shopify_product_id UUID NOT NULL REFERENCES shopify_products(id) ON DELETE CASCADE,
  
  -- Product details for this bundle
  quantity INTEGER DEFAULT 1,
  variant_id TEXT,
  variant_title TEXT,
  custom_description TEXT,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(bundle_id, shopify_product_id, variant_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shopify_products_shopify_id ON shopify_products(shopify_id);
CREATE INDEX IF NOT EXISTS idx_shopify_products_handle ON shopify_products(handle);
CREATE INDEX IF NOT EXISTS idx_shopify_products_status ON shopify_products(status);
CREATE INDEX IF NOT EXISTS idx_giveaway_bundle_products_bundle ON giveaway_bundle_products(bundle_id);
CREATE INDEX IF NOT EXISTS idx_giveaway_bundle_products_product ON giveaway_bundle_products(shopify_product_id);

-- Enable RLS
ALTER TABLE shopify_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_bundle_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shopify_products
DROP POLICY IF EXISTS "Anyone can view active products" ON shopify_products;
CREATE POLICY "Anyone can view active products"
  ON shopify_products FOR SELECT
  TO authenticated, anon
  USING (status = 'active');

DROP POLICY IF EXISTS "Service role can manage products" ON shopify_products;
CREATE POLICY "Service role can manage products"
  ON shopify_products FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for giveaway_bundle_products
DROP POLICY IF EXISTS "Anyone can view bundle products" ON giveaway_bundle_products;
CREATE POLICY "Anyone can view bundle products"
  ON giveaway_bundle_products FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Admins can manage bundle products" ON giveaway_bundle_products;
CREATE POLICY "Admins can manage bundle products"
  ON giveaway_bundle_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Reload schema
NOTIFY pgrst, 'reload schema';
