import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Read seed data
    const seedData = JSON.parse(readFileSync('./seed-products.json', 'utf-8'));

    // Insert brands first
    console.log('📦 Inserting brands...');
    const brandMap = {};

    for (const brand of seedData.brands) {
      const { data, error } = await supabase
        .from('brands')
        .upsert(brand, { onConflict: 'slug' })
        .select('id, slug')
        .single();

      if (error) {
        console.error(`   ❌ Failed to insert brand ${brand.name}:`, error.message);
      } else {
        brandMap[brand.slug] = data.id;
        console.log(`   ✅ ${brand.name}`);
      }
    }

    console.log(`\n✅ Inserted ${Object.keys(brandMap).length} brands\n`);

    // Insert products
    console.log('🐕 Inserting products...');
    let successCount = 0;
    let errorCount = 0;

    for (const product of seedData.products) {
      const { brand_slug, ...productData } = product;
      const brand_id = brandMap[brand_slug];

      if (!brand_id) {
        console.error(`   ❌ Brand not found for slug: ${brand_slug}`);
        errorCount++;
        continue;
      }

      const { error } = await supabase
        .from('products')
        .upsert(
          {
            ...productData,
            brand_id,
          },
          { onConflict: 'sku' }
        );

      if (error) {
        console.error(`   ❌ Failed to insert ${product.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ ${product.name}`);
        successCount++;
      }
    }

    console.log(`\n✅ Successfully inserted ${successCount} products`);
    if (errorCount > 0) {
      console.log(`❌ Failed to insert ${errorCount} products`);
    }

    // Fetch and display summary
    console.log('\n📊 Database Summary:');

    const { count: brandCount } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    console.log(`   🏢 Active Brands: ${brandCount}`);
    console.log(`   📦 Active Products: ${productCount}`);

    console.log('\n✨ Seeding complete! Visit http://localhost:5173/shop to see your products.\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
