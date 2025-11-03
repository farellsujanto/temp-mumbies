/*
  # Create Comprehensive Giveaway Test Data
  
  Creates realistic test data including:
  - 4 giveaway bundles (Bronze, Silver, Gold, Platinum)
  - 4 partner giveaways (1 active, 3 completed)
  - Giveaway entries with lead attribution
  - Winner data for completed giveaways
*/

-- Drop and recreate tier constraint to include diamond
ALTER TABLE giveaway_bundles DROP CONSTRAINT IF EXISTS giveaway_bundles_tier_check;
ALTER TABLE giveaway_bundles ADD CONSTRAINT giveaway_bundles_tier_check 
  CHECK (tier = ANY (ARRAY['bronze'::text, 'silver'::text, 'gold'::text, 'platinum'::text, 'diamond'::text]));

-- First, delete old test entries
DELETE FROM giveaway_entries WHERE giveaway_id IN (
  SELECT id FROM partner_giveaways WHERE partner_id = '00000000-0000-0000-0000-000000000099'
);

-- Delete old giveaways
DELETE FROM partner_giveaways WHERE partner_id = '00000000-0000-0000-0000-000000000099';

-- Delete old giveaways that reference old bundles
DELETE FROM partner_giveaways WHERE bundle_id IN (
  SELECT id FROM giveaway_bundles 
  WHERE name IN ('Deluxe Bundle', 'Ultimate Care Package', 'VIP Year Supply', 'Starter Pack', 'Test Bundle - Always Unlocked', 'Premium Bundle - $500 Sales Required')
);

-- Now delete old test bundles
DELETE FROM giveaway_bundles WHERE name IN ('Deluxe Bundle', 'Ultimate Care Package', 'VIP Year Supply', 'Starter Pack', 'Test Bundle - Always Unlocked', 'Premium Bundle - $500 Sales Required');

-- Create realistic giveaway bundles
INSERT INTO giveaway_bundles (
  id,
  name,
  description,
  total_value,
  featured_image_url,
  unlock_requirement_type,
  unlock_requirement_value,
  is_active,
  tier,
  retail_value
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Bronze Starter Bundle',
    'Perfect for getting started! Includes 3 Original Chews, 1 Coconut Rope Ball, and a Mumbies sticker. Great for small to medium dogs.',
    49.95,
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
    'none',
    0,
    true,
    'bronze',
    49.95
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Silver Dog Lover Bundle',
    'A favorite among partners! Includes 5 Original Chews, 2 Root Chews, 2 Rope Toys, and Mumbies merch. Perfect for medium to large dogs.',
    129.95,
    'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=800',
    'mumbies_cash',
    50,
    true,
    'silver',
    129.95
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Gold Premium Bundle',
    'Our most popular bundle! Includes 10 Original Chews, 5 Root Chews, 3 Rope Toys, Bison Liver Treats, and a Mumbies t-shirt. Value packed!',
    249.95,
    'https://images.pexels.com/photos/1346086/pexels-photo-1346086.jpeg?auto=compress&cs=tinysrgb&w=800',
    'mumbies_cash',
    150,
    true,
    'gold',
    249.95
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Platinum Ultimate Bundle',
    'Everything your dog needs! 20 Original Chews, 10 Root Chews, 5 Rope Toys, Bison Liver Treats, Mumbies Welcome Box, and exclusive merch.',
    499.95,
    'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=800',
    'mumbies_cash',
    300,
    true,
    'platinum',
    499.95
  );

-- Give test partner some Mumbies Cash so they can unlock Silver and progress towards Gold
UPDATE nonprofits 
SET mumbies_cash_balance = 75.00 
WHERE id = '00000000-0000-0000-0000-000000000099';

-- Create partner giveaways (1 active, 3 completed)
INSERT INTO partner_giveaways (
  id,
  partner_id,
  bundle_id,
  title,
  description,
  landing_page_slug,
  starts_at,
  ends_at,
  status,
  selection_method,
  total_entries,
  total_leads_generated,
  winner_selected_at,
  winner_entry_id,
  created_at
) VALUES
  -- Active giveaway
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '00000000-0000-0000-0000-000000000099',
    '22222222-2222-2222-2222-222222222222',
    'Win a Silver Dog Lover Bundle from Test Partner Rescue!',
    'Enter to win an amazing bundle of Mumbies products valued at $129.95! Help us support rescue dogs while treating your furry friend.',
    'test-partner-rescue-silver-bundle-2025',
    NOW() - INTERVAL '7 days',
    NOW() + INTERVAL '23 days',
    'active',
    'random',
    47,
    38,
    NULL,
    NULL,
    NOW() - INTERVAL '7 days'
  ),
  -- Completed giveaway 1 (winner selected)
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '00000000-0000-0000-0000-000000000099',
    '11111111-1111-1111-1111-111111111111',
    'Win a Bronze Starter Bundle - Holiday Special!',
    'Celebrate the holidays with a chance to win our Bronze Starter Bundle! Perfect for your pup.',
    'test-partner-rescue-bronze-holiday-2024',
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '30 days',
    'completed',
    'random',
    124,
    98,
    NOW() - INTERVAL '29 days',
    'e0001111-1111-1111-1111-111111111111',
    NOW() - INTERVAL '60 days'
  ),
  -- Completed giveaway 2 (winner selected)
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '00000000-0000-0000-0000-000000000099',
    '11111111-1111-1111-1111-111111111111',
    'Summer Giveaway - Bronze Bundle',
    'Summer fun for your dog! Enter to win treats and toys.',
    'test-partner-rescue-summer-2024',
    NOW() - INTERVAL '120 days',
    NOW() - INTERVAL '90 days',
    'completed',
    'random',
    89,
    71,
    NOW() - INTERVAL '89 days',
    'e0002222-2222-2222-2222-222222222222',
    NOW() - INTERVAL '120 days'
  ),
  -- Completed giveaway 3 (winner selected)
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '00000000-0000-0000-0000-000000000099',
    '22222222-2222-2222-2222-222222222222',
    'Spring Silver Bundle Giveaway',
    'Spring into action! Win our Silver Dog Lover Bundle and spoil your rescue pup.',
    'test-partner-rescue-spring-2024',
    NOW() - INTERVAL '150 days',
    NOW() - INTERVAL '120 days',
    'completed',
    'random',
    156,
    134,
    NOW() - INTERVAL '119 days',
    'e0003333-3333-3333-3333-333333333333',
    NOW() - INTERVAL '150 days'
  );

