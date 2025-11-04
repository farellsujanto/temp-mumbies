/*
  # Optimize RLS - Partner Settings and Test Mode
*/

-- PARTNER_SETTINGS
DROP POLICY IF EXISTS "Admins manage test mode" ON partner_settings;
CREATE POLICY "Admins manage test mode" ON partner_settings
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Partners manage own settings" ON partner_settings;
CREATE POLICY "Partners manage own settings" ON partner_settings
  FOR ALL TO authenticated
  USING (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- TEST_MODE_LOGS
DROP POLICY IF EXISTS "Admins view all test logs" ON test_mode_logs;
CREATE POLICY "Admins view all test logs" ON test_mode_logs
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Partners view own test logs" ON test_mode_logs;
CREATE POLICY "Partners view own test logs" ON test_mode_logs
  FOR SELECT TO authenticated
  USING (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- TEST_SCENARIOS
DROP POLICY IF EXISTS "Admins manage scenarios" ON test_scenarios;
CREATE POLICY "Admins manage scenarios" ON test_scenarios
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));