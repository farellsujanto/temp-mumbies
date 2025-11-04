/*
  # Optimize RLS - Partner Preferences
*/

DROP POLICY IF EXISTS "Partners can insert own preferences" ON partner_preferences;
CREATE POLICY "Partners can insert own preferences" ON partner_preferences
  FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can read own preferences" ON partner_preferences;
CREATE POLICY "Partners can read own preferences" ON partner_preferences
  FOR SELECT TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can update own preferences" ON partner_preferences;
CREATE POLICY "Partners can update own preferences" ON partner_preferences
  FOR UPDATE TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));