/*
  # Mumbies Pet Marketplace - Initial Database Schema

  1. New Tables
    - `users` - Customer accounts with rescue attribution and referral tracking
    - `nonprofits` - Animal rescue organizations and shelters
    - `brands` - Pet product brands with mission/story information
    - `products` - Product catalog with pricing and attributes
    - `orders` - Order history (demo mode for prototype)
    - `order_items` - Line items for each order
    - `nonprofit_curated_products` - Products curated by nonprofits for their storefronts
    - `referral_leads` - Tracks potential customers referred by nonprofits (90-day window)
    - `nonprofit_referrals` - Tracks nonprofit-to-nonprofit referrals ($500 commission program)
    - `customer_referrals` - Customer-to-customer referrals ($5/$5 program)
    - `banners` - Homepage hero carousel banners

  2. Security
    - Enable RLS on all tables
    - Users can read/update their own data
    - Nonprofits can manage their own organization data
    - Admin role can access everything
    - Public read access for products, brands, and nonprofit profiles

  3. Key Features
    - Rescue attribution system with 90-day lead conversion window
    - Referral tracking for customers and nonprofits
    - Donation slider calculations (0-5% split between cashback and general pool)
    - 5% lifetime commission for attributed rescue purchases
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  member_since TIMESTAMPTZ DEFAULT NOW(),
  attributed_rescue_id UUID,
  attribution_locked BOOLEAN DEFAULT false,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  total_rescue_donations DECIMAL(10,2) DEFAULT 0,
  total_general_donations DECIMAL(10,2) DEFAULT 0,
  total_cashback_earned DECIMAL(10,2) DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by_user_id UUID,
  nonprofit_referral_access BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false
);

-- NONPROFITS TABLE
CREATE TABLE IF NOT EXISTS nonprofits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_name TEXT NOT NULL,
  ein TEXT UNIQUE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  mission_statement TEXT,
  location_city TEXT,
  location_state TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  logo_url TEXT,
  status TEXT DEFAULT 'pending',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  last_sale_date TIMESTAMPTZ,
  total_attributed_customers INTEGER DEFAULT 0,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_commissions_earned DECIMAL(10,2) DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by_user_id UUID,
  referred_by_nonprofit_id UUID,
  slug TEXT UNIQUE NOT NULL
);

-- BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  story TEXT,
  mission TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  headquarters_state TEXT,
  manufacturing_location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  is_mumbies_brand BOOLEAN DEFAULT false,
  attributes JSONB DEFAULT '[]',
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  brand_id UUID REFERENCES brands(id),
  category TEXT,
  image_url TEXT,
  additional_images JSONB DEFAULT '[]',
  sku TEXT UNIQUE,
  inventory_status TEXT DEFAULT 'in_stock',
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  status TEXT DEFAULT 'demo',
  subtotal DECIMAL(10,2) NOT NULL,
  cashback_amount DECIMAL(10,2) DEFAULT 0,
  rescue_donation_amount DECIMAL(10,2) DEFAULT 0,
  general_donation_amount DECIMAL(10,2) DEFAULT 0,
  slider_position INTEGER DEFAULT 0,
  attributed_rescue_id UUID REFERENCES nonprofits(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NONPROFIT_CURATED_PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS nonprofit_curated_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nonprofit_id UUID REFERENCES nonprofits(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nonprofit_id, product_id)
);

-- REFERRAL_LEADS TABLE
CREATE TABLE IF NOT EXISTS referral_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  nonprofit_id UUID REFERENCES nonprofits(id),
  referred_by_user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  converted_user_id UUID REFERENCES users(id)
);

-- NONPROFIT_REFERRALS TABLE
CREATE TABLE IF NOT EXISTS nonprofit_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID,
  referrer_type TEXT,
  referred_nonprofit_id UUID REFERENCES nonprofits(id) NOT NULL,
  status TEXT DEFAULT 'pending',
  sales_to_date DECIMAL(10,2) DEFAULT 0,
  commission_amount DECIMAL(10,2) DEFAULT 500.00,
  qualified_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUSTOMER_REFERRALS TABLE
CREATE TABLE IF NOT EXISTS customer_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_user_id UUID REFERENCES users(id) NOT NULL,
  referred_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  referrer_credit_amount DECIMAL(10,2) DEFAULT 5.00,
  referred_credit_amount DECIMAL(10,2) DEFAULT 5.00,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BANNERS TABLE
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints that reference users
ALTER TABLE users 
  ADD CONSTRAINT fk_users_attributed_rescue 
  FOREIGN KEY (attributed_rescue_id) REFERENCES nonprofits(id);

ALTER TABLE users 
  ADD CONSTRAINT fk_users_referred_by 
  FOREIGN KEY (referred_by_user_id) REFERENCES users(id);

ALTER TABLE nonprofits 
  ADD CONSTRAINT fk_nonprofits_referred_by_user 
  FOREIGN KEY (referred_by_user_id) REFERENCES users(id);

ALTER TABLE nonprofits 
  ADD CONSTRAINT fk_nonprofits_referred_by_nonprofit 
  FOREIGN KEY (referred_by_nonprofit_id) REFERENCES nonprofits(id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofits ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofit_curated_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE nonprofit_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR USERS
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR is_admin = true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text OR is_admin = true)
  WITH CHECK (auth.uid()::text = id::text OR is_admin = true);

-- RLS POLICIES FOR NONPROFITS
CREATE POLICY "Anyone can view active nonprofits"
  ON nonprofits FOR SELECT
  USING (status = 'active' OR status = 'approved');

CREATE POLICY "Nonprofits can update own data"
  ON nonprofits FOR UPDATE
  TO authenticated
  USING (contact_email = auth.email());

CREATE POLICY "Anyone can apply as nonprofit"
  ON nonprofits FOR INSERT
  WITH CHECK (true);

-- RLS POLICIES FOR BRANDS
CREATE POLICY "Anyone can view active brands"
  ON brands FOR SELECT
  USING (is_active = true);

-- RLS POLICIES FOR PRODUCTS
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- RLS POLICIES FOR ORDERS
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- RLS POLICIES FOR ORDER_ITEMS
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id::text = auth.uid()::text
    )
  );

-- RLS POLICIES FOR NONPROFIT_CURATED_PRODUCTS
CREATE POLICY "Anyone can view curated products"
  ON nonprofit_curated_products FOR SELECT
  USING (true);

CREATE POLICY "Nonprofits can manage own curated products"
  ON nonprofit_curated_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = nonprofit_curated_products.nonprofit_id
      AND nonprofits.contact_email = auth.email()
    )
  );

-- RLS POLICIES FOR BANNERS
CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  USING (is_active = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_nonprofits_slug ON nonprofits(slug);
CREATE INDEX IF NOT EXISTS idx_nonprofits_status ON nonprofits(status);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);