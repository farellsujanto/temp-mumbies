/*
  # Create Mumbies Original Chew with Full Variants

  1. Changes
    - Deactivate old Original Chew products
    - Create new "Mumbies Original Wood Chew" parent product
    - Create all size variants (XS through XXL) with Single Unit, 5-Pack, and 10-Pack options
    - Each variant gets its own specific image that will display when selected
    
  2. Notes
    - Variants have unique images
    - Pricing matches product sheet
    - Supports subscription with 10% discount
*/

-- Deactivate old Original Chew products
UPDATE products SET is_active = false 
WHERE brand_id IN (SELECT id FROM brands WHERE slug = 'mumbies')
AND (name LIKE '%Original Chew%' OR name LIKE '%Original Coffee Wood%');

-- Create parent product
DO $$
DECLARE
  v_product_id uuid := gen_random_uuid();
  v_brand_id uuid;
BEGIN
  SELECT id INTO v_brand_id FROM brands WHERE slug = 'mumbies';
  
  INSERT INTO products (
    id, name, description, price, base_price, has_variants,
    brand_id, category, image_url, tags, inventory_status,
    is_active, sku, is_subscription_available, subscription_discount
  ) VALUES (
    v_product_id,
    'Mumbies Original Wood Chew',
    '<p>When your dog makes a beeline for a stick outside, it''s hard to know if they''re harmful to their health. Mumbies coffee tree wood chews are dense, break down slowly, and are highly-resistant to cracking and splintering. They allow your dog feed their natural desire to gnaw and chew without all the bad stuff.</p>',
    8.95,
    8.95,
    true,
    v_brand_id,
    'toys',
    'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-OGChews-1.jpg?v=1741314663',
    '["made_in_usa", "natural", "grain_free", "chew", "aggressive_chewer"]'::jsonb,
    'in_stock',
    true,
    'MWC',
    true,
    10.00
  );

  -- XS Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'XS - Single Unit', 'Size/Bundle', 8.95, 'MWC-XS', 1, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_XS.jpg?v=1760658297'),
  (v_product_id, 'XS - 5-Pack', 'Size/Bundle', 42.51, 'MWC-XS-5PACK', 2, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_XS5Pack.jpg?v=1760658316'),
  (v_product_id, 'XS - 10-Pack', 'Size/Bundle', 76.08, 'MWC-XS-10PACK', 3, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-OGChews-1.jpg?v=1741314663');

  -- Small Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Small - Single Unit', 'Size/Bundle', 10.95, 'MWC-SMALL', 4, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-OGChews-3-S.jpg?v=1741314994'),
  (v_product_id, 'Small - 5-Pack', 'Size/Bundle', 52.01, 'MWC-SMALL-5PACK', 5, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeRoot-Small_e842527b-72e1-41c2-9653-1ba236926533.jpg?v=1761587490'),
  (v_product_id, 'Small - 10-Pack', 'Size/Bundle', 93.07, 'MWC-SMALL-10PACK', 6, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-10Pack-S.jpg?v=1741315321');

  -- Medium Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Medium - Single Unit', 'Size/Bundle', 14.49, 'MWC-MEDIUM', 7, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-OGChews-3-M.jpg?v=1741314994'),
  (v_product_id, 'Medium - 5-Pack', 'Size/Bundle', 68.82, 'MWC-MEDIUM-5PACK', 8, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeRoot-Medium.jpg?v=1761587508'),
  (v_product_id, 'Medium - 10-Pack', 'Size/Bundle', 123.16, 'MWC-MEDIUM-10PACK', 9, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-10Pack-M.jpg?v=1741315321');

  -- Large Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Large - Single Unit', 'Size/Bundle', 17.95, 'MWC-LARGE', 10, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-OGChews-3-L.jpg?v=1741314994'),
  (v_product_id, 'Large - 5-Pack', 'Size/Bundle', 85.26, 'MWC-LARGE-5PACK', 11, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeRoot-Large.jpg?v=1761587526'),
  (v_product_id, 'Large - 10-Pack', 'Size/Bundle', 152.57, 'MWC-LARGE-10PACK', 12, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-10Pack-L.jpg?v=1741315321');

  -- XL Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'XL - Single Unit', 'Size/Bundle', 19.49, 'MWC-XLARGE', 13, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-OGChews-3-XL.jpg?v=1741314994'),
  (v_product_id, 'XL - 5-Pack', 'Size/Bundle', 92.57, 'MWC-XL-5PACK', 14, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeRoot-XL.jpg?v=1761587547'),
  (v_product_id, 'XL - 10-Pack', 'Size/Bundle', 165.66, 'MWC-XL-10PACK', 15, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-10Pack-XL.jpg?v=1741315321');

  -- XXL Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'XXL - Single Unit', 'Size/Bundle', 21.95, 'MWC-XXL', 16, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-OGChews-3-XXL.jpg?v=1741314994'),
  (v_product_id, 'XXL - 5-Pack', 'Size/Bundle', 104.26, 'MWC-XXL-5PACK', 17, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeRoot-XXL.jpg?v=1761587564'),
  (v_product_id, 'XXL - 10-Pack', 'Size/Bundle', 186.57, 'MWC-XXL-10PACK', 18, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-10Pack-XXL.jpg?v=1741315321');

  -- Variety Pack
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Variety Pack - All Sizes', 'Size/Bundle', 84.40, 'MWC-VARIETY-AC', 19, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_OriginalChew-VarietyPackwithXS.webp?v=1761249751');

END $$;
