-- Fix partner_leads RLS policy to use correct column name
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

-- Fix partner_incentives RLS policies
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

-- Verify sample leads exist and add more if needed
DO $$
DECLARE
  nonprofit_record RECORD;
  lead_count INT;
BEGIN
  -- Get Wisconsin Humane Society nonprofit
  SELECT * INTO nonprofit_record
  FROM nonprofits
  WHERE organization_name ILIKE '%wisconsin%humane%'
  LIMIT 1;

  IF nonprofit_record.id IS NOT NULL THEN
    -- Count existing leads
    SELECT COUNT(*) INTO lead_count
    FROM partner_leads
    WHERE partner_id = nonprofit_record.id;

    -- If no leads exist, create sample data
    IF lead_count = 0 THEN
      -- Create 20 sample leads with staggered expiration dates
      FOR i IN 1..20 LOOP
        INSERT INTO partner_leads (
          partner_id,
          email,
          registered_at,
          expires_at,
          status,
          total_spent,
          first_purchase_at
        ) VALUES (
          nonprofit_record.id,
          'lead' || i || '@test.example.com',
          NOW() - (i * 3 || ' days')::INTERVAL,
          NOW() + ((90 - (i * 3)) || ' days')::INTERVAL,
          'active',
          0,
          NULL
        );
      END LOOP;

      -- Add gift balances to first 5 leads
      INSERT INTO lead_balances (lead_id, balance, lifetime_received)
      SELECT id, 10.00, 10.00
      FROM partner_leads
      WHERE partner_id = nonprofit_record.id
      ORDER BY registered_at DESC
      LIMIT 5;

      RAISE NOTICE 'Created 20 sample leads for %', nonprofit_record.organization_name;
    ELSE
      RAISE NOTICE 'Found % existing leads', lead_count;
    END IF;
  ELSE
    RAISE NOTICE 'Wisconsin Humane Society not found';
  END IF;
END $$;