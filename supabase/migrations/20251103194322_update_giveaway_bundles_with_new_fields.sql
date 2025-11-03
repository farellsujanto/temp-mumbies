/*
  # Update Giveaway Bundles Table

  1. Add new fields for unlocking system
    - featured_image_url (renamed from image_url for consistency)
    - total_value (replaces retail_value)
    - unlock_requirement_type (mumbies_cash, leads, referrals)
    - unlock_requirement_value (amount required)
    - is_active (whether bundle is available)
  
  2. Keep backward compatibility
    - Preserve existing fields
    - Map old values to new fields
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'giveaway_bundles' AND column_name = 'featured_image_url') THEN
    ALTER TABLE giveaway_bundles ADD COLUMN featured_image_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'giveaway_bundles' AND column_name = 'total_value') THEN
    ALTER TABLE giveaway_bundles ADD COLUMN total_value DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'giveaway_bundles' AND column_name = 'unlock_requirement_type') THEN
    ALTER TABLE giveaway_bundles ADD COLUMN unlock_requirement_type TEXT DEFAULT 'mumbies_cash';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'giveaway_bundles' AND column_name = 'unlock_requirement_value') THEN
    ALTER TABLE giveaway_bundles ADD COLUMN unlock_requirement_value INTEGER DEFAULT 100;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'giveaway_bundles' AND column_name = 'is_active') THEN
    ALTER TABLE giveaway_bundles ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'giveaway_bundles' AND column_name = 'updated_at') THEN
    ALTER TABLE giveaway_bundles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Copy existing data to new fields
UPDATE giveaway_bundles 
SET 
  featured_image_url = COALESCE(featured_image_url, image_url),
  total_value = COALESCE(total_value, retail_value)
WHERE featured_image_url IS NULL OR total_value IS NULL;

-- Map sales_threshold to unlock requirements  
UPDATE giveaway_bundles
SET 
  unlock_requirement_type = 'mumbies_cash',
  unlock_requirement_value = (sales_threshold * 10)::INTEGER
WHERE unlock_requirement_value IS NULL OR unlock_requirement_value = 100;

-- Create index on is_active for quick filtering
CREATE INDEX IF NOT EXISTS idx_giveaway_bundles_active ON giveaway_bundles(is_active) WHERE is_active = true;
