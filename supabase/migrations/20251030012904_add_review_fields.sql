/*
  # Add Additional Review Fields
  
  1. Changes
    - Add `reviewer_location` field to store reviewer's location
    - Add `image_urls` field to store review image URLs as JSON array
    
  2. Notes
    - Uses jsonb for efficient image URL storage
    - Allows null values for optional fields
*/

-- Add new columns to product_reviews table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_reviews' AND column_name = 'reviewer_location'
  ) THEN
    ALTER TABLE product_reviews ADD COLUMN reviewer_location text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_reviews' AND column_name = 'image_urls'
  ) THEN
    ALTER TABLE product_reviews ADD COLUMN image_urls jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;
