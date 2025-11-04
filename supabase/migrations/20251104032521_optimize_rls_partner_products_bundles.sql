/*
  # Optimize RLS - Partner Products and Bundles
*/

-- PARTNER_PRODUCT_LISTS
DROP POLICY IF EXISTS "Partners can delete own product lists" ON partner_product_lists;
CREATE POLICY "Partners can delete own product lists" ON partner_product_lists
  FOR DELETE TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can insert own product lists" ON partner_product_lists;
CREATE POLICY "Partners can insert own product lists" ON partner_product_lists
  FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can update own product lists" ON partner_product_lists;
CREATE POLICY "Partners can update own product lists" ON partner_product_lists
  FOR UPDATE TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- PARTNER_BUNDLES
DROP POLICY IF EXISTS "Partners can delete own bundle" ON partner_bundles;
CREATE POLICY "Partners can delete own bundle" ON partner_bundles
  FOR DELETE TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can insert own bundle" ON partner_bundles;
CREATE POLICY "Partners can insert own bundle" ON partner_bundles
  FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can update own bundle" ON partner_bundles;
CREATE POLICY "Partners can update own bundle" ON partner_bundles
  FOR UPDATE TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));