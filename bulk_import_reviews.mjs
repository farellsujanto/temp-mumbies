import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Read CSV
const csvContent = readFileSync('./database_exports/review_export_6ebddba0-247f-4ab7-baa1-d363b4476469.csv', 'utf-8');
const records = parse(csvContent, { columns: true, skip_empty_lines: true });

// Get product ID
const { data: product, error: productError } = await supabase
  .from('products')
  .select('id')
  .eq('name', 'Mumbies Original Wood Chew')
  .single();

if (productError || !product) {
  console.error('Product not found!', productError);
  process.exit(1);
}

console.log(`Product ID: ${product.id}`);

// Filter for Mumbies Original Wood Chew published reviews
const mumbiesReviews = records.filter(r =>
  r['Product'] === 'Mumbies Original Wood Chew' && r['Status'] === 'Published'
);

console.log(`Total reviews to import: ${mumbiesReviews.length}`);

// Check how many already exist
const { count } = await supabase
  .from('product_reviews')
  .select('*', { count: 'exact', head: true });

console.log(`Currently ${count} reviews in database`);

// Prepare reviews for insert
const reviewsToInsert = mumbiesReviews.map(r => {
  // Parse image URLs
  let imageUrls = [];
  try {
    const imgStr = r['Image URLs'] || '[]';
    imageUrls = imgStr ? JSON.parse(imgStr) : [];
  } catch (e) {
    imageUrls = [];
  }

  return {
    product_id: product.id,
    rating: parseFloat(r['Rating']) || 5.0,
    title: r['Title'] || '',
    content: r['Content'] || '',
    reviewer_name: r['Reviewer Name'] || '',
    reviewer_location: r['Reviewer Location'] || '',
    verified_purchase: r['Verified Purchase'] === 'Yes',
    is_approved: true,
    helpful_count: parseInt(r['Helpful Count']) || 0,
    created_at: r['Created At'] || new Date().toISOString(),
    image_urls: imageUrls
  };
});

console.log(`Prepared ${reviewsToInsert.length} reviews`);

// Insert in batches of 50
const batchSize = 50;
let successCount = 0;
let errorCount = 0;

for (let i = 0; i < reviewsToInsert.length; i += batchSize) {
  const batch = reviewsToInsert.slice(i, i + batchSize);

  const { data, error } = await supabase
    .from('product_reviews')
    .insert(batch);

  if (error) {
    console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
    errorCount += batch.length;
  } else {
    successCount += batch.length;
    console.log(`Batch ${i / batchSize + 1}: Inserted ${batch.length} reviews (total: ${successCount})`);
  }
}

console.log(`\nImport complete!`);
console.log(`Success: ${successCount}`);
console.log(`Errors: ${errorCount}`);

// Final count
const { count: finalCount } = await supabase
  .from('product_reviews')
  .select('*', { count: 'exact', head: true });

console.log(`Final count: ${finalCount} reviews in database`);
