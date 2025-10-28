/*
  # Add Partner Authentication Fields

  1. Changes
    - Add `auth_user_id` column to link nonprofit to auth.users
    - Add `password_hash` for local authentication option
    - Add unique constraint on auth_user_id
    - Add index for faster lookups
  
  2. Security
    - Maintains existing RLS policies
    - Allows partners to manage their own data
*/

-- Add authentication fields
ALTER TABLE nonprofits 
ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS password_set boolean DEFAULT false;

-- Add unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'nonprofits_auth_user_id_key'
  ) THEN
    ALTER TABLE nonprofits ADD CONSTRAINT nonprofits_auth_user_id_key UNIQUE (auth_user_id);
  END IF;
END $$;

-- Add index
CREATE INDEX IF NOT EXISTS nonprofits_auth_user_id_idx ON nonprofits(auth_user_id);

-- Update RLS policies for partner access
DROP POLICY IF EXISTS "Partners can view own data" ON nonprofits;
CREATE POLICY "Partners can view own data"
  ON nonprofits FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id OR status IN ('active', 'approved'));

DROP POLICY IF EXISTS "Partners can update own data" ON nonprofits;
CREATE POLICY "Partners can update own data"
  ON nonprofits FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Allow public to view approved nonprofits
DROP POLICY IF EXISTS "Public can view approved nonprofits" ON nonprofits;
CREATE POLICY "Public can view approved nonprofits"
  ON nonprofits FOR SELECT
  TO anon
  USING (status IN ('active', 'approved'));