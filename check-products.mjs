import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkProducts() {
  console.log('🔍 Checking Supabase database...\n');

  // Check products
  const { data: products, error: productsError, count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (productsError) {
    console.error('❌ Error fetching products:', productsError.message);
  } else {
    console.log(`✅ Active Products: ${productCount || 0}`);
  }

  // Check brands
  const { data: brands, error: brandsError, count: brandCount } = await supabase
    .from('brands')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (brandsError) {
    console.error('❌ Error fetching brands:', brandsError.message);
  } else {
    console.log(`✅ Active Brands: ${brandCount || 0}`);
  }

  // Check a few sample products
  const { data: sampleProducts, error: sampleError } = await supabase
    .from('products')
    .select('id, name, category, image_url, brand_id')
    .eq('is_active', true)
    .limit(5);

  if (sampleError) {
    console.error('❌ Error fetching sample products:', sampleError.message);
  } else {
    console.log('\n📦 Sample Products:');
    sampleProducts?.forEach(p => {
      console.log(`  - ${p.name} (${p.category})`);
      console.log(`    Image: ${p.image_url ? '✅ Has image' : '❌ No image'}`);
    });
  }

  // Check products by category
  const categories = ['food', 'treats', 'toys', 'accessories'];
  console.log('\n📊 Products by Category:');

  for (const category of categories) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('category', category);

    console.log(`  ${category}: ${count || 0} products`);
  }
}

checkProducts();
