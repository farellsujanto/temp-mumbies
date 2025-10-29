/*
  # Create Mumbies Root Chew with Full Variants

  1. Changes
    - Deactivate old Root Chew products
    - Create new "Mumbies Root Chew" parent product
    - Create all size variants (Small through XXL) with Single Unit, 5-Pack, and 10-Pack options
    - Each variant gets its own specific image
    
  2. Notes
    - Root chews are denser than original chews
    - Variants have unique images
    - Pricing matches product sheet
*/

-- Deactivate old Root Chew products
UPDATE products SET is_active = false 
WHERE brand_id IN (SELECT id FROM brands WHERE slug = 'mumbies')
AND name LIKE '%Root Chew%';

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
    'Mumbies Root Chew',
    '<p>Mumbies Root Chews are the first of their kind. Made from the root of the non-toxic coffee tree, these provide a tougher chewing experience for pups of all sizes. The wood is denser than our popular chewing sticks, breaks down slowly, and each is uniquely shaped which dogs love! They are highly resistant to cracking and splintering which allows your dog to feed that desire to chew.</p>',
    12.49,
    12.49,
    true,
    v_brand_id,
    'toys',
    'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_Products_Sept24-52.png?v=1725910754',
    '["made_in_usa", "natural", "grain_free", "chew", "aggressive_chewer"]'::jsonb,
    'in_stock',
    true,
    'MRC',
    true,
    10.00
  );

  -- Small Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Small - Single Unit', 'Size/Bundle', 12.49, 'MRC-SMALL', 1, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Roots-Small-1.jpg?v=1744997963'),
  (v_product_id, 'Small - 5-Pack', 'Size/Bundle', 59.32, 'MRC-SMALL-5PACK', 2, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeChew-Small.jpg?v=1761587655'),
  (v_product_id, 'Small - 10-Pack', 'Size/Bundle', 106.16, 'MRC-SMALL-10PACK', 3, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_Roots-10PackSmall.jpg?v=1745070384');

  -- Medium Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Medium - Single Unit', 'Size/Bundle', 15.99, 'MRC-MEDIUM', 4, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Roots-Medium-1.jpg?v=1744997963'),
  (v_product_id, 'Medium - 5-Pack', 'Size/Bundle', 75.95, 'MRC-MEDIUM-5PACK', 5, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeChew-Medium.jpg?v=1761587671'),
  (v_product_id, 'Medium - 10-Pack', 'Size/Bundle', 135.91, 'MRC-MEDIUM-10PACK', 6, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_Roots-10PackMedium.jpg?v=1745070416');

  -- Large Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Large - Single Unit', 'Size/Bundle', 17.49, 'MRC-LARGE', 7, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Roots-Large.jpg?v=1744997963'),
  (v_product_id, 'Large - 5-Pack', 'Size/Bundle', 83.07, 'MRC-LARGE-5PACK', 8, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeChew-Large.jpg?v=1761587717'),
  (v_product_id, 'Large - 10-Pack', 'Size/Bundle', 148.66, 'MRC-LARGE-10PACK', 9, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_Roots-10PackLarge.jpg?v=1745070445');

  -- XL Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'XL - Single Unit', 'Size/Bundle', 19.99, 'MRC-XL', 10, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Roots-XL-1.jpg?v=1744997963'),
  (v_product_id, 'XL - 5-Pack', 'Size/Bundle', 94.95, 'MRC-XL-5PACK', 11, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeChew-XL.jpg?v=1761587743'),
  (v_product_id, 'XL - 10-Pack', 'Size/Bundle', 169.91, 'MRC-XL-10PACK', 12, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_Roots-10PackXL_fe8484f3-0325-4f90-b153-f59284ae361f.jpg?v=1745070504');

  -- XXL Variants
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'XXL - Single Unit', 'Size/Bundle', 21.49, 'MRC-XXL', 13, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Roots-XXL.jpg?v=1744997963'),
  (v_product_id, 'XXL - 5-Pack', 'Size/Bundle', 102.07, 'MRC-XXL-5PACK', 14, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListingTALL_FreeChew-XXL.jpg?v=1761587826'),
  (v_product_id, 'XXL - 10-Pack', 'Size/Bundle', 182.66, 'MRC-XXL-10PACK', 15, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_Roots-10PackXXL.jpg?v=1745070539');

  -- Variety Pack
  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Variety Pack - All Sizes', 'Size/Bundle', 78.71, 'MRC-VARIETY-AR', 16, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Roots-VarietywithBackground.jpg?v=1744997963');

END $$;
