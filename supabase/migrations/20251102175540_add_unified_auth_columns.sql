/*
  # Add Unified Authentication Support

  1. Changes to Users Table
    - Add `is_partner` boolean to identify partner accounts
    - Add `nonprofit_id` to link users to their partner organization
    - Add `full_name` for better user profiles
    
  2. Changes to Nonprofits Table
    - Add `partner_type` to differentiate nonprofit/organization/affiliate (future use)
    
  3. Security
    - Update RLS policies to support partner access
    - Maintain existing security constraints
*/

-- Add unified auth columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_partner BOOLEAN DEFAULT false;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS nonprofit_id UUID REFERENCES nonprofits(id);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add partner type to nonprofits (for future differentiation)
ALTER TABLE nonprofits
ADD COLUMN IF NOT EXISTS partner_type TEXT DEFAULT 'nonprofit'
CHECK (partner_type IN ('nonprofit', 'organization', 'affiliate'));

-- Create index for faster partner lookups
CREATE INDEX IF NOT EXISTS idx_users_is_partner ON users(is_partner) WHERE is_partner = true;
CREATE INDEX IF NOT EXISTS idx_users_nonprofit_id ON users(nonprofit_id) WHERE nonprofit_id IS NOT NULL;

-- Update existing nonprofits to link to their auth users
-- This safely connects existing partner accounts
UPDATE users u
SET is_partner = true,
    nonprofit_id = n.id
FROM nonprofits n
WHERE n.auth_user_id = u.id
  AND u.is_partner = false;

-- Add RLS policy for partners to view their organization
CREATE POLICY "Partners can view their own nonprofit"
  ON nonprofits FOR SELECT
  TO authenticated
  USING (
    auth.uid() = auth_user_id OR
    (SELECT is_admin FROM users WHERE id = auth.uid()) = true
  );

-- Add comment
COMMENT ON COLUMN users.is_partner IS 'True if user has partner access (nonprofit/organization/affiliate)';
COMMENT ON COLUMN users.nonprofit_id IS 'References the partner organization this user belongs to';
COMMENT ON COLUMN nonprofits.partner_type IS 'Type of partner: nonprofit (rescue), organization (business), or affiliate (influencer)';
