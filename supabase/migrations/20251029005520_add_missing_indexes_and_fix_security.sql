/*
  # Add Missing Indexes and Fix Security Issues

  ## Changes Made

  1. **Add Missing Foreign Key Indexes**
     - customer_referrals: referrer_user_id
     - nonprofit_curated_products: product_id
     - nonprofits: referred_by_nonprofit_id, referred_by_user_id
     - order_items: product_id
     - orders: attributed_rescue_id
     - referral_leads: converted_user_id, nonprofit_id, referred_by_user_id
     - users: attributed_rescue_id, referred_by_user_id

  2. **Remove Unused Indexes**
     - idx_users_referral_code
     - idx_order_items_order_id
     - nonprofits_auth_user_id_idx
     - idx_referrals_referred
     - idx_referrals_code

  3. **Optimize RLS Policies**
     - Replace auth.uid() with (select auth.uid()) for better performance
     - Update all policies on users, nonprofits, orders, order_items, nonprofit_curated_products, nonprofit_referrals

  4. **Add RLS Policies**
     - customer_referrals: Add policies for authenticated users
     - referral_leads: Add policies for authenticated users

  5. **Fix Function Search Paths**
     - Update all functions to have immutable search_path

  6. **Consolidate Multiple Permissive Policies**
     - Combine duplicate policies where possible
*/

-- Add Missing Indexes
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referrer_user_id ON customer_referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_nonprofit_curated_products_product_id ON nonprofit_curated_products(product_id);
CREATE INDEX IF NOT EXISTS idx_nonprofits_referred_by_nonprofit_id ON nonprofits(referred_by_nonprofit_id);
CREATE INDEX IF NOT EXISTS idx_nonprofits_referred_by_user_id ON nonprofits(referred_by_user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_attributed_rescue_id ON orders(attributed_rescue_id);
CREATE INDEX IF NOT EXISTS idx_referral_leads_converted_user_id ON referral_leads(converted_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_leads_nonprofit_id ON referral_leads(nonprofit_id);
CREATE INDEX IF NOT EXISTS idx_referral_leads_referred_by_user_id ON referral_leads(referred_by_user_id);
CREATE INDEX IF NOT EXISTS idx_users_attributed_rescue_id ON users(attributed_rescue_id);
CREATE INDEX IF NOT EXISTS idx_users_referred_by_user_id ON users(referred_by_user_id);

-- Remove Unused Indexes
DROP INDEX IF EXISTS idx_users_referral_code;
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS nonprofits_auth_user_id_idx;
DROP INDEX IF EXISTS idx_referrals_referred;
DROP INDEX IF EXISTS idx_referrals_code;

-- Optimize RLS Policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Optimize RLS Policies on nonprofits table
DROP POLICY IF EXISTS "Nonprofits can update own data" ON nonprofits;
DROP POLICY IF EXISTS "Partners can view own data" ON nonprofits;
DROP POLICY IF EXISTS "Partners can update own data" ON nonprofits;

CREATE POLICY "Partners can view own data"
  ON nonprofits FOR SELECT
  TO authenticated
  USING (auth_user_id = (select auth.uid()));

CREATE POLICY "Partners can update own data"
  ON nonprofits FOR UPDATE
  TO authenticated
  USING (auth_user_id = (select auth.uid()))
  WITH CHECK (auth_user_id = (select auth.uid()));

-- Optimize RLS Policies on orders table
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Optimize RLS Policies on order_items table
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (select auth.uid())
    )
  );

-- Optimize RLS Policies on nonprofit_curated_products table
DROP POLICY IF EXISTS "Nonprofits can manage own curated products" ON nonprofit_curated_products;
CREATE POLICY "Nonprofits can manage own curated products"
  ON nonprofit_curated_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_curated_products.nonprofit_id
      AND nonprofits.auth_user_id = (select auth.uid())
    )
  );

