/*
  # Optimize RLS - Partner Rewards System
*/

-- PARTNER_REWARD_PROGRESS
DROP POLICY IF EXISTS "Admins can manage all progress" ON partner_reward_progress;
CREATE POLICY "Admins can manage all progress" ON partner_reward_progress
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Partners can start challenges" ON partner_reward_progress;
CREATE POLICY "Partners can start challenges" ON partner_reward_progress
  FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can update their own progress" ON partner_reward_progress;
CREATE POLICY "Partners can update their own progress" ON partner_reward_progress
  FOR UPDATE TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can view own progress" ON partner_reward_progress;
DROP POLICY IF EXISTS "Partners can view their own progress" ON partner_reward_progress;
CREATE POLICY "Partners can view their own progress" ON partner_reward_progress
  FOR SELECT TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- PARTNER_REWARD_REDEMPTIONS
DROP POLICY IF EXISTS "Admins can manage all redemptions" ON partner_reward_redemptions;
CREATE POLICY "Admins can manage all redemptions" ON partner_reward_redemptions
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Partners can create redemption requests" ON partner_reward_redemptions;
DROP POLICY IF EXISTS "Partners can manage own redemptions" ON partner_reward_redemptions;
DROP POLICY IF EXISTS "Partners can view their own redemptions" ON partner_reward_redemptions;
CREATE POLICY "Partners can manage own redemptions" ON partner_reward_redemptions
  FOR ALL TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- PARTNER_REWARDS
DROP POLICY IF EXISTS "Admins can manage rewards" ON partner_rewards;
CREATE POLICY "Admins can manage rewards" ON partner_rewards
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Partners can view active and upcoming rewards" ON partner_rewards;
CREATE POLICY "Partners can view active and upcoming rewards" ON partner_rewards
  FOR SELECT TO authenticated
  USING (status IN ('active', 'upcoming'));