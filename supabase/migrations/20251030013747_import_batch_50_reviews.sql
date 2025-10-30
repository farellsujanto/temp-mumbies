-- Import batch of 50 reviews for Mumbies Original Wood Chew
INSERT INTO product_reviews (product_id, rating, title, content, reviewer_name, reviewer_location, verified_purchase, is_approved, helpful_count, created_at, image_urls)
SELECT (SELECT id FROM products WHERE name = 'Mumbies Original Wood Chew'), 5.0, 'Great bones, you won''t regret the purchase', 'The variety pack was helpful in finding the size that worked best for my 3 dogs that very in size and chew power. They are lasting much longer than any other chew and I can already tell they will be safer as they break down. No spikes the way other bones have.', 'Rebecca Komasincki', '', true, true, 19, TIMESTAMP '2024-09-04T03:02:41.470701+00', '[]'::jsonb
UNION ALL
SELECT (SELECT id FROM products WHERE name = 'Mumbies Original Wood Chew'), 5.0, 'AGGIE APPROVED!', 'Of my three pups Aggie has a thing for chewing any kind of stick she can get ahold of. When I found Mumbies I was very excited because they looked very sturdy (Aggie is 8 months old and going through toys like a fish through water). Unsure of what size to get I just ordered the variety pack (Archie and Stella have seen Aggie chew sticks and have also decided that it might be fun for them, sigh). 
All three dogs have been switching off chewing their sticks but Aggie is in love! I highly recommend them for aggressive stick chewers. I have already shared the info with her littter mates parents!', 'Jen G', '', false, true, 13, TIMESTAMP '2024-08-22T23:06:38.449386+00', '[]'::jsonb
UNION ALL
SELECT (SELECT id FROM products WHERE name = 'Mumbies Original Wood Chew'), 3.0, '', 'really expensive for something that chips so easily. Probably better for my pups but you have to constantly vacuum unless you keep it outside', 'Chelsea', '', true, true, 4, TIMESTAMP '2024-05-14T16:03:48+00', '[]'::jsonb
UNION ALL
SELECT (SELECT id FROM products WHERE name = 'Mumbies Original Wood Chew'), 3.0, '', 'My dogs didn''t like them at all. All 4 just dropped the bones and never touched them again. I took them and donated to a local shelter. I''m sure they will enjoy them!', 'Linda', '', true, true, 9, TIMESTAMP '2024-01-20T20:28:25+00', '[]'::jsonb
UNION ALL
SELECT (SELECT id FROM products WHERE name = 'Mumbies Original Wood Chew'), 5.0, '', 'My dogs love these!', 'Connie', '', true, true, 7, TIMESTAMP '2023-12-08T18:57:40+00', '[]'::jsonb;
