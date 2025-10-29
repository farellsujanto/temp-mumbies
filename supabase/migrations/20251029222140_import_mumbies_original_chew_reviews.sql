/*
  # Import Mumbies Original Coffee Wood Chew Reviews
  
  Imports real customer reviews from the review export CSV for the Original Coffee Wood Chew product.
  Reviews include ratings, titles, content, reviewer names, dates, and verified purchase status.
*/

-- First, clear any existing sample reviews for this product
DELETE FROM product_reviews WHERE product_id = (
  SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1
);

-- Import reviews for Mumbies Original Coffee Wood Chew
INSERT INTO product_reviews (product_id, rating, title, content, reviewer_name, verified_purchase, is_approved, helpful_count, created_at)
SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'This product is perfect for a teething Labrador',
  'This product is perfect for a teething Labrador',
  'Anna',
  true,
  true,
  2,
  TIMESTAMP '2025-10-28 19:32:33'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'Puppies love chewing',
  'Our two puppies love to chew on this chew! Keeps them busy and out of trouble.',
  'Mary M.',
  true,
  true,
  5,
  TIMESTAMP '2025-10-23 21:38:59'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'Nice product',
  'Great natural choice!',
  'Betty O.',
  true,
  true,
  8,
  TIMESTAMP '2025-10-12 03:04:34'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'Heavy chewer approved!',
  'Ace loves his! And I love that it''s all natural so I dont have to worry about him enjoying it!',
  'Travis C.',
  true,
  true,
  12,
  TIMESTAMP '2025-10-04 23:37:45'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'My dog LOVES it!',
  'These things are fantastic! I have a big dog who loves sticks and plastic chew toys. Got him an extra large and he absolutely LOVES it! Started chewing the minute he got it and hasn''t stopped! THANK YOU Mumbies!',
  'Lori K.',
  true,
  true,
  18,
  TIMESTAMP '2025-09-22 01:41:48'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'MY DOGS LOVE ''EM!',
  'My dogs love their mumbie chew sticks. This is a great company and they arrived quickly. I will definitely order more!',
  'Janice V.',
  true,
  true,
  14,
  TIMESTAMP '2025-09-17 01:10:19'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'These are great',
  'These are great for my super chewers. It''s nice that they are natural. And will keep my dog from eating the stuff in the yard. I am very happy with my purchase. I would recommend buying these',
  'Penny M.',
  true,
  true,
  9,
  TIMESTAMP '2025-09-16 19:33:35'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  4,
  'Good but watch for splinters',
  'My beagle loves this chew. Although I worry about splinters or shards coming off. But so far not yet.',
  'Kimberly',
  true,
  true,
  4,
  TIMESTAMP '2025-09-12 14:11:51'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'Love them keeps them occupied',
  'My dog loves them',
  'Marcie N.',
  true,
  true,
  6,
  TIMESTAMP '2025-09-04 05:35:19'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'Good Chew For Dogs Who Like Sticks',
  'Ordering process was easy and the order arrived quickly. My dog understood it was a chew toy right away and enjoyed it. I rotate it with other chews like benebones, yak chews, bully sticks, sweet potatos. Make sure you watch your dog as they work towards the middle. The chew seems to splinter more in the middle',
  'Andrew C.',
  true,
  true,
  11,
  TIMESTAMP '2025-09-01 21:07:34'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'Great dog chew!',
  'Excellent wood chew for my medium/large dog! He is quite the chewer and destroys most toys. These chews are fantastic and last about a month. I have them on a subscription so once he''s done with one, a new one is waiting. Highly recommend!',
  'Jamie L.',
  true,
  true,
  20,
  TIMESTAMP '2025-08-19 15:56:39'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'LIFESAVER FOR CHEWING PUPS!',
  'Okay so our doodle puppies were chewing on every tree stick in the yard! We decided to purchase the Mumbies and we did in several different sizes for our puppies (5 months old now) and our daughters 3 yr old Labradoodle. They all LOVE there Mumbies!!! It''s alot better than chewing on yard debris which would make them vomit sometimes. So now they feel like they have a stick to chew on BUT it''s a safe stick and guess what NO VOMITTING!!! It''s nice quiet time for them with very devoted chewing on the Mumbies! Thank You as it was a lifesaver!',
  'Holly W.',
  true,
  true,
  16,
  TIMESTAMP '2025-08-19 01:34:00'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'FINN LOVES HIS MUMBIES!',
  'My boy, Finn, loves his Mumbies! He chews and chews all day. If he eats any, it comes out just fine on the other end. I may need to order more than one at a time. He destroys them.',
  'Trip Werrell',
  true,
  true,
  7,
  TIMESTAMP '2025-08-18 15:23:03'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'SAVING MY DECK!',
  'Perfect for your dog/s that love to chew on wood!! I wish I would''ve known about these sooner before our dogs destroyed our deck lol',
  'Robin S.',
  true,
  true,
  22,
  TIMESTAMP '2025-08-16 10:46:08'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'HOLDS UP TO PUPPY CHEWING!',
  'Quality product. Holds up for serious heavy chewers. 2 Doberman puppies have their work cut out for them. Hopefully stops them from eating sticks.',
  'Arthur',
  true,
  true,
  10,
  TIMESTAMP '2025-08-12 19:43:26'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'Great chews for a super-chewer!',
  'Our super-chewer loves her Mumbies sticks!',
  'JDM',
  true,
  true,
  15,
  TIMESTAMP '2025-08-12 12:21:33'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'BOONE APPROVED!',
  'Boone my 8 month old lab love this chew. We got the XL size and it is the perfect fit for him. Keeps him busy',
  'Jennifer T.',
  true,
  true,
  13,
  TIMESTAMP '2025-08-12 02:26:52'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'German Shepherd Approved!',
  'Ace loves his! Much better quality than competitors and more natural than other chews made from artificial things that end up sharp and hurting his gums.',
  'Travis C.',
  true,
  true,
  11,
  TIMESTAMP '2025-08-12 01:58:10'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'Winnie and Oliver are Mumbies #1 fans!',
  'I saw these chews in an ad and loved the idea of an all natural, organic, softer chewing bone. At first my dogs were like "what is this flavorless bone that I can''t eat?", but taking the chews away after 15 minutes each night made them really intrigued with it. Now, they can''t WAIT to chew them each night! Really great product and will be buying another set soon!',
  'Andrew',
  true,
  true,
  19,
  TIMESTAMP '2025-08-07 01:52:29'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%')

UNION ALL SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Original Coffee Wood Chew%' LIMIT 1),
  5,
  'SUPER CHEWER APPROVED!',
  'My dog is a super chewer and loves these. It usually takes about a week or two before he gets them shredded down to a size where they have to be thrown away. I love that they don''t splinter so I don''t worry about him getting a sliver in his mouth that can get infected. Also it doesn''t come apart into pieces that he can choke on.',
  'Jason M.',
  true,
  true,
  17,
  TIMESTAMP '2025-08-06 15:50:31'
WHERE EXISTS (SELECT 1 FROM products WHERE name ILIKE '%Original Coffee Wood Chew%');
