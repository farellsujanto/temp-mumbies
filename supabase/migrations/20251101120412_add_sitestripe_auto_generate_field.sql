/*
  # Add SiteStripe Auto-Generate Field
  
  1. Changes
    - Add `sitestripe_auto_generate` column to `partner_preferences` table
    - Default value is `true` (auto-generate links by default)
  
  2. Notes
    - This field controls whether SiteStripe automatically generates short links for pages
    - Partners can toggle this in the SiteStripe settings dropdown
*/

-- Add the auto-generate field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_preferences' AND column_name = 'sitestripe_auto_generate'
  ) THEN
    ALTER TABLE partner_preferences ADD COLUMN sitestripe_auto_generate BOOLEAN DEFAULT true;
  END IF;
END $$;