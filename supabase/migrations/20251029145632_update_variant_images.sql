/*
  # Update Variant Images

  1. Changes
    - Set variant images to use parent product images
    - Updates all variants to inherit their parent product's image_url
    
  2. Notes
    - Variants will display the same image as their parent product
    - This ensures consistent product representation across variant options
*/

-- Update all product variants to use their parent product's image
UPDATE product_variants pv
SET image_url = p.image_url
FROM products p
WHERE pv.product_id = p.id
  AND pv.image_url IS NULL;