/*
  # Fix Security and Performance Issues

  This migration addresses multiple security and performance concerns:

  ## 1. Foreign Key Indexes
  Adds missing indexes on foreign key columns to improve query performance:
  - customer_referrals.referrer_user_id
  - nonprofits.referred_by_nonprofit_id
  - nonprofits.referred_by_user_id
  - order_items.product_id
  - orders.attributed_rescue_id
  - product_variants.product_id
  - referral_leads.converted_user_id
  - referral_leads.nonprofit_id
  - referral_leads.referred_by_user_id
  - users.attributed_rescue_id
  - users.referred_by_user_id

  ## 2. RLS Policy Optimization
  Updates the nonprofits RLS policy to use subquery pattern for better performance at scale

  ## 3. Index Cleanup
  Removes unused indexes that provide no performance benefit:
  - idx_brands_is_featured
  - idx_nonprofit_referrals_referred_nonprofit_id
  - idx_order_items_order_id

  ## 4. RLS Policy Consolidation
  Consolidates multiple permissive SELECT policies on nonprofit_curated_products
*/

-- Add missing foreign key indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referrer_user_id 
  ON customer_referrals(referrer_user_id);

CREATE INDEX IF NOT EXISTS idx_nonprofits_referred_by_nonprofit_id 
  ON nonprofits(referred_by_nonprofit_id);

CREATE INDEX IF NOT EXISTS idx_nonprofits_referred_by_user_id 
  ON nonprofits(referred_by_user_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
  ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_orders_attributed_rescue_id 
  ON orders(attributed_rescue_id);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id 
  ON product_variants(product_id);

CREATE INDEX IF NOT EXISTS idx_referral_leads_converted_user_id 
  ON referral_leads(converted_user_id);

CREATE INDEX IF NOT EXISTS idx_referral_leads_nonprofit_id 
  ON referral_leads(nonprofit_id);

CREATE INDEX IF NOT EXISTS idx_referral_leads_referred_by_user_id 
  ON referral_leads(referred_by_user_id);

CREATE INDEX IF NOT EXISTS idx_users_attributed_rescue_id 
  ON users(attributed_rescue_id);

CREATE INDEX IF NOT EXISTS idx_users_referred_by_user_id 
  ON users(referred_by_user_id);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_brands_is_featured;
DROP INDEX IF EXISTS idx_nonprofit_referrals_referred_nonprofit_id;
DROP INDEX IF EXISTS idx_order_items_order_id;

-- Optimize RLS policy for nonprofits to use subquery pattern
DROP POLICY IF EXISTS "Nonprofits viewable when approved or by authenticated owners" ON nonprofits;

CREATE POLICY "Nonprofits viewable when approved or by authenticated owners"
  ON nonprofits
  FOR SELECT
  USING (
    status IN ('active', 'approved') 
    OR auth_user_id = (SELECT auth.uid())
  );

-- Consolidate nonprofit_curated_products SELECT policies
DROP POLICY IF EXISTS "Nonprofits can manage own curated products" ON nonprofit_curated_products;
DROP POLICY IF EXISTS "Public can view curated products" ON nonprofit_curated_products;

-- Create single comprehensive SELECT policy
CREATE POLICY "Anyone can view curated products"
  ON nonprofit_curated_products
  FOR SELECT
  USING (true);

-- Recreate management policies for authenticated users
CREATE POLICY "Nonprofits can insert own curated products"
  ON nonprofit_curated_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_curated_products.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Nonprofits can update own curated products"
  ON nonprofit_curated_products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_curated_products.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_curated_products.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Nonprofits can delete own curated products"
  ON nonprofit_curated_products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_curated_products.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
  );
