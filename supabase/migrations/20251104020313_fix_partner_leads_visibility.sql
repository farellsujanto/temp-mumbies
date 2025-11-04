-- Drop the broken policy that uses wrong column name
DROP POLICY IF EXISTS "Partners can view their own leads" ON partner_leads;

-- Create correct policy using auth_user_id (not partner_user_id)
CREATE POLICY "Partners can view their own leads"
  ON partner_leads FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = auth.uid()
    )
  );

-- Also fix the incentives policies
DROP POLICY IF EXISTS "Partners can view their own incentives" ON partner_incentives;

CREATE POLICY "Partners can view their own incentives"
  ON partner_incentives FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Partners can create incentives" ON partner_incentives;

CREATE POLICY "Partners can create incentives"
  ON partner_incentives FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM nonprofits
      WHERE auth_user_id = auth.uid()
    )
  );