-- Create test giveaway entries for active giveaway
INSERT INTO giveaway_entries (
  id,
  giveaway_id,
  email,
  first_name,
  last_name,
  phone,
  zip_code,
  attributed_partner_id,
  ip_address,
  is_new_lead,
  lead_status,
  is_test_data,
  created_at
) VALUES
  -- 10 sample entries for the active giveaway
  ('e0000001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sarah.johnson@email.com', 'Sarah', 'Johnson', '555-0101', '53703', '00000000-0000-0000-0000-000000000099', '192.168.1.1', true, 'new', true, NOW() - INTERVAL '6 days'),
  ('e0000002-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mike.williams@email.com', 'Mike', 'Williams', '555-0102', '53704', '00000000-0000-0000-0000-000000000099', '192.168.1.2', true, 'new', true, NOW() - INTERVAL '6 days'),
  ('e0000003-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'emily.davis@email.com', 'Emily', 'Davis', '555-0103', '53705', '00000000-0000-0000-0000-000000000099', '192.168.1.3', true, 'new', true, NOW() - INTERVAL '5 days'),
  ('e0000004-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'james.brown@email.com', 'James', 'Brown', '555-0104', '53706', '00000000-0000-0000-0000-000000000099', '192.168.1.4', true, 'contacted', true, NOW() - INTERVAL '5 days'),
  ('e0000005-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'jessica.miller@email.com', 'Jessica', 'Miller', '555-0105', '53707', '00000000-0000-0000-0000-000000000099', '192.168.1.5', true, 'contacted', true, NOW() - INTERVAL '4 days'),
  ('e0000006-0000-0000-0000-000000000006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'david.wilson@email.com', 'David', 'Wilson', '555-0106', '53708', '00000000-0000-0000-0000-000000000099', '192.168.1.6', true, 'qualified', true, NOW() - INTERVAL '4 days'),
  ('e0000007-0000-0000-0000-000000000007', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ashley.moore@email.com', 'Ashley', 'Moore', '555-0107', '53711', '00000000-0000-0000-0000-000000000099', '192.168.1.7', true, 'qualified', true, NOW() - INTERVAL '3 days'),
  ('e0000008-0000-0000-0000-000000000008', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'chris.taylor@email.com', 'Chris', 'Taylor', '555-0108', '53713', '00000000-0000-0000-0000-000000000099', '192.168.1.8', true, 'converted', true, NOW() - INTERVAL '3 days'),
  ('e0000009-0000-0000-0000-000000000009', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'amanda.anderson@email.com', 'Amanda', 'Anderson', '555-0109', '53715', '00000000-0000-0000-0000-000000000099', '192.168.1.9', true, 'converted', true, NOW() - INTERVAL '2 days'),
  ('e0000010-0000-0000-0000-000000000010', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'matthew.thomas@email.com', 'Matthew', 'Thomas', '555-0110', '53716', '00000000-0000-0000-0000-000000000099', '192.168.1.10', true, 'new', true, NOW() - INTERVAL '1 day');

-- Create winner entries for completed giveaways
INSERT INTO giveaway_entries (
  id,
  giveaway_id,
  email,
  first_name,
  last_name,
  phone,
  zip_code,
  attributed_partner_id,
  is_winner,
  winner_selected,
  winner_notified_at,
  winner_claimed_at,
  delivery_status,
  is_new_lead,
  lead_status,
  is_test_data,
  created_at
) VALUES
  ('e0001111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'winner1@email.com', 'Lucky', 'Winner', '555-9991', '53701', '00000000-0000-0000-0000-000000000099', true, true, NOW() - INTERVAL '29 days', NOW() - INTERVAL '28 days', 'delivered', true, 'converted', true, NOW() - INTERVAL '45 days'),
  ('e0002222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'winner2@email.com', 'Happy', 'Winner', '555-9992', '53702', '00000000-0000-0000-0000-000000000099', true, true, NOW() - INTERVAL '89 days', NOW() - INTERVAL '88 days', 'delivered', true, 'converted', true, NOW() - INTERVAL '100 days'),
  ('e0003333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'winner3@email.com', 'Excited', 'Winner', '555-9993', '53703', '00000000-0000-0000-0000-000000000099', true, true, NOW() - INTERVAL '119 days', NOW() - INTERVAL '118 days', 'delivered', true, 'converted', true, NOW() - INTERVAL '135 days');
