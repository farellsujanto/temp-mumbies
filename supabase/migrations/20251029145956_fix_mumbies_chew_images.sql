/*
  # Fix Mumbies Original Chew Images

  1. Changes
    - Update Mumbies Original Chew product to use toy/chew image
    - Update category from treats to toys since it's a chew toy
    - Update all variants to use the parent product image
    
  2. Notes
    - Corrects the product image to show actual chew toy products
    - Ensures variants inherit the correct toy image
*/

-- Update Mumbies Original Chew to use toy image and correct category
UPDATE products
SET 
  image_url = 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=500',
  category = 'toys'
WHERE name = 'Mumbies Original Chew';

-- Update all variants for this product to use the toy image
UPDATE product_variants pv
SET image_url = 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=500'
FROM products p
WHERE pv.product_id = p.id
  AND p.name = 'Mumbies Original Chew';