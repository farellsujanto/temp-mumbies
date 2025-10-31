/*
  # Fix Critical Security and Performance Issues

  ## Summary
  This migration addresses the MOST CRITICAL issues:
  1. ✅ Added missing foreign key indexes (DONE)
  2. Fixes function search paths for security
  3. Optimizes key RLS policies

  Note: Already applied indexes in previous execution.
  This migration focuses on function security and critical RLS optimizations.
*/

-- ============================================================================
-- FIX FUNCTION SECURITY - Set explicit search_path
-- ============================================================================

CREATE OR REPLACE FUNCTION update_giveaway_stats()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE partner_giveaways
    SET
      total_entries = total_entries + 1,
      total_leads_generated = total_leads_generated + CASE WHEN NEW.is_new_lead THEN 1 ELSE 0 END
    WHERE id = NEW.giveaway_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION expire_and_refund_incentives()
RETURNS void
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE partner_incentives
  SET status = 'expired'
  WHERE status = 'active'
  AND expires_at < NOW();

  UPDATE partner_incentives pi
  SET status = 'refunded'
  FROM partner_leads pl
  WHERE pi.lead_id = pl.id
  AND pi.status = 'expired'
  AND pl.status = 'expired';
END;
$$;

CREATE OR REPLACE FUNCTION check_bundle_product_limit()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  bundle_count INTEGER;
BEGIN
  IF NEW.list_type = 'bundle' THEN
    SELECT COUNT(*) INTO bundle_count
    FROM partner_product_lists
    WHERE partner_id = NEW.partner_id
    AND list_type = 'bundle';

    IF bundle_count >= 5 THEN
      RAISE EXCEPTION 'Bundle can only contain 5 products';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION upsert_lead_balance(
  p_user_id UUID,
  p_amount NUMERIC
)
RETURNS void
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO lead_balances (user_id, balance)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET
    balance = lead_balances.balance + p_amount,
    updated_at = NOW();
END;
$$;

-- ============================================================================
-- OPTIMIZE MOST CRITICAL RLS POLICIES
-- ============================================================================

-- Subscriptions (high traffic)
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own subscriptions" ON subscriptions;
CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Product reviews (public-facing)
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON product_reviews;
CREATE POLICY "Authenticated users can create reviews"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own reviews" ON product_reviews;
CREATE POLICY "Users can update own reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own reviews" ON product_reviews;
CREATE POLICY "Users can delete own reviews"
  ON product_reviews FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Lead balances (frequently queried)
DROP POLICY IF EXISTS "Users can view their own balance" ON lead_balances;
CREATE POLICY "Users can view their own balance"
  ON lead_balances FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Partners can view lead balances" ON lead_balances;
CREATE POLICY "Partners can view lead balances"
  ON lead_balances FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partner_leads pl
      JOIN nonprofits n ON n.id = pl.partner_id
      WHERE pl.user_id = lead_balances.user_id
      AND n.auth_user_id = (select auth.uid())
    )
  );
