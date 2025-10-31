/*
  # Add Short URLs System for Partner Affiliate Links

  1. New Tables
    - `short_urls`
      - `id` (uuid, primary key)
      - `short_code` (text, unique) - The short code (e.g., "abc123" for mumb.us/abc123)
      - `destination_url` (text) - Full URL with tracking parameters
      - `partner_slug` (text) - Partner who created this link
      - `product_id` (uuid, nullable) - Product being shared
      - `click_count` (integer) - Number of times clicked
      - `last_clicked_at` (timestamptz, nullable) - Last click timestamp
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `short_urls` table
    - Add policies for partners to create and view their own short URLs
    - Add policy for public to use short URLs (read-only for redirect)

  3. Indexes
    - Add unique index on short_code for fast lookups
    - Add index on partner_slug for partner dashboard
*/

-- Create short_urls table
CREATE TABLE IF NOT EXISTS short_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code text UNIQUE NOT NULL,
  destination_url text NOT NULL,
  partner_slug text,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  click_count integer DEFAULT 0,
  last_clicked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_short_urls_partner ON short_urls(partner_slug);
CREATE INDEX IF NOT EXISTS idx_short_urls_product ON short_urls(product_id);

-- Enable RLS
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read short URLs (needed for redirects)
CREATE POLICY "Anyone can read short URLs"
  ON short_urls
  FOR SELECT
  TO public
  USING (true);

-- Policy: Authenticated partners can create short URLs
CREATE POLICY "Partners can create short URLs"
  ON short_urls
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.slug = short_urls.partner_slug
      AND nonprofits.auth_user_id = auth.uid()
      AND nonprofits.status IN ('active', 'approved')
    )
  );

-- Policy: Partners can view their own short URLs
CREATE POLICY "Partners can view own short URLs"
  ON short_urls
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.slug = short_urls.partner_slug
      AND nonprofits.auth_user_id = auth.uid()
    )
  );

-- Policy: System can update click counts (for edge function)
CREATE POLICY "System can update click counts"
  ON short_urls
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
