/*
  # Fix Giveaway Bundles RLS Policies
  
  1. Drop existing restrictive policies
  2. Add proper policies for admins and partners
  3. Allow admins to create/manage bundles
  4. Allow partners to view active bundles
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view active bundles" ON giveaway_bundles;
DROP POLICY IF EXISTS "Admins can manage bundles" ON giveaway_bundles;
DROP POLICY IF EXISTS "Service role can manage bundles" ON giveaway_bundles;

-- Admin users can do everything
CREATE POLICY "Admins can manage giveaway bundles"
  ON giveaway_bundles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Partners and public can view active bundles
CREATE POLICY "Anyone can view active giveaway bundles"
  ON giveaway_bundles FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Service role has full access
CREATE POLICY "Service role can manage bundles"
  ON giveaway_bundles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
