/*
  # Add Subscription Support

  1. Changes to Products Table
    - Add is_subscription_available boolean field
    - Add subscription_discount decimal field (default 10%)
    
  2. New Tables
    - subscriptions: Track customer subscriptions
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - product_id (uuid, references products)
      - variant_id (uuid, nullable, references product_variants)
      - frequency (text: weekly, biweekly, monthly, bimonthly)
      - quantity (integer)
      - price (decimal)
      - status (text: active, paused, cancelled)
      - next_delivery_date (timestamp)
      - created_at, updated_at timestamps
      
  3. Security
    - Enable RLS on subscriptions table
    - Users can view and manage their own subscriptions
*/

-- Add subscription fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_subscription_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_discount decimal(5,2) DEFAULT 10.00;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  frequency text NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'bimonthly')),
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_delivery_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own subscriptions
CREATE POLICY "Users can create own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON subscriptions(next_delivery_date);

-- Update variant products to have subscription enabled
UPDATE products 
SET is_subscription_available = true,
    subscription_discount = 10.00
WHERE has_variants = true 
  AND name IN ('Mumbies Original Chew', 'Natural Paws Hemp Leash', 'Yummies Peanut Butter Biscuits');

-- Also enable subscriptions for food and treat products
UPDATE products
SET is_subscription_available = true,
    subscription_discount = 10.00
WHERE category IN ('food', 'treats')
  AND is_active = true;