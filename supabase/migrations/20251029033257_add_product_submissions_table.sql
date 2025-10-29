/*
  # Add Product Submissions Table

  1. New Tables
    - `product_submissions`
      - `id` (uuid, primary key)
      - `nonprofit_id` (uuid, foreign key to nonprofits)
      - `submitted_by_user_id` (uuid, foreign key to auth.users)
      - `product_url` (text, the URL submitted)
      - `product_name` (text, optional name if provided)
      - `notes` (text, optional notes)
      - `status` (text, default 'pending') - pending, approved, rejected
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `product_submissions` table
    - Add policies for authenticated users to submit and view their own submissions
    - Add policies for nonprofit owners to view their organization's submissions

  3. Indexes
    - Add index on nonprofit_id for faster queries
    - Add index on submitted_by_user_id for user lookups
    - Add index on status for filtering
*/

CREATE TABLE IF NOT EXISTS product_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nonprofit_id uuid NOT NULL REFERENCES nonprofits(id) ON DELETE CASCADE,
  submitted_by_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_url text NOT NULL,
  product_name text,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_submissions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_product_submissions_nonprofit_id 
  ON product_submissions(nonprofit_id);

CREATE INDEX IF NOT EXISTS idx_product_submissions_user_id 
  ON product_submissions(submitted_by_user_id);

CREATE INDEX IF NOT EXISTS idx_product_submissions_status 
  ON product_submissions(status);

-- Nonprofits can view their own submissions
CREATE POLICY "Nonprofits can view own submissions"
  ON product_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = product_submissions.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
  );

-- Nonprofits can insert their own submissions
CREATE POLICY "Nonprofits can submit products"
  ON product_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = product_submissions.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
    AND submitted_by_user_id = (SELECT auth.uid())
  );

-- Nonprofits can update their own submissions
CREATE POLICY "Nonprofits can update own submissions"
  ON product_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = product_submissions.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = product_submissions.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
  );

-- Nonprofits can delete their own submissions
CREATE POLICY "Nonprofits can delete own submissions"
  ON product_submissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nonprofits
      WHERE nonprofits.id = product_submissions.nonprofit_id
      AND nonprofits.auth_user_id = (SELECT auth.uid())
    )
  );
