/*
  # Optimize RLS - Subscriptions and Orders (Fixed)
*/

-- SUBSCRIPTIONS
DROP POLICY IF EXISTS "Users can create own subscriptions" ON subscriptions;
CREATE POLICY "Users can create own subscriptions" ON subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ORDERS (uses attributed_rescue_id, not nonprofit_id)
DROP POLICY IF EXISTS "Nonprofits can view attributed orders" ON orders;
CREATE POLICY "Nonprofits can view attributed orders" ON orders
  FOR SELECT TO authenticated
  USING (attributed_rescue_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));