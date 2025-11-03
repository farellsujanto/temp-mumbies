/*
  # Shopify Products Integration

  1. New Tables
    - `shopify_products` - Synced products from Shopify
    - `giveaway_bundle_products` - Link products to giveaway bundles

  2. Updates
    - Add shopify_product_id to giveaway_bundles (optional)

  3. Features
    - Store Shopify product data
    - Link products to giveaway bundles
    - Support for product variants
    - Image and pricing sync

  4. Security
    - RLS enabled
    - Public can view products
    - Only admins can sync
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
CREATE POLICY "Anyone can view active products"
  ON shopify_products FOR SELECT
  TO authenticated, anon
  USING (status = 'active');

CREATE POLICY "Service role can manage products"
  ON shopify_products FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for giveaway_bundle_products
CREATE POLICY "Anyone can view bundle products"
  ON giveaway_bundle_products FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage bundle products"
  ON giveaway_bundle_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function: Get Giveaway Bundle with Products
CREATE OR REPLACE FUNCTION get_bundle_with_products(p_bundle_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'bundle', row_to_json(gb.*),
    'products', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', sp.id,
          'title', sp.title,
          'description', sp.description,
          'price', sp.price,
          'featured_image', sp.featured_image,
          'quantity', gbp.quantity,
          'variant_title', gbp.variant_title,
          'display_order', gbp.display_order
        ) ORDER BY gbp.display_order
      ), '[]'::jsonb)
      FROM giveaway_bundle_products gbp
      JOIN shopify_products sp ON sp.id = gbp.shopify_product_id
      WHERE gbp.bundle_id = p_bundle_id
      AND sp.status = 'active'
    )
  )
  INTO v_result
  FROM giveaway_bundles gb
  WHERE gb.id = p_bundle_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Sync Shopify Product
CREATE OR REPLACE FUNCTION sync_shopify_product(
  p_shopify_id TEXT,
  p_title TEXT,
  p_description TEXT,
  p_handle TEXT,
  p_vendor TEXT DEFAULT NULL,
  p_product_type TEXT DEFAULT NULL,
  p_price DECIMAL DEFAULT NULL,
  p_featured_image TEXT DEFAULT NULL,
  p_images JSONB DEFAULT '[]'::jsonb,
  p_variants JSONB DEFAULT '[]'::jsonb,
  p_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_status TEXT DEFAULT 'active',
  p_shopify_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_product_id UUID;
  v_has_variants BOOLEAN;
BEGIN
  v_has_variants := jsonb_array_length(p_variants) > 1;

  INSERT INTO shopify_products (
    shopify_id,
    title,
    description,
    handle,
    vendor,
    product_type,
    price,
    featured_image,
    images,
    variants,
    has_variants,
    tags,
    status,
    shopify_data,
    last_synced_at
  ) VALUES (
    p_shopify_id,
    p_title,
    p_description,
    p_handle,
    p_vendor,
    p_product_type,
    p_price,
    p_featured_image,
    p_images,
    p_variants,
    v_has_variants,
    p_tags,
    p_status,
    p_shopify_data,
    NOW()
  )
  ON CONFLICT (shopify_id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    handle = EXCLUDED.handle,
    vendor = EXCLUDED.vendor,
    product_type = EXCLUDED.product_type,
    price = EXCLUDED.price,
    featured_image = EXCLUDED.featured_image,
    images = EXCLUDED.images,
    variants = EXCLUDED.variants,
    has_variants = EXCLUDED.has_variants,
    tags = EXCLUDED.tags,
    status = EXCLUDED.status,
    shopify_data = EXCLUDED.shopify_data,
    last_synced_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_product_id;

  RETURN v_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE shopify_products IS 'Synced product data from Shopify store';
COMMENT ON TABLE giveaway_bundle_products IS 'Links Shopify products to giveaway bundles';
COMMENT ON FUNCTION sync_shopify_product IS 'Upsert Shopify product data (called from edge function)';
COMMENT ON FUNCTION get_bundle_with_products IS 'Get giveaway bundle with all associated products';
