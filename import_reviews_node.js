import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importReviews() {
  // Read the SQL file
  const sql = fs.readFileSync('./supabase/migrations/20251030014000_import_remaining_reviews.sql', 'utf8');

  // Extract INSERT statements
  const insertMatches = sql.matchAll(/INSERT INTO product_reviews[^;]+;/gs);
  const inserts = Array.from(insertMatches);

  console.log(`Found ${inserts.length} INSERT statements`);

  // Get the product ID first
  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('name', 'Mumbies Original Wood Chew')
    .single();

  if (!product) {
    console.error('Product not found!');
    return;
  }

  console.log(`Product ID: ${product.id}`);

  // Parse each INSERT and execute
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < inserts.length; i++) {
    const insert = inserts[i][0];

    // Parse VALUES from the INSERT statement
    const valuesMatch = insert.match(/VALUES \((.*)\);/s);
    if (!valuesMatch) continue;

    // This is complex - let's use a simpler approach
    // Extract the key data points using regex
    const ratingMatch = insert.match(/,\s*(\d+\.\d+),\s*'/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 5.0;

    try {
      // For now, let's use the SQL execution approach
      const { error } = await supabase.rpc('exec_sql', { sql_query: insert });

      if (error) {
        console.error(`Error on insert ${i + 1}:`, error.message);
        errorCount++;
      } else {
        successCount++;
        if ((i + 1) % 10 === 0) {
          console.log(`Progress: ${i + 1}/${inserts.length}`);
        }
      }
    } catch (err) {
      console.error(`Exception on insert ${i + 1}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\nImport complete:`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
}

importReviews().catch(console.error);
