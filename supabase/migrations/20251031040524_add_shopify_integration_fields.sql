/*
  # Add Shopify Integration Fields

  1. Changes to `products` table
    - Add `shopify_id` column (text, unique) to track Shopify product IDs
    - Add `stock_quantity` column (integer) to track inventory levels
    - Add index on `shopify_id` for faster lookups

  2. Security
    - No RLS changes needed (existing policies remain)
*/

-- Add shopify_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'shopify_id'
  ) THEN
    ALTER TABLE products ADD COLUMN shopify_id text UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_products_shopify_id ON products(shopify_id);
  END IF;
END $$;

-- Add stock_quantity column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 0;
  END IF;
END $$;

-- Add comment explaining the shopify_id field
COMMENT ON COLUMN products.shopify_id IS 'Shopify product ID for syncing with Shopify store';