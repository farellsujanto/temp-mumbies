/*
  # Add Product Variants System

  1. New Tables
    - `product_variants`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `variant_name` (text) - e.g., "Small", "Medium", "Large"
      - `variant_type` (text) - e.g., "size", "color", "flavor"
      - `price` (numeric) - variant-specific price
      - `sku` (text) - variant-specific SKU
      - `image_url` (text, nullable) - variant-specific image
      - `inventory_status` (text)
      - `sort_order` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

  2. Changes
    - Add `has_variants` boolean to products table
    - Add `base_price` to products (lowest variant price when has_variants=true)

  3. Security
    - Enable RLS on `product_variants` table
    - Add policy for public read access to active variants
*/

-- Add columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS has_variants boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS base_price numeric;

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  variant_type text NOT NULL DEFAULT 'size',
  price numeric NOT NULL,
  sku text,
  image_url text,
  inventory_status text DEFAULT 'in_stock',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_active ON product_variants(is_active);

-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active variants
CREATE POLICY "Public can view active variants"
  ON product_variants
  FOR SELECT
  USING (is_active = true);
