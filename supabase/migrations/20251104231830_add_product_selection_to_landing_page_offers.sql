/*
  # Add Product Selection to Landing Page Offers
  
  1. Changes
    - Offers can now be linked to products from the product library
    - When a product is selected, image_url auto-populates
    - Maintains backward compatibility with custom image URLs
    
  2. Notes
    - product_id is optional (null = custom offer with manual image URL)
    - When product_id is set, the offer displays that product's image
*/

-- Update existing offers to include product_id field
-- The offers are stored as JSONB, so we need to update the structure

COMMENT ON COLUMN landing_page_templates.offers IS 
'Array of offer objects. Each offer can optionally link to a product_id from the products table. Structure:
{
  "id": "unique-offer-id",
  "title": "Offer title",
  "description": "Offer description", 
  "product_id": "uuid-from-products-table (optional)",
  "image_url": "fallback or custom image URL",
  "badge": "POPULAR (optional)",
  "badge_color": "red|amber|green|blue",
  "price_display": "$0.00 or 50% OFF",
  "price_subtext": "+ shipping",
  "discount_type": "free|percentage|fixed",
  "discount_value": "100",
  "button_color": "red|amber|green|blue"
}';
