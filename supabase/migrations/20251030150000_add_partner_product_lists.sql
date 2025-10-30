/*
  # Add Partner Product Lists and Bundles

  ## Summary
  This migration adds functionality for partners to manage:
  - Wishlist items (products they need for their shelter)
  - Recommended products for pet parents
  - Custom new pet parent bundle with 5 products

  ## New Tables
  - `partner_product_lists`: Manages different product list types per partner
    - `id` (uuid, primary key)
    - `partner_id` (uuid, references nonprofits)
    - `product_id` (uuid, references products)
    - `list_type` (text: 'wishlist', 'recommended', 'bundle')
    - `sort_order` (integer)
    - `created_at` (timestamptz)

  - `partner_bundles`: Stores bundle configuration
    - `id` (uuid, primary key)
    - `partner_id` (uuid, references nonprofits, unique)
    - `bundle_name` (text)
    - `bundle_description` (text)
    - `discount_percentage` (numeric, default 20)
    - `is_active` (boolean, default true)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Partners can manage their own lists
  - Public can view active bundles and lists
*/

-- Create partner_product_lists table
CREATE TABLE IF NOT EXISTS partner_product_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  list_type text NOT NULL CHECK (list_type IN ('wishlist', 'recommended', 'bundle')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, product_id, list_type)
);

-- Create partner_bundles table
CREATE TABLE IF NOT EXISTS partner_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE UNIQUE,
  bundle_name text NOT NULL DEFAULT 'New Pet Parent Starter Bundle',
  bundle_description text,
  discount_percentage numeric NOT NULL DEFAULT 20 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_partner_product_lists_partner ON partner_product_lists(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_product_lists_type ON partner_product_lists(partner_id, list_type);
CREATE INDEX IF NOT EXISTS idx_partner_bundles_partner ON partner_bundles(partner_id);

-- Enable RLS
ALTER TABLE partner_product_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_bundles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_product_lists

-- Public can view all product lists
CREATE POLICY "Anyone can view partner product lists"
  ON partner_product_lists FOR SELECT
  TO public
  USING (true);

-- Partners can insert their own product lists
CREATE POLICY "Partners can insert own product lists"
  ON partner_product_lists FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = partner_product_lists.partner_id
      AND nonprofits.user_id = auth.uid()
    )
  );

-- Partners can update their own product lists
CREATE POLICY "Partners can update own product lists"
  ON partner_product_lists FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = partner_product_lists.partner_id
      AND nonprofits.user_id = auth.uid()
    )
  );

-- Partners can delete their own product lists
CREATE POLICY "Partners can delete own product lists"
  ON partner_product_lists FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = partner_product_lists.partner_id
      AND nonprofits.user_id = auth.uid()
    )
  );

-- RLS Policies for partner_bundles

-- Public can view active bundles
CREATE POLICY "Anyone can view partner bundles"
  ON partner_bundles FOR SELECT
  TO public
  USING (true);

-- Partners can insert their own bundle
CREATE POLICY "Partners can insert own bundle"
  ON partner_bundles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = partner_bundles.partner_id
      AND nonprofits.user_id = auth.uid()
    )
  );

-- Partners can update their own bundle
CREATE POLICY "Partners can update own bundle"
  ON partner_bundles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = partner_bundles.partner_id
      AND nonprofits.user_id = auth.uid()
    )
  );

-- Partners can delete their own bundle
CREATE POLICY "Partners can delete own bundle"
  ON partner_bundles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = partner_bundles.partner_id
      AND nonprofits.user_id = auth.uid()
    )
  );

-- Add constraint to bundle list (max 5 products)
CREATE OR REPLACE FUNCTION check_bundle_product_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.list_type = 'bundle' THEN
    IF (SELECT COUNT(*) FROM partner_product_lists
        WHERE partner_id = NEW.partner_id
        AND list_type = 'bundle') >= 5 THEN
      RAISE EXCEPTION 'Bundle can only contain 5 products';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_bundle_limit
  BEFORE INSERT ON partner_product_lists
  FOR EACH ROW
  EXECUTE FUNCTION check_bundle_product_limit();
