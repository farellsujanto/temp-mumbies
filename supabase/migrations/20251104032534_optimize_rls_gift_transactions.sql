/*
  # Optimize RLS - Gifts and Transactions
*/

-- GIFT_INCENTIVES
DROP POLICY IF EXISTS "Nonprofits can create gifts" ON gift_incentives;
CREATE POLICY "Nonprofits can create gifts" ON gift_incentives
  FOR INSERT TO authenticated
  WITH CHECK (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Nonprofits can view their own gifts" ON gift_incentives;
CREATE POLICY "Nonprofits can view their own gifts" ON gift_incentives
  FOR SELECT TO authenticated
  USING (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- PARTNER_TRANSACTIONS
DROP POLICY IF EXISTS "System can insert transactions" ON partner_transactions;
CREATE POLICY "System can insert transactions" ON partner_transactions
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Users can view own transactions" ON partner_transactions;
CREATE POLICY "Users can view own transactions" ON partner_transactions
  FOR SELECT TO authenticated
  USING (nonprofit_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- BALANCE_RESERVATIONS (already done in earlier batch, skip)

-- GIFT_CODES  
DROP POLICY IF EXISTS "Admins can view all gift codes" ON gift_codes;
CREATE POLICY "Admins can view all gift codes" ON gift_codes
  FOR SELECT TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Partners can view their gift codes" ON gift_codes;
CREATE POLICY "Partners can view their gift codes" ON gift_codes
  FOR SELECT TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));