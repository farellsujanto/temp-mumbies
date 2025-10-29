/*
  # Create Yummies Bison Liver with Variants

  1. Changes
    - Deactivate old Yummies products
    - Create Yummies Bison Liver Treats parent product
    - Create bundle variants (Single Unit, 5-Pack, 12-Pack)
    
  2. Notes
    - Freeze-dried raw bison liver treats
    - Category is treats, not toys
*/

-- Deactivate old Yummies products
UPDATE products SET is_active = false 
WHERE brand_id IN (SELECT id FROM brands WHERE slug = 'mumbies')
AND name LIKE '%Yummies%';

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
    'Yummies Bison Liver Treats',
    '<h3><strong>Freeze-dried, raw bison liver is the ultimate treat.</strong></h3><p>Nearly 2 pounds of organ meat go into bag, delivering a high-protein snack loaded with naturally occurring vitamins A and B, iron, zinc, and copper to support your pup''s immune system, skin health, and energy levels.</p><ul><li>Sourced from American bison</li><li>Single-ingredient</li><li>No additives or fillers</li><li>Great for dogs with food sensitivities</li><li>Guilt-free treat or meal topper</li></ul>',
    26.50,
    26.50,
    true,
    v_brand_id,
    'treats',
    'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/BisonLiver-13.png?v=1740407847',
    '["made_in_usa", "natural", "grain_free", "high_protein", "single_ingredient"]'::jsonb,
    'in_stock',
    true,
    'MY-FDBL',
    true,
    10.00
  );

  INSERT INTO product_variants (product_id, variant_name, variant_type, price, sku, sort_order, is_active, image_url) VALUES
  (v_product_id, 'Single Unit', 'Bundle', 26.50, 'MY-FDBL-1', 1, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/BisonLiver-13.png?v=1740407847'),
  (v_product_id, '5-Pack', 'Bundle', 125.87, 'MY-FDBL-5PACK', 2, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-Bison5Pack.png?v=1741218447'),
  (v_product_id, '12-Pack', 'Bundle', 270.30, 'MY-FDBL-12PACK', 3, true, 'https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing-Bison12pack.png?v=1741218465');

END $$;
