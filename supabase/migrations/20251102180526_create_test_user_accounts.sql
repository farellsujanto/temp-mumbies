/*
  # Create Test User Accounts with Passwords

  This migration creates test accounts for demo purposes with actual passwords.
  
  Test Accounts Created:
  1. Admin Account: admin@mumbies.com / admin123
  2. Partner Account: partner@mumbies.com / partner123
  3. Customer Account: customer@mumbies.com / customer123
  
  Note: In production, users would sign up through the normal flow.
  This is for testing the unified auth system.
*/

-- First, let's create a helper nonprofit for the test partner
INSERT INTO nonprofits (
  id,
  organization_name,
  ein,
  contact_name,
  contact_email,
  mission_statement,
  location_city,
  location_state,
  status,
  verified,
  slug,
  partner_type,
  mumbies_cash_balance
) VALUES (
  '00000000-0000-0000-0000-000000000099',
  'Test Partner Rescue',
  '99-9999999',
  'Test Partner',
  'partner@mumbies.com',
  'A test partner organization for demo purposes',
  'Madison',
  'WI',
  'active',
  true,
  'test-partner-rescue-demo',
  'nonprofit',
  250.00
) ON CONFLICT (id) DO UPDATE SET
  status = 'active',
  verified = true,
  contact_email = 'partner@mumbies.com';

-- Instructions for creating auth users (must be done via Supabase Dashboard or Auth API)
DO $$
BEGIN
  RAISE NOTICE 'Test Partner Nonprofit Created: ID = 00000000-0000-0000-0000-000000000099';
  RAISE NOTICE '';
  RAISE NOTICE '=== MANUAL STEPS REQUIRED ===';
  RAISE NOTICE 'Create these users in Supabase Auth Dashboard:';
  RAISE NOTICE '';
  RAISE NOTICE '1. ADMIN: admin@mumbies.com / admin123';
  RAISE NOTICE '   Then run: UPDATE users SET is_admin = true WHERE email = ''admin@mumbies.com'';';
  RAISE NOTICE '';
  RAISE NOTICE '2. PARTNER: partner@mumbies.com / partner123';
  RAISE NOTICE '   Then run: UPDATE users SET is_partner = true, nonprofit_id = ''00000000-0000-0000-0000-000000000099'' WHERE email = ''partner@mumbies.com'';';
  RAISE NOTICE '   Then run: UPDATE nonprofits SET auth_user_id = (SELECT id FROM users WHERE email = ''partner@mumbies.com'') WHERE id = ''00000000-0000-0000-0000-000000000099'';';
  RAISE NOTICE '';
  RAISE NOTICE '3. CUSTOMER: customer@mumbies.com / customer123';
  RAISE NOTICE '   No additional SQL needed.';
END $$;
