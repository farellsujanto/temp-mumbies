#!/bin/bash

echo "Starting batch import of reviews..."

# Count reviews to import
TOTAL=$(grep -c "INSERT INTO product_reviews" supabase/migrations/20251029223000_import_all_original_chew_reviews.sql)
echo "Total reviews to import: $TOTAL"

# Extract just the INSERT statements
tail -n +22 supabase/migrations/20251029223000_import_all_original_chew_reviews.sql > /tmp/all_inserts.sql

echo "Reviews extracted and ready to import manually via MCP"
echo "File location: /tmp/all_inserts.sql"
