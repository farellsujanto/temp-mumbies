/*
  # Optimize RLS - Shopify and Giveaways (Final Batch)
*/

-- SHOPIFY_SETTINGS
DROP POLICY IF EXISTS "Admins manage Shopify settings" ON shopify_settings;
CREATE POLICY "Admins manage Shopify settings" ON shopify_settings
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

-- GIVEAWAY_WINNERS
DROP POLICY IF EXISTS "Admins manage all winners" ON giveaway_winners;
CREATE POLICY "Admins manage all winners" ON giveaway_winners
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

DROP POLICY IF EXISTS "Partners view own giveaway winners" ON giveaway_winners;
CREATE POLICY "Partners view own giveaway winners" ON giveaway_winners
  FOR SELECT TO authenticated
  USING (giveaway_id IN (
    SELECT id FROM partner_giveaways 
    WHERE partner_id IN (
      SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
    )
  ));

-- GIVEAWAY_BUNDLE_PRODUCTS
DROP POLICY IF EXISTS "Admins can manage bundle products" ON giveaway_bundle_products;
CREATE POLICY "Admins can manage bundle products" ON giveaway_bundle_products
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));

-- GIVEAWAY_BUNDLES
DROP POLICY IF EXISTS "Admins can manage giveaway bundles" ON giveaway_bundles;
CREATE POLICY "Admins can manage giveaway bundles" ON giveaway_bundles
  FOR ALL TO authenticated
  USING ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']))
  WITH CHECK ((SELECT auth.jwt()->>'email') = ANY(ARRAY['admin@mumbies.com', 'test@admin.com']));