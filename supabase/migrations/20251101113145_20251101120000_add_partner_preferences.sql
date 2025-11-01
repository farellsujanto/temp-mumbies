/*
  # Add Partner Preferences Table

  1. New Table
    - `partner_preferences`
      - `partner_id` (uuid, foreign key to nonprofits, primary key)
      - `sitestripe_enabled` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Partners can read and update their own preferences
*/

CREATE TABLE IF NOT EXISTS partner_preferences (
  partner_id UUID PRIMARY KEY REFERENCES nonprofits(id) ON DELETE CASCADE,
  sitestripe_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE partner_preferences ENABLE ROW LEVEL SECURITY;

-- Partners can read their own preferences
CREATE POLICY "Partners can read own preferences"
  ON partner_preferences
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

-- Partners can update their own preferences
CREATE POLICY "Partners can update own preferences"
  ON partner_preferences
  FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

-- Partners can insert their own preferences
CREATE POLICY "Partners can insert own preferences"
  ON partner_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = auth.uid()
    )
  );

-- Create index
CREATE INDEX IF NOT EXISTS idx_partner_preferences_partner_id ON partner_preferences(partner_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_partner_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_partner_preferences_updated_at_trigger ON partner_preferences;
CREATE TRIGGER update_partner_preferences_updated_at_trigger
  BEFORE UPDATE ON partner_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_preferences_updated_at();