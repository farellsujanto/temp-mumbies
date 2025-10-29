# Review Import Instructions

## Summary
Created migration file with 214 customer reviews for the Original Coffee Wood Chew product.

## Migration File
Location: `supabase/migrations/20251029223100_import_reviews_efficient.sql`

This file contains all 214 reviews in a single efficient INSERT statement using UNION ALL.

## To Apply the Migration

The migration file is ready but needs to be applied to the database. You can:

1. **Via Supabase Dashboard:**
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Copy/paste the contents of the migration file
   - Execute the query

2. **Via Supabase CLI:**
   ```bash
   supabase db push
   ```

## What's Included

- 214 authentic customer reviews
- Ratings (1-5 stars with most being 5 stars)
- Review titles and detailed content
- Reviewer names
- Verified purchase status
- Review dates spanning from 2023 to 2025
- Helpful vote counts

## Features Already Implemented

✅ Product listing page shows star ratings and review counts
✅ Product detail page displays star rating at the top
✅ Full review section with submission form
✅ Sort products by "Highest Rated"
✅ Review statistics are automatically calculated

The application is ready - just need to apply the migration file to see all 214 reviews!
