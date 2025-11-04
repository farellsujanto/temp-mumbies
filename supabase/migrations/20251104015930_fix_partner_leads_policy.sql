/*
  # Fix Partner Leads RLS Policies

  1. Problem
    - The RLS policies on partner_leads and partner_incentives tables were using `partner_user_id`
    - The nonprofits table actually uses `auth_user_id` to link to auth.users
    - This caused leads and opportunities to not show up in the Partner Portal

  2. Changes
    - Drop and recreate RLS policies on partner_leads table
    - Drop and recreate RLS policies on partner_incentives table
    - Use correct column name `auth_user_id` instead of `partner_user_id`

  3. Security
    - Maintains restrictive RLS policies
    - Partners can only view their own leads and incentives
    - Partners can only create incentives for themselves
*/

-- Fix RLS policy for partner_leads to use correct column name
DROP POLICY IF EXISTS "Partners can view their own leads" ON partner_leads;

CREATE POLICY "Partners can view their own leads"
  ON partner_leads FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = (SELECT auth.uid())
    )
  );

-- Fix RLS policy for partner_incentives to use correct column name
DROP POLICY IF EXISTS "Partners can view their own incentives" ON partner_incentives;

CREATE POLICY "Partners can view their own incentives"
  ON partner_incentives FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can create incentives" ON partner_incentives;

CREATE POLICY "Partners can create incentives"
  ON partner_incentives FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = (SELECT auth.uid())
    )
  );