/*
  # Create Realistic Giveaway Data for Multiple Partners
  
  Creates giveaways and entries with proper lead data
*/

-- Delete existing giveaways for these partners
DELETE FROM giveaway_entries WHERE giveaway_id IN (
  SELECT id FROM partner_giveaways 
  WHERE partner_id IN (
    SELECT id FROM nonprofits 
    WHERE organization_name IN ('Wisconsin Humane Society', 'Dane County Humane Society', 'Demo Rescue Organization')
  )
);

DELETE FROM partner_giveaways WHERE partner_id IN (
  SELECT id FROM nonprofits 
  WHERE organization_name IN ('Wisconsin Humane Society', 'Dane County Humane Society', 'Demo Rescue Organization')
);

-- Create giveaways
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
  ('10000001-0000-0000-0000-000000000001', '1bdcb477-fcdf-4d8a-a790-5501a3960f57', '22222222-2222-2222-2222-222222222222', 'Win a Silver Dog Lover Bundle - Wisconsin Humane Society', 'Support our mission! Enter to win $129.95 worth of premium Mumbies treats and toys.', 'wisconsin-humane-society-silver-bundle-2025', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 'active', 'random', 89, 76, NULL, NULL, NOW() - INTERVAL '10 days'),
  ('10000002-0000-0000-0000-000000000002', '1bdcb477-fcdf-4d8a-a790-5501a3960f57', '11111111-1111-1111-1111-111111111111', 'Holiday Bundle Giveaway - Wisconsin Humane Society', 'Happy Holidays from WHS! We gave away a Bronze Starter Bundle.', 'wisconsin-humane-society-holiday-2024', NOW() - INTERVAL '90 days', NOW() - INTERVAL '60 days', 'completed', 'random', 156, 142, NOW() - INTERVAL '59 days', '10000002-1111-0000-0000-000000000001', NOW() - INTERVAL '90 days'),
  ('20000001-0000-0000-0000-000000000001', 'fc88ce86-13b7-4d18-a8ec-dce596b38903', '11111111-1111-1111-1111-111111111111', 'Bronze Bundle Giveaway - Dane County Humane Society', 'Help us find homes for rescue dogs! Enter for a chance to win our Bronze Starter Bundle.', 'dane-county-humane-bronze-giveaway-2025', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', 'active', 'random', 67, 58, NULL, NULL, NOW() - INTERVAL '5 days'),
  ('20000002-0000-0000-0000-000000000002', 'fc88ce86-13b7-4d18-a8ec-dce596b38903', '11111111-1111-1111-1111-111111111111', 'Summer Dog Treats Giveaway - Dane County', 'Our summer giveaway was a huge success! Thank you to everyone who entered.', 'dane-county-summer-giveaway-2024', NOW() - INTERVAL '120 days', NOW() - INTERVAL '90 days', 'completed', 'random', 203, 187, NOW() - INTERVAL '89 days', '20000002-2222-0000-0000-000000000001', NOW() - INTERVAL '120 days'),
  ('30000001-0000-0000-0000-000000000001', '621eaa25-5ed9-4b92-acec-6acc5c77e555', '11111111-1111-1111-1111-111111111111', 'Demo Rescue Winter Giveaway', 'Join our community and win premium dog treats! Every entry supports rescue dogs.', 'demo-rescue-winter-giveaway-2025', NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', 'active', 'random', 34, 29, NULL, NULL, NOW() - INTERVAL '3 days');

-- Create sample entries for Wisconsin Active Giveaway
INSERT INTO giveaway_entries (id, giveaway_id, email, first_name, last_name, phone, zip_code, attributed_partner_id, is_new_lead, lead_status, ip_address, created_at)
SELECT gen_random_uuid(), '10000001-0000-0000-0000-000000000001', 'wihs_' || i || '@email.com',
  (ARRAY['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William'])[((i-1) % 10) + 1],
  (ARRAY['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson'])[((i-1) % 10) + 1],
  '555-01' || LPAD(i::text, 2, '0'), '537' || LPAD((i % 20)::text, 2, '0'), '1bdcb477-fcdf-4d8a-a790-5501a3960f57', true,
  CASE WHEN i <= 4 THEN 'converted' WHEN i <= 10 THEN 'qualified' WHEN i <= 16 THEN 'contacted' ELSE 'new' END,
  '192.168.1.' || i, NOW() - INTERVAL '1 day' * (10 - (i::float / 2))
FROM generate_series(1, 20) i;

-- Wisconsin winner
INSERT INTO giveaway_entries (id, giveaway_id, email, first_name, last_name, phone, zip_code, attributed_partner_id, is_new_lead, lead_status, is_winner, winner_selected, winner_notified_at, winner_claimed_at, delivery_status, created_at)
VALUES ('10000002-1111-0000-0000-000000000001', '10000002-0000-0000-0000-000000000002', 'lucky.winner.wihs@email.com', 'Sarah', 'Anderson', '555-9901', '53703', '1bdcb477-fcdf-4d8a-a790-5501a3960f57', true, 'converted', true, true, NOW() - INTERVAL '59 days', NOW() - INTERVAL '58 days', 'delivered', NOW() - INTERVAL '75 days');

-- Dane County Active entries
INSERT INTO giveaway_entries (id, giveaway_id, email, first_name, last_name, phone, zip_code, attributed_partner_id, is_new_lead, lead_status, ip_address, created_at)
SELECT gen_random_uuid(), '20000001-0000-0000-0000-000000000001', 'dchs_' || i || '@email.com',
  (ARRAY['James', 'Mary', 'Michael', 'Patricia', 'Robert', 'Jennifer', 'David', 'Linda', 'Richard', 'Elizabeth'])[((i-1) % 10) + 1],
  (ARRAY['Smith', 'Anderson', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Harris', 'Clark', 'Lewis'])[((i-1) % 10) + 1],
  '608-02' || LPAD(i::text, 2, '0'), '537' || LPAD((i % 20 + 20)::text, 2, '0'), 'fc88ce86-13b7-4d18-a8ec-dce596b38903', true,
  CASE WHEN i <= 3 THEN 'converted' WHEN i <= 8 THEN 'qualified' WHEN i <= 12 THEN 'contacted' ELSE 'new' END,
  '192.169.1.' || i, NOW() - INTERVAL '1 day' * (5 - (i::float / 3))
FROM generate_series(1, 15) i;

-- Dane County winner
INSERT INTO giveaway_entries (id, giveaway_id, email, first_name, last_name, phone, zip_code, attributed_partner_id, is_new_lead, lead_status, is_winner, winner_selected, winner_notified_at, winner_claimed_at, delivery_status, created_at)
VALUES ('20000002-2222-0000-0000-000000000001', '20000002-0000-0000-0000-000000000002', 'happy.pup.dchs@email.com', 'Michael', 'Thompson', '608-9902', '53715', 'fc88ce86-13b7-4d18-a8ec-dce596b38903', true, 'converted', true, true, NOW() - INTERVAL '89 days', NOW() - INTERVAL '88 days', 'delivered', NOW() - INTERVAL '105 days');

-- Demo Rescue Active entries
INSERT INTO giveaway_entries (id, giveaway_id, email, first_name, last_name, phone, zip_code, attributed_partner_id, is_new_lead, lead_status, ip_address, created_at)
SELECT gen_random_uuid(), '30000001-0000-0000-0000-000000000001', 'demo_' || i || '@email.com',
  (ARRAY['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Dakota', 'Skylar'])[((i-1) % 10) + 1],
  (ARRAY['White', 'Young', 'Hall', 'Allen', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams'])[((i-1) % 10) + 1],
  '555-03' || LPAD(i::text, 2, '0'), '535' || LPAD((i % 20)::text, 2, '0'), '621eaa25-5ed9-4b92-acec-6acc5c77e555', true,
  CASE WHEN i <= 2 THEN 'converted' WHEN i <= 5 THEN 'qualified' WHEN i <= 8 THEN 'contacted' ELSE 'new' END,
  '192.170.1.' || i, NOW() - INTERVAL '1 day' * (3 - (i::float / 4))
FROM generate_series(1, 10) i;
