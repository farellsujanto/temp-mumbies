/*
  # Fix partner_leads INSERT policy
  
  1. Problem
    - No INSERT policy exists for partner_leads table
    - Lead registration form fails silently when trying to create leads
    - Auth signup succeeds but lead record never gets created
  
  2. Solution
    - Add INSERT policy to allow authenticated users to create leads
    - This allows the lead registration page to create leads after user signup
  
  3. Security
    - Policy requires authentication (user must be signed up)
    - Only allows inserting leads with valid partner_id (references nonprofits)
*/

-- Allow authenticated users to insert leads (for lead registration page)
CREATE POLICY "Allow authenticated users to create leads"
  ON partner_leads FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (SELECT id FROM nonprofits WHERE status IN ('active', 'approved'))
  );
