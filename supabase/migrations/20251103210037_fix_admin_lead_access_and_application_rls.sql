/*
  # Fix Admin Access to Leads and Partner Applications

  1. Changes
    - Add RLS policy for service role to access all partner_leads
    - Add RLS policy for admin users based on email to access all partner_leads
    - Add INSERT policy for partner_applications (currently missing)
    - Ensure admins can view all partner_applications

  2. Security
    - Service role has full access (for admin portal backend)
    - Admin users identified by email can view all leads
    - Anyone can submit partner applications (INSERT)
    - Admins can view all applications
*/

-- Add service role access to partner_leads
DROP POLICY IF EXISTS "Service role can manage all leads" ON partner_leads;
CREATE POLICY "Service role can manage all leads"
ON partner_leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add admin email-based access to partner_leads for SELECT
DROP POLICY IF EXISTS "Admin users can view all leads" ON partner_leads;
CREATE POLICY "Admin users can view all leads"
ON partner_leads
FOR SELECT
TO authenticated
USING (
  auth.jwt()->>'email' IN ('admin@mumbies.com', 'test@admin.com')
);

-- Allow anyone to submit partner applications
DROP POLICY IF EXISTS "Anyone can submit applications" ON partner_applications;
CREATE POLICY "Anyone can submit applications"
ON partner_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view all applications
DROP POLICY IF EXISTS "Admins can view all applications" ON partner_applications;
CREATE POLICY "Admins can view all applications"
ON partner_applications
FOR SELECT
TO authenticated
USING (
  auth.jwt()->>'email' IN ('admin@mumbies.com', 'test@admin.com')
);

-- Allow service role full access to applications
DROP POLICY IF EXISTS "Service role can manage applications" ON partner_applications;
CREATE POLICY "Service role can manage applications"
ON partner_applications
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
