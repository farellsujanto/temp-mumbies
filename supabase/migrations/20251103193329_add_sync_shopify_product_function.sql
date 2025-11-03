/*
  # Add Shopify Product Sync Function
  
  1. Create RPC function for syncing Shopify products
  2. Handles upserts to shopify_products table
  3. Returns the product ID for tracking
*/

CREATE OR REPLACE FUNCTION sync_shopify_product(
  p_shopify_id TEXT,
  p_title TEXT,
  p_description TEXT,
  p_handle TEXT,
  p_vendor TEXT,
  p_product_type TEXT,
  p_price DECIMAL,
  p_featured_image TEXT,
  p_images TEXT,
  p_variants TEXT,
  p_tags TEXT[],
  p_status TEXT,
  p_shopify_data TEXT
)
RETURNS UUID AS $$
DECLARE
  v_product_id UUID;
  v_images_json JSONB;
  v_variants_json JSONB;
  v_shopify_data_json JSONB;
BEGIN
  -- Parse JSON strings
  BEGIN
    v_images_json := p_images::jsonb;
  EXCEPTION WHEN OTHERS THEN
    v_images_json := '[]'::jsonb;
  END;
  
  BEGIN
    v_variants_json := p_variants::jsonb;
  EXCEPTION WHEN OTHERS THEN
    v_variants_json := '[]'::jsonb;
  END;
  
  BEGIN
    v_shopify_data_json := p_shopify_data::jsonb;
  EXCEPTION WHEN OTHERS THEN
    v_shopify_data_json := '{}'::jsonb;
  END;

  -- Upsert product
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
    v_images_json,
    v_variants_json,
    jsonb_array_length(v_variants_json) > 1,
    p_tags,
    p_status,
    v_shopify_data_json,
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
