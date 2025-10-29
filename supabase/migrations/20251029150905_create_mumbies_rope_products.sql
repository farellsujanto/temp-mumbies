/*
  # Create Mumbies Rope Products with Variants

  1. Changes
    - Deactivate old rope products
    - Create Coconut Rope & Original Chew with variants
    - Create Coconut Rope & Root Chew with variants
    - Create Coconut Rope Ball with variants
    - Create Coconut Rope Ring with variants
    - Create Coconut Rope Tug with variants
    
  2. Notes
    - Each product has size variants with bundle options
    - All variants have unique images
*/

-- Deactivate old rope products
UPDATE products SET is_active = false 
WHERE brand_id IN (SELECT id FROM brands WHERE slug = 'mumbies')
AND (name LIKE '%Coconut%' OR name LIKE '%Rope%');

-- Coconut Rope & Original Chew
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
    'Coconut Rope & Original Chew',
    '<p>This is a fun and interactive rope toy made from 100% coconut husk fiber, while the wood chew in the center is 100% non-toxic coffee tree – same as our Original Mumbies Chew. This is best for moderate chewers as the rope is soft and the chews will be a little less dense than the Original Chew.</p>',
    10.49,
    10.49,
    true,
    v_brand_id,
    'toys',
    'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/studio_product_shoot_2-19.png?v=1737259345',
    '["natural", "interactive", "rope", "chew"]'::jsonb,
    'in_stock',
    true,
    'BCRC',
    true,
    10.00
  );

  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Small - Single Unit', 'Size/Bundle', 10.49, 'BCRC-SMALL', 1, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Chew-Small.jpg?v=1745079161'),
  (v_product_id, 'Small - 5-Pack', 'Size/Bundle', 49.82, 'BCRC-SMALL-5PACK', 2, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeChew-Small.jpg?v=1745079161'),
  (v_product_id, 'Medium - Single Unit', 'Size/Bundle', 13.95, 'BCRC-MEDIUM', 3, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Chew-Medium.jpg?v=1745079161'),
  (v_product_id, 'Medium - 5-Pack', 'Size/Bundle', 66.26, 'BCRC-MEDIUM-5PACK', 4, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeChew-Medium.jpg?v=1745079161'),
  (v_product_id, 'Large - Single Unit', 'Size/Bundle', 16.49, 'BCRC-LARGE', 5, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Chew-Large.jpg?v=1745079161'),
  (v_product_id, 'Large - 5-Pack', 'Size/Bundle', 78.30, 'BCRC-LARGE-5PACK', 6, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeChew-Large.jpg?v=1745079161'),
  (v_product_id, 'XL - Single Unit', 'Size/Bundle', 17.95, 'BCRC-XL', 7, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Chew-XL.jpg?v=1745079161'),
  (v_product_id, 'XL - 5-Pack', 'Size/Bundle', 85.26, 'BCRC-XL-5PACK', 8, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeChew-XL.jpg?v=1745079161'),
  (v_product_id, 'XXL - Single Unit', 'Size/Bundle', 19.49, 'BCRC-XXL', 9, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Chew-XXL.jpg?v=1745079161'),
  (v_product_id, 'XXL - 5-Pack', 'Size/Bundle', 92.57, 'BCRC-XXL-5PACK', 10, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeChew-XXL.jpg?v=1745079161');
END $$;

-- Coconut Rope & Root Chew
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
    'Coconut Rope & Root Chew',
    '<p>Great for playing tug, fetch, or gnawing on the Mumbies root chew. The braided rope is made from coconut husk fiber, while the wood chew in the center is 100% non-toxic coffee tree – same as our Mumbies Root Chew. They are dense, break down slowly, and are highly resistant to cracking and splintering due to the hardness of the wood and tightly packed fibers within. Best for moderate chewers.</p>',
    14.95,
    14.95,
    true,
    v_brand_id,
    'toys',
    'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/rope_with_root_edit_1-_shopify.png?v=1737259462',
    '["natural", "interactive", "rope", "chew"]'::jsonb,
    'in_stock',
    true,
    'BCRR',
    true,
    10.00
  );

  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Small - Single Unit', 'Size/Bundle', 14.95, 'BCRR-SMALL', 1, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Root-Small.jpg?v=1747358211'),
  (v_product_id, 'Small - 5-Pack', 'Size/Bundle', 71.01, 'BCRR-SMALL-5PACK', 2, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeRoot-Small.jpg?v=1745080148'),
  (v_product_id, 'Medium - Single Unit', 'Size/Bundle', 16.49, 'BCRR-MEDIUM', 3, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Root-Medium.jpg?v=1747358211'),
  (v_product_id, 'Medium - 5-Pack', 'Size/Bundle', 78.32, 'BCRR-MEDIUM-5PACK', 4, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeRoot-Medium.jpg?v=1745080164'),
  (v_product_id, 'Large - Single Unit', 'Size/Bundle', 18.95, 'BCRR-LARGE', 5, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Root-Large.jpg?v=1747358211'),
  (v_product_id, 'Large - 5-Pack', 'Size/Bundle', 90.01, 'BCRR-LARGE-5PACK', 6, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeRoot-Large.jpg?v=1745080175'),
  (v_product_id, 'XL - Single Unit', 'Size/Bundle', 20.49, 'BCRR-XL', 7, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Rope_Root-XL.jpg?v=1745079200'),
  (v_product_id, 'XL - 5-Pack', 'Size/Bundle', 97.32, 'BCRR-XL-5PACK', 8, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeRoot-XL.jpg?v=1745080187'),
  (v_product_id, 'XXL - Single Unit', 'Size/Bundle', 22.95, 'M-BCRR-XXL', 9, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/rope_with_root_edit_1-_shopify.png?v=1737259462'),
  (v_product_id, 'XXL - 5-Pack', 'Size/Bundle', 109.01, 'BCRR-XXL-5PACK', 10, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BulkBundles_RopeRoot-XXL.jpg?v=1745080198');
END $$;

-- Coconut Rope Ball
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
    'Coconut Rope Ball',
    '<p>Whether you have a pup that loves chasing after a ball, or one that loves soft toys they can shred to pieces, the coconut rope ball provides long lasting play time for whatever your pup desires. Made from 100% braided coconut husk fibers, it supports dental health, is biodegradable, and makes a great natural alternative to plush toys and balls.</p>',
    7.95,
    7.95,
    true,
    v_brand_id,
    'toys',
    'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/studioproductshoot2-13.png?v=1761567120',
    '["natural", "rope", "ball", "plush"]'::jsonb,
    'in_stock',
    true,
    'CRB',
    true,
    10.00
  );

  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Small - Single Unit', 'Size/Bundle', 7.95, 'CRB-SMALL', 1, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-Small.jpg?v=1760658350'),
  (v_product_id, 'Small - 5-Pack', 'Size/Bundle', 37.76, 'CRB-SMALL-5PACK', 2, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-Small.jpg?v=1760658350'),
  (v_product_id, 'Medium - Single Unit', 'Size/Bundle', 9.95, 'CRB-MEDUIM', 3, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-Medium.jpg?v=1760658367'),
  (v_product_id, 'Medium - 5-Pack', 'Size/Bundle', 47.26, 'CRB-MEDIUM-5PACK', 4, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-Medium.jpg?v=1760658367'),
  (v_product_id, 'Large - Single Unit', 'Size/Bundle', 12.95, 'CRB-LARGE', 5, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-Large.jpg?v=1760658388'),
  (v_product_id, 'Large - 5-Pack', 'Size/Bundle', 61.51, 'CRB-LARGE-5PACK', 6, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-Large.jpg?v=1760658388'),
  (v_product_id, 'XL - Single Unit', 'Size/Bundle', 14.95, 'CRB-XL', 7, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/XLCRB.png?v=1736368966'),
  (v_product_id, 'XL - 5-Pack', 'Size/Bundle', 71.01, 'CRB-XL-5PACK', 8, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-Small.jpg?v=1760658350'),
  (v_product_id, 'XXL - Single Unit', 'Size/Bundle', 17.95, 'CRB-XXL', 9, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-XXL.jpg?v=1760658407'),
  (v_product_id, 'XXL - 5-Pack', 'Size/Bundle', 85.26, 'CRB-XXL-5PACK', 10, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-Large.jpg?v=1760658388'),
  (v_product_id, 'Variety Pack - All Sizes', 'Size/Bundle', 56.47, 'CRB-VARIETY-ALLSIZE', 11, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeBall-VarietyPack.jpg?v=1760658424');
END $$;

-- Coconut Rope Ring
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
    'Coconut Rope Ring',
    '<p>Perfect for tug-of-war, tossing across the yard, or giving your pup something satisfying to chew on. The Coconut Rope Ring is crafted entirely from tightly braided coconut husk fibers—plastic-free, eco-friendly, and gentle on teeth.</p>',
    10.95,
    10.95,
    true,
    v_brand_id,
    'toys',
    'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRingVariety-1.jpg?v=1761567120',
    '["natural", "rope", "ring", "tug"]'::jsonb,
    'in_stock',
    true,
    'CRR',
    true,
    10.00
  );

  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Small - Single Unit', 'Size/Bundle', 10.95, 'CRR-SMALL', 1, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeRing-Small.jpg?v=1760659021'),
  (v_product_id, 'Small - 5-Pack', 'Size/Bundle', 52.01, 'CRR-SMALL-5PACK', 2, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRingVariety-2.jpg?v=1757451549'),
  (v_product_id, 'Medium - Single Unit', 'Size/Bundle', 13.95, 'CRR-MEDUIM', 3, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeRing-Medium.jpg?v=1760659039'),
  (v_product_id, 'Medium - 5-Pack', 'Size/Bundle', 66.26, 'CRR-MEDIUM-5PACK', 4, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRingVariety-Medium.jpg?v=1757598598'),
  (v_product_id, 'Large - Single Unit', 'Size/Bundle', 17.95, 'CRR-LARGE', 5, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeRing-Large.jpg?v=1760659056'),
  (v_product_id, 'Large - 5-Pack', 'Size/Bundle', 85.26, 'CRR-LARGE-5PACK', 6, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRingVariety-Large_05f4a279-6f3c-4a80-80ae-6a3d71e69e77.jpg?v=1757598598'),
  (v_product_id, 'XL - Single Unit', 'Size/Bundle', 19.95, 'CRR-XL', 7, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeRing-XL.jpg?v=1760659103'),
  (v_product_id, 'XL - 5-Pack', 'Size/Bundle', 94.76, 'CRR-XL-5PACK', 8, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRingVariety-XL.jpg?v=1757598598'),
  (v_product_id, 'XXL - Single Unit', 'Size/Bundle', 23.95, 'CRR-XXL', 9, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeRing-XXL.jpg?v=1760659121'),
  (v_product_id, 'XXL - 5-Pack', 'Size/Bundle', 113.76, 'CRR-XXL-5PACK', 10, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRingVariety-XXL.jpg?v=1757598598'),
  (v_product_id, 'Variety Pack - All Sizes', 'Size/Bundle', 78.07, 'CRR-VARIETY-ALLSIZE', 11, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRingVariety-1.jpg?v=1761567120');
END $$;

-- Coconut Rope Tug
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
    'Coconut Rope Tug',
    '<p>Built for tug-of-war champions, the Coconut Rope Tug gives dogs a natural way to pull, play, and chew. Made from tightly braided coconut husk fibers, it is completely plastic-free, eco-friendly, and designed with both fun and function in mind.</p>',
    9.95,
    9.95,
    true,
    v_brand_id,
    'toys',
    'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_TugVarietyPack-1.jpg?v=1761567120',
    '["natural", "rope", "tug"]'::jsonb,
    'in_stock',
    true,
    'CRT',
    true,
    10.00
  );

  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Small - Single Unit', 'Size/Bundle', 9.95, 'CRT-SMALL', 1, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeTug-Small.jpg?v=1760660179'),
  (v_product_id, 'Small - 5-Pack', 'Size/Bundle', 47.26, 'CRT-SMALL-5PACK', 2, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_TugVarietyPack-1.jpg?v=1761567120'),
  (v_product_id, 'Medium - Single Unit', 'Size/Bundle', 12.95, 'CRT-MEDIUM', 3, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeTug-Medium.jpg?v=1760660195'),
  (v_product_id, 'Medium - 5-Pack', 'Size/Bundle', 61.51, 'CRT-MEDIUM-5PACK', 4, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_TugVarietyPack-1.jpg?v=1761567120'),
  (v_product_id, 'Large - Single Unit', 'Size/Bundle', 15.95, 'CRT-LARGE', 5, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeTug-Large.jpg?v=1760660212'),
  (v_product_id, 'Large - 5-Pack', 'Size/Bundle', 75.75, 'CRT-LARGE-5PACK', 6, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_TugVarietyPack-1.jpg?v=1761567120'),
  (v_product_id, 'XL - Single Unit', 'Size/Bundle', 18.95, 'CRT-XL', 7, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeTug-XL.jpg?v=1760660239'),
  (v_product_id, 'XL - 5-Pack', 'Size/Bundle', 90.01, 'CRT-XL-5PACK', 8, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_TugVarietyPack-1.jpg?v=1761567120'),
  (v_product_id, 'XXL - Single Unit', 'Size/Bundle', 22.95, 'CRT-XXL', 9, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_CocoRopeTug-XXL.jpg?v=1760660257'),
  (v_product_id, 'XXL - 5-Pack', 'Size/Bundle', 109.01, 'CRT-XXL-5PACK', 10, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_TugVarietyPack-1.jpg?v=1761567120'),
  (v_product_id, 'Variety Pack - All Sizes', 'Size/Bundle', 72.67, 'CRT-VARIETY-ALLSIZE', 11, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_TugVarietyPack-1.jpg?v=1761567120');
END $$;
