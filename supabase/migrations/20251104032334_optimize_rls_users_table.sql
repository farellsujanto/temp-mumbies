/*
  # Optimize RLS - Users Table
*/

DROP POLICY IF EXISTS "Nonprofits can view attributed user emails" ON users;
CREATE POLICY "Nonprofits can view attributed user emails" ON users
  FOR SELECT TO authenticated
  USING (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));