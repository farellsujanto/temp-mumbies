/*
  # Add Product Variants Examples

  1. New Products
    - Creates example products with multiple size variants
    - "Mumbies Original Chew" with Small, Medium, Large sizes
    - "Natural Paws Hemp Leash" with 4ft, 6ft lengths
    
  2. Changes
    - Adds example variant products to demonstrate the variant system
    - Sets up proper base_price and has_variants flags
    - Creates corresponding variant records in product_variants table
    
  3. Notes
    - Existing products remain unchanged
    - Variants have different prices based on size
    - Each variant has its own SKU and sort order
*/

-- Insert Mumbies Original Chew (parent product with variants)
DO $$
DECLARE
  v_product_id uuid := gen_random_uuid();
  v_brand_id uuid;
BEGIN
  -- Get Mumbies brand ID
  SELECT id INTO v_brand_id FROM brands WHERE slug = 'mumbies';
  
  -- Insert parent product
  INSERT INTO products (
    id,
    name,
    description,
    price,
    base_price,
    has_variants,
    brand_id,
    category,
    image_url,
    tags,
    inventory_status,
    is_active,
    sku
  ) VALUES (
    v_product_id,
    'Mumbies Original Chew',
    'Premium natural chew sticks made from 100% digestible ingredients. Long-lasting entertainment for your dog with no artificial additives. Available in multiple sizes for all breeds.',
    15.99,
    15.99,
    true,
    v_brand_id,
    'treats',
    'https://images.unsplash.com/photo-1623039405147-547794f92e9e?w=500',
    '["made_in_usa", "natural", "grain_free"]'::jsonb,
    'in_stock',
    true,
    'MB-CHEW'
  );

  -- Insert variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active)
  VALUES
    (v_product_id, 'Small (4-6")', 'Size', 15.99, 'MB-CHEW-SM', 1, true),
    (v_product_id, 'Medium (6-8")', 'Size', 19.99, 'MB-CHEW-MD', 2, true),
    (v_product_id, 'Large (8-10")', 'Size', 24.99, 'MB-CHEW-LG', 3, true),
    (v_product_id, 'X-Large (10-12")', 'Size', 29.99, 'MB-CHEW-XL', 4, true);
END $$;

-- Insert Natural Paws Hemp Leash (parent product with variants)
DO $$
DECLARE
  v_product_id uuid := gen_random_uuid();
  v_brand_id uuid;
BEGIN
  -- Get Natural Paws brand ID
  SELECT id INTO v_brand_id FROM brands WHERE slug = 'natural-paws';
  
  -- Insert parent product
  INSERT INTO products (
    id,
    name,
    description,
    price,
    base_price,
    has_variants,
    brand_id,
    category,
    image_url,
    tags,
    inventory_status,
    is_active,
    sku
  ) VALUES (
    v_product_id,
    'Natural Paws Hemp Leash',
    'Eco-friendly dog leash made from sustainable hemp fiber. Strong, durable, and gentle on hands. Features brass hardware and reinforced stitching.',
    24.99,
    24.99,
    true,
    v_brand_id,
    'accessories',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500',
    '["sustainable", "organic", "eco_friendly"]'::jsonb,
    'in_stock',
    true,
    'NP-LEASH'
  );

  -- Insert variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active)
  VALUES
    (v_product_id, '4 ft', 'Length', 24.99, 'NP-LEASH-4FT', 1, true),
    (v_product_id, '6 ft', 'Length', 28.99, 'NP-LEASH-6FT', 2, true);
END $$;

-- Insert Yummies Peanut Butter Biscuits (parent product with variants)
DO $$
DECLARE
  v_product_id uuid := gen_random_uuid();
  v_brand_id uuid;
BEGIN
  -- Get Yummies brand ID
  SELECT id INTO v_brand_id FROM brands WHERE slug = 'yummies';
  
  -- Insert parent product
  INSERT INTO products (
    id,
    name,
    description,
    price,
    base_price,
    has_variants,
    brand_id,
    category,
    image_url,
    tags,
    inventory_status,
    is_active,
    sku
  ) VALUES (
    v_product_id,
    'Yummies Peanut Butter Biscuits',
    'Crunchy baked biscuits with real peanut butter. Made with wholesome ingredients and no artificial preservatives. Perfect for treating or training.',
    12.99,
    12.99,
    true,
    v_brand_id,
    'treats',
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500',
    '["made_in_usa", "grain_free"]'::jsonb,
    'in_stock',
    true,
    'YUM-PB-BISC'
  );

  -- Insert variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active)
  VALUES
    (v_product_id, '8 oz', 'Size', 12.99, 'YUM-PB-8OZ', 1, true),
    (v_product_id, '16 oz', 'Size', 19.99, 'YUM-PB-16OZ', 2, true),
    (v_product_id, '32 oz', 'Size', 34.99, 'YUM-PB-32OZ', 3, true);
END $$;