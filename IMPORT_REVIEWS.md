# Import Remaining Reviews

## Status
- ✅ Database schema updated (image_urls, reviewer_location fields added)
- ✅ Frontend updated to display review images and locations
- ✅ 10 reviews already imported successfully
- ⏳ 214 reviews ready to import

## Import the Remaining Reviews

The remaining 214 reviews are ready in migration file:
`supabase/migrations/20251030014000_import_remaining_reviews.sql`

### Option 1: Using Supabase Dashboard (Recommended)
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy the contents of `supabase/migrations/20251030014000_import_remaining_reviews.sql`
4. Paste and run the SQL

### Option 2: Using Command Line
```bash
# If you have psql installed and DATABASE_URL configured
psql "$DATABASE_URL" < supabase/migrations/20251030014000_import_remaining_reviews.sql
```

## Verify Import
After importing, verify with:
```sql
SELECT COUNT(*) FROM product_reviews WHERE product_id = (SELECT id FROM products WHERE name = 'Mumbies Original Wood Chew');
```

Should return: 224 total reviews (10 already imported + 214 new)

## Frontend Features
Once imported, the reviews will display with:
- Star ratings
- Review titles and content
- Reviewer names and locations
- Verified purchase badges
- Review images (clickable to view full size)
- Helpful counts
- Review dates