-- Optimize RLS Policies on nonprofit_referrals table
DROP POLICY IF EXISTS "Nonprofits can view their own referrals" ON nonprofit_referrals;
DROP POLICY IF EXISTS "Nonprofits can view referrals about them" ON nonprofit_referrals;
DROP POLICY IF EXISTS "Nonprofits can create referrals" ON nonprofit_referrals;
DROP POLICY IF EXISTS "Nonprofits can update their referrals" ON nonprofit_referrals;

CREATE POLICY "Nonprofits can view referrals"
  ON nonprofit_referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE (nonprofits.id = nonprofit_referrals.referrer_nonprofit_id
        OR nonprofits.id = nonprofit_referrals.referred_nonprofit_id)
      AND nonprofits.auth_user_id = (select auth.uid())
    )
  );

CREATE POLICY "Nonprofits can create referrals"
  ON nonprofit_referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_referrals.referrer_nonprofit_id
      AND nonprofits.auth_user_id = (select auth.uid())
    )
  );

CREATE POLICY "Nonprofits can update referrals"
  ON nonprofit_referrals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_referrals.referrer_nonprofit_id
      AND nonprofits.auth_user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_referrals.referrer_nonprofit_id
      AND nonprofits.auth_user_id = (select auth.uid())
    )
  );

-- Add RLS Policies for customer_referrals
CREATE POLICY "Users can view own referrals"
  ON customer_referrals FOR SELECT
  TO authenticated
  USING (referrer_user_id = (select auth.uid()));

CREATE POLICY "Users can create referrals"
  ON customer_referrals FOR INSERT
  TO authenticated
  WITH CHECK (referrer_user_id = (select auth.uid()));

-- Add RLS Policies for referral_leads
CREATE POLICY "Users can view referral leads"
  ON referral_leads FOR SELECT
  TO authenticated
  USING (
    referred_by_user_id = (select auth.uid()) OR
    converted_user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = referral_leads.nonprofit_id
      AND nonprofits.auth_user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create referral leads"
  ON referral_leads FOR INSERT
  TO authenticated
  WITH CHECK (referred_by_user_id = (select auth.uid()));

-- Fix Function Search Paths
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM nonprofits WHERE referral_code = code) INTO exists;
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION update_nonprofit_referral_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE nonprofits
    SET
      active_referrals_count = (
        SELECT COUNT(*)
        FROM nonprofit_referrals
        WHERE referrer_nonprofit_id = NEW.referrer_nonprofit_id
        AND status IN ('pending', 'active')
      ),
      qualified_referrals_count = (
        SELECT COUNT(*)
        FROM nonprofit_referrals
        WHERE referrer_nonprofit_id = NEW.referrer_nonprofit_id
        AND status IN ('qualified', 'paid')
      ),
      total_referral_earnings = (
        SELECT COALESCE(SUM(bounty_amount), 0)
        FROM nonprofit_referrals
        WHERE referrer_nonprofit_id = NEW.referrer_nonprofit_id
        AND status IN ('qualified', 'paid')
      )
    WHERE id = NEW.referrer_nonprofit_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE nonprofits
    SET
      active_referrals_count = (
        SELECT COUNT(*)
        FROM nonprofit_referrals
        WHERE referrer_nonprofit_id = OLD.referrer_nonprofit_id
        AND status IN ('pending', 'active')
      ),
      qualified_referrals_count = (
        SELECT COUNT(*)
        FROM nonprofit_referrals
        WHERE referrer_nonprofit_id = OLD.referrer_nonprofit_id
        AND status IN ('qualified', 'paid')
      ),
      total_referral_earnings = (
        SELECT COALESCE(SUM(bounty_amount), 0)
        FROM nonprofit_referrals
        WHERE referrer_nonprofit_id = OLD.referrer_nonprofit_id
        AND status IN ('qualified', 'paid')
      )
    WHERE id = OLD.referrer_nonprofit_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Consolidate Multiple Permissive Policies on nonprofits
DROP POLICY IF EXISTS "Anyone can view active nonprofits" ON nonprofits;
DROP POLICY IF EXISTS "Public can view approved nonprofits" ON nonprofits;

CREATE POLICY "Public can view approved nonprofits"
  ON nonprofits FOR SELECT
  TO anon, authenticated
  USING (status IN ('active', 'approved'));
