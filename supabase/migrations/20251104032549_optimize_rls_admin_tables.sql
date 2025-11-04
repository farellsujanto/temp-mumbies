/*
  # Optimize RLS - Admin Tables
*/

-- ADMIN_ACTIVITY_LOG
DROP POLICY IF EXISTS "Admins can insert activity log" ON admin_activity_log;
CREATE POLICY "Admins can insert activity log" ON admin_activity_log
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Admins can view activity log" ON admin_activity_log;
CREATE POLICY "Admins can view activity log" ON admin_activity_log
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

-- PAYOUT_BATCHES
DROP POLICY IF EXISTS "Admins can manage payout batches" ON payout_batches;
CREATE POLICY "Admins can manage payout batches" ON payout_batches
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

-- HERO_SLIDES
DROP POLICY IF EXISTS "Admins can manage slides" ON hero_slides;
CREATE POLICY "Admins can manage slides" ON hero_slides
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

-- PLATFORM_SETTINGS
DROP POLICY IF EXISTS "Admins can manage settings" ON platform_settings;
CREATE POLICY "Admins can manage settings" ON platform_settings
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

-- ADMIN_NOTIFICATIONS (already done in earlier batch, skip)

-- ADMIN_BALANCE_ADJUSTMENTS
DROP POLICY IF EXISTS "Admins can view balance adjustments" ON admin_balance_adjustments;
CREATE POLICY "Admins can view balance adjustments" ON admin_balance_adjustments
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

-- USER_STATUS_HISTORY
DROP POLICY IF EXISTS "Admins can insert status history" ON user_status_history;
CREATE POLICY "Admins can insert status history" ON user_status_history
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Admins can view status history" ON user_status_history;
CREATE POLICY "Admins can view status history" ON user_status_history
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));