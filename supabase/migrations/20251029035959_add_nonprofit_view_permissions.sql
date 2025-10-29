/*
  # Add Nonprofit View Permissions

  1. Changes
    - Add policy for nonprofits to view orders attributed to them
    - Add policy for nonprofits to view basic user info for their attributed customers
    
  2. Security
    - Nonprofits can only see orders where attributed_rescue_id matches their nonprofit ID
    - Nonprofits can only see user emails for users where attributed_rescue_id matches their nonprofit ID
    - All other existing policies remain unchanged
*/

-- Allow nonprofits to view orders attributed to them
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Nonprofits can view attributed orders'
  ) THEN
    CREATE POLICY "Nonprofits can view attributed orders"
      ON orders
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM nonprofits
          WHERE nonprofits.id = orders.attributed_rescue_id
          AND nonprofits.auth_user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Allow nonprofits to view basic user info for their attributed customers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Nonprofits can view attributed user emails'
  ) THEN
    CREATE POLICY "Nonprofits can view attributed user emails"
      ON users
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM nonprofits
          WHERE nonprofits.id = users.attributed_rescue_id
          AND nonprofits.auth_user_id = auth.uid()
        )
      );
  END IF;
END $$;
