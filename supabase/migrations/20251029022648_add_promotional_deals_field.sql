/*
  # Add promotional deals field to products

  1. Changes
    - Add `promotional_deal` column to products table
    - This field stores promotional text like "Buy 3, Get 1 Free"
    - Optional field, NULL by default
    
  2. Notes
    - This allows specific products to display promotional offers
    - Format is flexible text for marketing purposes
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'promotional_deal'
  ) THEN
    ALTER TABLE products ADD COLUMN promotional_deal text;
  END IF;
END $$;