/*
  # Make Legacy Fields Nullable in Giveaway Bundles
  
  1. Allow null values for legacy fields
    - retail_value (replaced by total_value)
    - tier (no longer required)
    - sales_threshold (replaced by unlock_requirement_value)
  
  2. Set defaults for legacy fields when null
*/

-- Make legacy fields nullable
ALTER TABLE giveaway_bundles 
  ALTER COLUMN retail_value DROP NOT NULL,
  ALTER COLUMN tier DROP NOT NULL,
  ALTER COLUMN sales_threshold DROP NOT NULL;

-- Set default values for existing null entries
UPDATE giveaway_bundles 
SET 
  retail_value = COALESCE(retail_value, total_value, 0),
  tier = COALESCE(tier, 'gold'),
  sales_threshold = COALESCE(sales_threshold, unlock_requirement_value, 0)
WHERE retail_value IS NULL OR tier IS NULL OR sales_threshold IS NULL;
