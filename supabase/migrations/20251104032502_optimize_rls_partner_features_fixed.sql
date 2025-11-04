/*
  # Optimize RLS - Partner Features (Incentives, Giveaways, Entries) - Fixed
*/

-- PARTNER_INCENTIVES
DROP POLICY IF EXISTS "Partners can create incentives" ON partner_incentives;
CREATE POLICY "Partners can create incentives" ON partner_incentives
  FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners can view their own incentives" ON partner_incentives;
CREATE POLICY "Partners can view their own incentives" ON partner_incentives
  FOR SELECT TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- PARTNER_GIVEAWAYS
DROP POLICY IF EXISTS "Partners create giveaways" ON partner_giveaways;
CREATE POLICY "Partners create giveaways" ON partner_giveaways
  FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners update own giveaways" ON partner_giveaways;
CREATE POLICY "Partners update own giveaways" ON partner_giveaways
  FOR UPDATE TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners view own giveaways" ON partner_giveaways;
CREATE POLICY "Partners view own giveaways" ON partner_giveaways
  FOR SELECT TO authenticated
  USING (partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

-- GIVEAWAY_ENTRIES (uses attributed_partner_id)
DROP POLICY IF EXISTS "Partners update their entries" ON giveaway_entries;
CREATE POLICY "Partners update their entries" ON giveaway_entries
  FOR UPDATE TO authenticated
  USING (attributed_partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (attributed_partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Partners view their entries" ON giveaway_entries;
CREATE POLICY "Partners view their entries" ON giveaway_entries
  FOR SELECT TO authenticated
  USING (attributed_partner_id IN (
    SELECT id FROM nonprofits WHERE auth_user_id = (SELECT auth.uid())
  ));