/*
  # Add Reward Organization System
  
  Creates milestone tracks and reward categories for better organization
*/

-- Create milestone_tracks table
CREATE TABLE IF NOT EXISTS milestone_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#16a34a',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  total_milestones integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE milestone_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active milestone tracks"
  ON milestone_tracks FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage milestone tracks"
  ON milestone_tracks FOR ALL
  TO authenticated
  USING (true);

-- Create default tracks
INSERT INTO milestone_tracks (name, description, icon, color, display_order) VALUES
  ('Sales Superstar', 'Progress through sales milestones from first sale to revenue champion', '💰', '#10b981', 1),
  ('Lead Generation Master', 'Build your audience by generating quality leads', '👥', '#3b82f6', 2),
  ('Community Builder', 'Grow your impact through referrals and partnerships', '🤝', '#8b5cf6', 3),
  ('Engagement Champion', 'Maintain consistent activity and engagement', '⚡', '#f59e0b', 4)
ON CONFLICT DO NOTHING;

-- Add organization columns to partner_rewards
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS category text DEFAULT 'evergreen';
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS milestone_track_id uuid REFERENCES milestone_tracks(id) ON DELETE SET NULL;
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS milestone_order integer;
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS display_section text DEFAULT 'general';
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS active_start_date timestamptz;
ALTER TABLE partner_rewards ADD COLUMN IF NOT EXISTS active_end_date timestamptz;

-- Add constraints
ALTER TABLE partner_rewards DROP CONSTRAINT IF EXISTS valid_reward_category;
ALTER TABLE partner_rewards ADD CONSTRAINT valid_reward_category 
  CHECK (category IN ('featured', 'evergreen', 'milestone_track', 'seasonal', 'special_event'));

ALTER TABLE partner_rewards DROP CONSTRAINT IF EXISTS valid_display_section;
ALTER TABLE partner_rewards ADD CONSTRAINT valid_display_section 
  CHECK (display_section IN ('general', 'sales', 'leads', 'referrals', 'engagement', 'special'));

-- Categorize existing rewards
UPDATE partner_rewards 
SET 
  category = 'milestone_track',
  display_section = 'sales',
  milestone_track_id = (SELECT id FROM milestone_tracks WHERE name = 'Sales Superstar' LIMIT 1),
  milestone_order = 1,
  sort_order = 1
WHERE title ILIKE '%$500%' OR title ILIKE '%first sale%';

UPDATE partner_rewards 
SET 
  category = 'milestone_track',
  display_section = 'sales',
  milestone_track_id = (SELECT id FROM milestone_tracks WHERE name = 'Sales Superstar' LIMIT 1),
  milestone_order = 2,
  sort_order = 2
WHERE title ILIKE '%$1000%' OR title ILIKE '%1k%';

UPDATE partner_rewards 
SET 
  category = 'milestone_track',
  display_section = 'leads',
  milestone_track_id = (SELECT id FROM milestone_tracks WHERE name = 'Lead Generation Master' LIMIT 1),
  milestone_order = 1,
  sort_order = 1
WHERE title ILIKE '%lead%' AND (title ILIKE '%25%' OR title ILIKE '%first%' OR title ILIKE '%10%');

UPDATE partner_rewards 
SET 
  category = 'milestone_track',
  display_section = 'leads',
  milestone_track_id = (SELECT id FROM milestone_tracks WHERE name = 'Lead Generation Master' LIMIT 1),
  milestone_order = 2,
  sort_order = 2
WHERE title ILIKE '%50 lead%';

UPDATE partner_rewards 
SET 
  category = 'milestone_track',
  display_section = 'leads',
  milestone_track_id = (SELECT id FROM milestone_tracks WHERE name = 'Lead Generation Master' LIMIT 1),
  milestone_order = 3,
  sort_order = 3
WHERE title ILIKE '%100 lead%';

UPDATE partner_rewards 
SET 
  category = 'seasonal',
  display_section = 'special',
  is_featured = true,
  sort_order = 1
WHERE title ILIKE '%holiday%' OR title ILIKE '%sprint%';

-- Update milestone counts
UPDATE milestone_tracks mt
SET total_milestones = (
  SELECT COUNT(*) 
  FROM partner_rewards pr 
  WHERE pr.milestone_track_id = mt.id
);

-- Auto-update milestone counts trigger
CREATE OR REPLACE FUNCTION update_milestone_track_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.milestone_track_id IS NOT NULL THEN
      UPDATE milestone_tracks 
      SET total_milestones = (
        SELECT COUNT(*) 
        FROM partner_rewards 
        WHERE milestone_track_id = NEW.milestone_track_id
      )
      WHERE id = NEW.milestone_track_id;
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    IF OLD.milestone_track_id IS NOT NULL THEN
      UPDATE milestone_tracks 
      SET total_milestones = (
        SELECT COUNT(*) 
        FROM partner_rewards 
        WHERE milestone_track_id = OLD.milestone_track_id
      )
      WHERE id = OLD.milestone_track_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_milestone_counts_trigger ON partner_rewards;
CREATE TRIGGER update_milestone_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON partner_rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_track_counts();
