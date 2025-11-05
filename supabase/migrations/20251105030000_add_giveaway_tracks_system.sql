/*
  # Add Giveaway Milestone Tracks System

  1. New Tables
    - `giveaway_milestone_tracks` - Organized progression paths for giveaways
      - `id` (uuid, primary key)
      - `name` (text) - Track name (e.g., "Quarterly Giveaways", "Revenue Milestones")
      - `description` (text) - Track description
      - `icon` (text) - Icon identifier
      - `color` (text) - Brand color for UI
      - `display_order` (integer) - Sort order
      - `is_active` (boolean) - Whether track is active
      - `created_at`, `updated_at` (timestamptz)

  2. Changes to `giveaway_bundles` Table
    - Add `track_id` (uuid) - Links bundle to a track
    - Add `track_milestone_order` (integer) - Order within track
    - Add `track_milestone_label` (text) - Label for milestone (e.g., "$5K Milestone")

  3. Security
    - Enable RLS on `giveaway_milestone_tracks`
    - Admin-only policies for management
    - Partners can view active tracks
*/

-- Create giveaway milestone tracks table
CREATE TABLE IF NOT EXISTS giveaway_milestone_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'trophy',
  color TEXT DEFAULT 'green',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add track fields to giveaway_bundles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'giveaway_bundles' AND column_name = 'track_id'
  ) THEN
    ALTER TABLE giveaway_bundles
    ADD COLUMN track_id UUID REFERENCES giveaway_milestone_tracks(id) ON DELETE SET NULL,
    ADD COLUMN track_milestone_order INTEGER DEFAULT 0,
    ADD COLUMN track_milestone_label TEXT;
  END IF;
END $$;

-- Create index for track lookups
CREATE INDEX IF NOT EXISTS idx_giveaway_bundles_track
  ON giveaway_bundles(track_id, track_milestone_order);

-- Enable RLS
ALTER TABLE giveaway_milestone_tracks ENABLE ROW LEVEL SECURITY;

-- Admin policies for giveaway_milestone_tracks
CREATE POLICY "Admins can manage giveaway tracks"
  ON giveaway_milestone_tracks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Partners can view active tracks
CREATE POLICY "Partners can view active giveaway tracks"
  ON giveaway_milestone_tracks FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create sample tracks
INSERT INTO giveaway_milestone_tracks (name, description, icon, color, display_order) VALUES
  ('Revenue Milestones', 'Unlock giveaways as you hit sales targets', 'trending-up', 'green', 1),
  ('Quarterly Campaigns', 'Seasonal giveaway opportunities for engaged partners', 'calendar', 'blue', 2),
  ('Launch Bonuses', 'Special giveaways for new partners getting started', 'rocket', 'purple', 3)
ON CONFLICT DO NOTHING;

-- Update trigger
CREATE OR REPLACE FUNCTION update_giveaway_milestone_tracks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_giveaway_milestone_tracks_timestamp
  BEFORE UPDATE ON giveaway_milestone_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_giveaway_milestone_tracks_updated_at();
