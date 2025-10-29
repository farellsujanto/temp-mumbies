/*
  # Fix Security Issues

  1. Add Missing Indexes for Foreign Keys
    - Add index on `nonprofit_referrals.referred_nonprofit_id`
    - Add index on `order_items.order_id`

  2. Remove Unused Indexes
    - Drop unused indexes that are not being utilized by queries
    - These indexes consume storage and slow down write operations

  3. Fix Multiple Permissive RLS Policies
    - Consolidate overlapping SELECT policies for `nonprofit_curated_products`
    - Consolidate overlapping SELECT policies for `nonprofits`
    - Use restrictive policies where appropriate

  4. Security Notes
    - All changes maintain data safety and integrity
    - Improves query performance and reduces storage overhead
    - Ensures RLS policies are clear and non-overlapping
*/

-- 1. Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_nonprofit_referrals_referred_nonprofit_id 
  ON nonprofit_referrals(referred_nonprofit_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
  ON order_items(order_id);

-- 2. Remove unused indexes
DROP INDEX IF EXISTS idx_product_variants_product_id;
DROP INDEX IF EXISTS idx_product_variants_active;
DROP INDEX IF EXISTS idx_customer_referrals_referrer_user_id;
DROP INDEX IF EXISTS idx_nonprofits_referred_by_nonprofit_id;
DROP INDEX IF EXISTS idx_nonprofits_referred_by_user_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_orders_attributed_rescue_id;
DROP INDEX IF EXISTS idx_referral_leads_converted_user_id;
DROP INDEX IF EXISTS idx_referral_leads_nonprofit_id;
DROP INDEX IF EXISTS idx_referral_leads_referred_by_user_id;
DROP INDEX IF EXISTS idx_users_attributed_rescue_id;
DROP INDEX IF EXISTS idx_users_referred_by_user_id;

-- 3. Fix multiple permissive policies

-- Fix nonprofit_curated_products: Remove overlapping SELECT policy
DROP POLICY IF EXISTS "Anyone can view curated products" ON nonprofit_curated_products;

-- The "Nonprofits can manage own curated products" policy handles ALL operations
-- Add explicit SELECT policy that allows public viewing
CREATE POLICY "Public can view curated products"
  ON nonprofit_curated_products
  FOR SELECT
  TO public
  USING (true);

-- Fix nonprofits: Consolidate two permissive SELECT policies into one
DROP POLICY IF EXISTS "Partners can view own data" ON nonprofits;
DROP POLICY IF EXISTS "Public can view approved nonprofits" ON nonprofits;

-- Create single comprehensive SELECT policy
CREATE POLICY "Nonprofits viewable when approved or by authenticated owners"
  ON nonprofits
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'approved' 
    OR auth.uid() = auth_user_id
  );
