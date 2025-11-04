/*
  # Enhance Landing Page Templates for Full Design Control
  
  1. Changes to landing_page_templates
    - Add header section controls (gradient colors, logo display)
    - Add section for main headline and subheadline
    - Add partner organization display settings
    - Add offer selection section title/description
    - Enhanced offer card structure with badges, pricing display
    - Add email form section controls
    - Add success page customization
    
  2. Offer Card Enhancements
    - Badge text and color (e.g., "POPULAR", "BEST VALUE")
    - Pricing display (amount, currency, label)
    - Discount type and value
    - Image URL
    - Button styling
*/

-- Drop and recreate with enhanced structure
ALTER TABLE landing_page_templates DROP COLUMN IF EXISTS offers CASCADE;
ALTER TABLE landing_page_templates DROP COLUMN IF EXISTS hero_image_url CASCADE;
ALTER TABLE landing_page_templates DROP COLUMN IF EXISTS cta_text CASCADE;

-- Add new columns for complete design control
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS header_gradient_from text DEFAULT '#16a34a';
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS header_gradient_to text DEFAULT '#15803d';
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS show_partner_logo boolean DEFAULT true;
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS main_headline text DEFAULT 'Shop for Your Pet Essentials at Mumbies';
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS sub_headline text DEFAULT '& Automatically Donate for Life to';
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS offer_section_title text DEFAULT 'Pick an Offer Below';
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS offer_section_description text DEFAULT 'Choose your deal and start shopping premium natural pet products';

-- Offers with complete design control
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS offers jsonb DEFAULT '[]'::jsonb;

-- Email form customization
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS email_placeholder text DEFAULT 'Enter your email address';
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS submit_button_text text DEFAULT 'Claim My Offer';

-- Success page customization  
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS success_title text DEFAULT 'Success! 🎉';
ALTER TABLE landing_page_templates ADD COLUMN IF NOT EXISTS success_message text DEFAULT 'Your offer has been claimed! Check your email to complete your registration.';

-- Update existing template with new structure
UPDATE landing_page_templates 
SET offers = '[
  {
    "id": "free-chew",
    "title": "FREE Original Chew",
    "description": "Just pay shipping",
    "image_url": "https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_products-18_a37800b8-1a65-4bfc-ba68-fdfe12952a8a.jpg?v=1734747630",
    "badge": null,
    "badge_color": "amber",
    "price_display": "$0.00",
    "price_subtext": "+ shipping",
    "discount_type": "free",
    "discount_value": "100",
    "button_color": "amber"
  },
  {
    "id": "starter-pack",
    "title": "50% OFF Starter Pack",
    "description": "Try our best sellers",
    "image_url": "https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_BisonLiverLP-OfferGraphic.png?v=1740407847",
    "badge": "POPULAR",
    "badge_color": "red",
    "price_display": "50% OFF",
    "price_subtext": "Limited time",
    "discount_type": "percentage",
    "discount_value": "50",
    "button_color": "green"
  },
  {
    "id": "bundle-discount",
    "title": "20% OFF Any Bundle",
    "description": "Stock up and save",
    "image_url": "https://cdn.shopify.com/s/files/1/0771/6913/1816/files/Mumbies_ProductListing_Variety-Welcome_Box.jpg?v=1761567120",
    "badge": null,
    "badge_color": "blue",
    "price_display": "20% OFF",
    "price_subtext": "Best value",
    "discount_type": "percentage",
    "discount_value": "20",
    "button_color": "blue"
  }
]'::jsonb
WHERE slug = 'adoption-offer';
