/*
  # Add Giveaway Bundle Management Fields

  1. New Fields Added to giveaway_bundles
    - `is_universal` - Whether bundle is available to all partners or specific ones
    - `allow_reuse` - Whether partners can run the same bundle multiple times
    - `cooldown_days` - Days required between reusing same bundle
    - `assigned_partner_ids` - Array of partner IDs if partner-specific
    - `is_active` - Soft delete flag for bundle visibility
    - `created_by_admin_id` - Track which admin created the bundle
    - `updated_at` - Track last modification time
    - `products_description` - Text description of included products

  2. New Fields Added to partner_giveaways
    - `times_used_by_partner` - Track how many times partner used this bundle
    - `last_run_ended_at` - Track when last instance ended (for cooldown)

  3. Security
    - Maintains existing RLS policies
    - Admin-only write access to bundles
*/

-- Add new fields to giveaway_bundles
ALTER TABLE giveaway_bundles
ADD COLUMN IF NOT EXISTS is_universal BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_reuse BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cooldown_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS assigned_partner_ids UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_by_admin_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS products_description TEXT;

-- Add tracking fields to partner_giveaways
ALTER TABLE partner_giveaways
ADD COLUMN IF NOT EXISTS times_used_by_partner INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_run_ended_at TIMESTAMPTZ;

-- Create index for faster bundle lookups
CREATE INDEX IF NOT EXISTS idx_giveaway_bundles_active ON giveaway_bundles(is_active);
CREATE INDEX IF NOT EXISTS idx_giveaway_bundles_universal ON giveaway_bundles(is_universal);

-- Create index for partner giveaway queries
CREATE INDEX IF NOT EXISTS idx_partner_giveaways_bundle_partner ON partner_giveaways(bundle_id, partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_giveaways_status ON partner_giveaways(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_giveaway_bundle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_giveaway_bundle_updated_at ON giveaway_bundles;
CREATE TRIGGER set_giveaway_bundle_updated_at
  BEFORE UPDATE ON giveaway_bundles
  FOR EACH ROW
  EXECUTE FUNCTION update_giveaway_bundle_updated_at();

-- Update existing bundles to have sensible defaults
UPDATE giveaway_bundles
SET
  is_universal = true,
  allow_reuse = false,
  is_active = true,
  updated_at = now()
WHERE is_universal IS NULL;