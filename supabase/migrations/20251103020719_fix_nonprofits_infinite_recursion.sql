/*
  # Fix Infinite Recursion in Nonprofits RLS Policies

  1. Problem
    - The "Partners can view their own nonprofit" policy contains a subquery to users table
    - When users table is queried with partner_profile join, it triggers nonprofits policies
    - This creates infinite recursion

  2. Solution
    - Drop the problematic policy with the subquery
    - Keep only the simple, direct policies that don't cause recursion
    - Allow authenticated users to view nonprofits they're associated with via direct user_id check
*/

-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Partners can view their own nonprofit" ON nonprofits;

-- Create a simpler policy without subqueries
CREATE POLICY "Authenticated users can view nonprofits they own"
  ON nonprofits
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Ensure public can still view active/approved nonprofits (already exists but verify)
DROP POLICY IF EXISTS "Nonprofits viewable when approved or by authenticated owners" ON nonprofits;

CREATE POLICY "Public can view active nonprofits"
  ON nonprofits
  FOR SELECT
  TO public
  USING (status IN ('active', 'approved'));
