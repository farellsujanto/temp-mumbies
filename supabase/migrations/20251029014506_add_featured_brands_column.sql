/*
  # Add Featured Brands Support

  1. Changes
    - Add `is_featured` boolean column to `brands` table
    - Set default to false
    - Add index for better query performance
  
  2. Notes
    - This column allows marking certain brands for display in the featured brands section
    - Existing brands will default to not featured
*/

ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false NOT NULL;

CREATE INDEX IF NOT EXISTS idx_brands_is_featured ON brands(is_featured) WHERE is_featured = true;