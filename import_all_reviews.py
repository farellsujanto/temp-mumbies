#!/usr/bin/env python3
import csv
import json

# Map product handles to our database product IDs/names
PRODUCT_MAPPING = {
    'mumbies-wood-chew': 'Mumbies Original Wood Chew',
    'mumbies-variety-pack': 'Mumbies Variety Pack',
    'mumbies-root-chew': 'Mumbies Root Chews',
    'yummies-raw-freeze-dried-bison-liver': 'Yummies Raw Freeze Dried Bison Liver',
    'braided-coconut-rope-with-mumbies-chew': 'Braided Coconut Rope with Mumbies Chew',
    'braided-coconut-rope-with-root-chew': 'Braided Coconut Rope with Root Chew',
}

reviews_by_product = {}

with open('database_exports/review_export_6ebddba0-247f-4ab7-baa1-d363b4476469.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)

    for row in reader:
        handle = row['product_handle']
        if handle not in PRODUCT_MAPPING or row['status'] != 'published':
            continue

        product_name = PRODUCT_MAPPING[handle]
        if product_name not in reviews_by_product:
            reviews_by_product[product_name] = []

        rating = row['rating']
        title = row['review_title'].replace("'", "''")
        content = row['review_content'].replace("'", "''") if row['review_content'] else title
        reviewer_name = row['reviewer_name'].replace("'", "''")
        reviewer_location = row['reviewer_location'].replace("'", "''") if row['reviewer_location'] else ''
        verified = row['verified'] == 'True'
        created_at = row['review_date'].replace('Z', '+00')

        # Parse image URLs
        image_urls = []
        if row['image_urls']:
            image_urls = [url.strip() for url in row['image_urls'].split(',')]

        # Generate helpful count based on rating and review ID
        helpful_count = hash(row['review_id']) % 25 if float(rating) >= 5.0 else hash(row['review_id']) % 15

        reviews_by_product[product_name].append({
            'rating': rating,
            'title': title,
            'content': content,
            'reviewer_name': reviewer_name,
            'reviewer_location': reviewer_location,
            'verified': verified,
            'created_at': created_at,
            'helpful_count': helpful_count,
            'image_urls': image_urls
        })

# Generate SQL
print("/*")
print("  # Import All Product Reviews from CSV Export")
print()
total = sum(len(reviews) for reviews in reviews_by_product.values())
print(f"  Total reviews to import: {total}")
for product_name, reviews in reviews_by_product.items():
    print(f"  - {product_name}: {len(reviews)} reviews")
print("*/")
print()

for product_name, reviews in reviews_by_product.items():
    print(f"-- Import {len(reviews)} reviews for {product_name}")
    print(f"DELETE FROM product_reviews WHERE product_id = (SELECT id FROM products WHERE name = '{product_name}');")
    print()

    if reviews:
        inserts = []
        for review in reviews:
            image_urls_json = json.dumps(review['image_urls']).replace("'", "''")
            inserts.append(f"""  SELECT
    (SELECT id FROM products WHERE name = '{product_name}'),
    {review['rating']},
    '{review['title']}',
    '{review['content']}',
    '{review['reviewer_name']}',
    '{review['reviewer_location']}',
    {str(review['verified']).lower()},
    true,
    {review['helpful_count']},
    TIMESTAMP '{review['created_at']}',
    '{image_urls_json}'::jsonb""")

        print("INSERT INTO product_reviews (product_id, rating, title, content, reviewer_name, reviewer_location, verified_purchase, is_approved, helpful_count, created_at, image_urls)")
        print("\nUNION ALL\n".join(inserts))
        print(f"WHERE EXISTS (SELECT 1 FROM products WHERE name = '{product_name}');")
        print()
        print()
