/*
  # Fix RLS Performance Issues

  1. Performance Optimization
    - Wrap all `auth.*()` calls in subqueries to prevent re-evaluation per row
    - Fixes 35 policies across multiple tables

  2. Tables Updated
    - partner_leads
    - partner_rewards, partner_reward_progress, partner_reward_redemptions
    - giveaway_bundles, giveaway_bundle_products, giveaway_winners
    - short_urls
    - partner_transactions, balance_reservations
    - nonprofit_referral_requests
    - admin_activity_log, admin_notifications, admin_balance_adjustments
    - payout_batches
    - hero_slides
    - platform_settings
    - partner_applications
    - user_status_history
    - gift_codes
    - partner_settings, test_mode_logs, test_scenarios
    - shopify_settings

  3. Security
    - All policies maintain same security logic
    - Only performance optimization applied
*/

-- partner_leads
DROP POLICY IF EXISTS "Admin users can view all leads" ON partner_leads;
CREATE POLICY "Admin users can view all leads"
  ON partner_leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- partner_rewards
DROP POLICY IF EXISTS "Admins can manage rewards" ON partner_rewards;
CREATE POLICY "Admins can manage rewards"
  ON partner_rewards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- partner_reward_progress
DROP POLICY IF EXISTS "Admins can manage all progress" ON partner_reward_progress;
CREATE POLICY "Admins can manage all progress"
  ON partner_reward_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- partner_reward_redemptions
DROP POLICY IF EXISTS "Admins can manage all redemptions" ON partner_reward_redemptions;
CREATE POLICY "Admins can manage all redemptions"
  ON partner_reward_redemptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- giveaway_bundles
DROP POLICY IF EXISTS "Admins can manage giveaway bundles" ON giveaway_bundles;
CREATE POLICY "Admins can manage giveaway bundles"
  ON giveaway_bundles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- short_urls
DROP POLICY IF EXISTS "Partners can create short URLs" ON short_urls;
CREATE POLICY "Partners can create short URLs"
  ON short_urls FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Partners can view own short URLs" ON short_urls;
CREATE POLICY "Partners can view own short URLs"
  ON short_urls FOR SELECT
  TO authenticated
  USING (created_by = (SELECT auth.uid()));

-- partner_transactions
DROP POLICY IF EXISTS "System can insert transactions" ON partner_transactions;
CREATE POLICY "System can insert transactions"
  ON partner_transactions FOR INSERT
  TO authenticated
  WITH CHECK (nonprofit_id IN (
    SELECT nonprofit_id FROM users WHERE id = (SELECT auth.uid())
  ));

-- balance_reservations
DROP POLICY IF EXISTS "System can manage reservations" ON balance_reservations;
CREATE POLICY "System can manage reservations"
  ON balance_reservations FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own reservations" ON balance_reservations;
CREATE POLICY "Users can view own reservations"
  ON balance_reservations FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- nonprofit_referral_requests
DROP POLICY IF EXISTS "Users can create referral requests" ON nonprofit_referral_requests;
CREATE POLICY "Users can create referral requests"
  ON nonprofit_referral_requests FOR INSERT
  TO authenticated
  WITH CHECK (requested_by_user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own referral requests" ON nonprofit_referral_requests;
CREATE POLICY "Users can view own referral requests"
  ON nonprofit_referral_requests FOR SELECT
  TO authenticated
  USING (requested_by_user_id = (SELECT auth.uid()));

-- admin_activity_log
DROP POLICY IF EXISTS "Admins can insert activity log" ON admin_activity_log;
CREATE POLICY "Admins can insert activity log"
  ON admin_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view activity log" ON admin_activity_log;
CREATE POLICY "Admins can view activity log"
  ON admin_activity_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- payout_batches
DROP POLICY IF EXISTS "Admins can manage payout batches" ON payout_batches;
CREATE POLICY "Admins can manage payout batches"
  ON payout_batches FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- hero_slides
DROP POLICY IF EXISTS "Admins can manage slides" ON hero_slides;
CREATE POLICY "Admins can manage slides"
  ON hero_slides FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- platform_settings
DROP POLICY IF EXISTS "Admins can manage settings" ON platform_settings;
CREATE POLICY "Admins can manage settings"
  ON platform_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- admin_notifications
DROP POLICY IF EXISTS "Admins can update their notifications" ON admin_notifications;
CREATE POLICY "Admins can update their notifications"
  ON admin_notifications FOR UPDATE
  TO authenticated
  USING (
    recipient_admin_id = (SELECT auth.uid()) AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view their notifications" ON admin_notifications;
CREATE POLICY "Admins can view their notifications"
  ON admin_notifications FOR SELECT
  TO authenticated
  USING (
    recipient_admin_id = (SELECT auth.uid()) AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "System can create notifications" ON admin_notifications;
CREATE POLICY "System can create notifications"
  ON admin_notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- admin_balance_adjustments
DROP POLICY IF EXISTS "Admins can view balance adjustments" ON admin_balance_adjustments;
CREATE POLICY "Admins can view balance adjustments"
  ON admin_balance_adjustments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- partner_applications
DROP POLICY IF EXISTS "Admins can update applications" ON partner_applications;
CREATE POLICY "Admins can update applications"
  ON partner_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view all applications" ON partner_applications;
CREATE POLICY "Admins can view all applications"
  ON partner_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Applicants can view their own" ON partner_applications;
CREATE POLICY "Applicants can view their own"
  ON partner_applications FOR SELECT
  TO authenticated
  USING (email = (SELECT auth.jwt()->>'email'));

-- user_status_history
DROP POLICY IF EXISTS "Admins can insert status history" ON user_status_history;
CREATE POLICY "Admins can insert status history"
  ON user_status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view status history" ON user_status_history;
CREATE POLICY "Admins can view status history"
  ON user_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- gift_codes
DROP POLICY IF EXISTS "Admins can view all gift codes" ON gift_codes;
CREATE POLICY "Admins can view all gift codes"
  ON gift_codes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- partner_settings
DROP POLICY IF EXISTS "Admins manage test mode" ON partner_settings;
CREATE POLICY "Admins manage test mode"
  ON partner_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- test_mode_logs
DROP POLICY IF EXISTS "Admins view all test logs" ON test_mode_logs;
CREATE POLICY "Admins view all test logs"
  ON test_mode_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- test_scenarios
DROP POLICY IF EXISTS "Admins manage scenarios" ON test_scenarios;
CREATE POLICY "Admins manage scenarios"
  ON test_scenarios FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- shopify_settings
DROP POLICY IF EXISTS "Admins manage Shopify settings" ON shopify_settings;
CREATE POLICY "Admins manage Shopify settings"
  ON shopify_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- giveaway_winners
DROP POLICY IF EXISTS "Admins manage all winners" ON giveaway_winners;
CREATE POLICY "Admins manage all winners"
  ON giveaway_winners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );

-- giveaway_bundle_products
DROP POLICY IF EXISTS "Admins can manage bundle products" ON giveaway_bundle_products;
CREATE POLICY "Admins can manage bundle products"
  ON giveaway_bundle_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.role = 'admin'
    )
  );
