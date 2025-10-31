import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const mvp = createClient(
  'https://vldnyagcdfirhmgwqhfy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZG55YWdjZGZpcmhtZ3dxaGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzU3NjQsImV4cCI6MjA3MDg1MTc2NH0.7SS6Tf1dOXUkEwSbBnG0chmodGerS7uoZloMGhhkxXA'
);

console.log('Importing data to MVP...\n');

// Check existing brand
const { data: existingBrand } = await mvp.from('brands').select('*').single();
console.log('Existing brand:', existingBrand ? existingBrand.name : 'none');

// Import brands (skip if ID already exists)
const brands = JSON.parse(readFileSync('/tmp/brands.json', 'utf8'));
console.log('Importing', brands.length, 'brands...');

for (const brand of brands) {
  const { data: existing } = await mvp.from('brands').select('id').eq('id', brand.id).maybeSingle();
  
  if (!existing) {
    const { error } = await mvp.from('brands').insert(brand);
    if (error) console.log('Brand error:', brand.name, error.message);
  } else {
    console.log('Skipping existing brand:', brand.name);
  }
}

// Import nonprofits
const nonprofits = JSON.parse(readFileSync('/tmp/nonprofits.json', 'utf8'));
console.log('Importing', nonprofits.length, 'nonprofits...');

for (const nonprofit of nonprofits) {
  const { data: existing } = await mvp.from('nonprofits').select('id').eq('id', nonprofit.id).maybeSingle();
  
  if (!existing) {
    const { error } = await mvp.from('nonprofits').insert(nonprofit);
    if (error) console.log('Nonprofit error:', nonprofit.name, error.message);
  }
}

// Import products
const products = JSON.parse(readFileSync('/tmp/products.json', 'utf8'));
console.log('Importing', products.length, 'products...');

for (const product of products) {
  const { data: existing } = await mvp.from('products').select('id').eq('id', product.id).maybeSingle();
  
  if (!existing) {
    const { error } = await mvp.from('products').insert(product);
    if (error) console.log('Product error:', product.name, error.message);
  }
}

// Import variants
const variants = JSON.parse(readFileSync('/tmp/variants.json', 'utf8'));
console.log('Importing', variants.length, 'variants...');

for (const variant of variants) {
  const { data: existing } = await mvp.from('product_variants').select('id').eq('id', variant.id).maybeSingle();
  
  if (!existing) {
    const { error } = await mvp.from('product_variants').insert(variant);
    if (error) console.log('Variant error:', variant.name, error.message);
  }
}

// Import reviews
const reviews = JSON.parse(readFileSync('/tmp/reviews.json', 'utf8'));
console.log('Importing', reviews.length, 'reviews...');

for (const review of reviews) {
  const { data: existing } = await mvp.from('product_reviews').select('id').eq('id', review.id).maybeSingle();
  
  if (!existing) {
    const { error } = await mvp.from('product_reviews').insert(review);
    if (error) console.log('Review error:', error.message);
  }
}

console.log('\nImport complete!');
