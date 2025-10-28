# Database Exports & Supabase Storage Guide

## Current Product Data

The `current_products.csv` file in this folder contains all 12 products currently in the database:

### Products by Brand:

**Mumbies (3 products)**
- Grain-Free Salmon Formula - $34.99
- Premium Duck & Sweet Potato Recipe - $32.99
- Hip & Joint Support Chews - $27.99

**Stella & Chewy's (2 products)**
- Freeze-Dried Raw Dinner Patties - Chicken - $44.99
- Freeze-Dried Raw Dinner Patties - Beef - $46.99

**Yummies (3 products)**
- Training Treats - Chicken & Blueberry (Bulk 5lb) - $24.99
- Jerky Strips - Beef (Bulk 2lb) - $29.99
- Dental Chews - Bulk Pack - $19.99

**Natural Paws (4 products)**
- Eco-Friendly Rope Toy - $14.99
- Recycled Canvas Collar - $18.99
- Organic Plush Toy - Bear - $12.99
- Bamboo Food Bowl Set - $34.99

## How to Access Supabase Storage

If you uploaded CSV files to Supabase Storage, here's how to access them:

### Via Supabase Dashboard:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar
4. Browse your buckets to find uploaded files

### Via SQL Query:

```sql
-- List all storage buckets
SELECT * FROM storage.buckets;

-- List files in a specific bucket
SELECT * FROM storage.objects WHERE bucket_id = 'your-bucket-name';
```

### Via Supabase Client (in code):

```typescript
// List files in a bucket
const { data, error } = await supabase
  .storage
  .from('bucket-name')
  .list();

// Download a file
const { data, error } = await supabase
  .storage
  .from('bucket-name')
  .download('file-path.csv');
```

## Importing More Products

If you have additional CSV files with Mumbies products, you can import them using:

### Method 1: SQL INSERT

```sql
INSERT INTO products (name, description, price, brand_id, category, image_url, sku, tags)
VALUES
  ('Product Name', 'Description', 29.99, 'brand-uuid', 'category', 'image-url', 'SKU-123', '["tag1", "tag2"]');
```

### Method 2: Batch Import Script

Create a Node.js script to read CSV and bulk insert:

```javascript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';

const supabase = createClient(url, key);
const products = [];

fs.createReadStream('products.csv')
  .pipe(csv())
  .on('data', (row) => products.push(row))
  .on('end', async () => {
    const { error } = await supabase
      .from('products')
      .insert(products);
  });
```

## Current Database State

### Brands: 4
- Mumbies (house brand)
- Stella & Chewy's
- Yummies (house brand)
- Natural Paws

### Products: 12
- 4 Food products
- 4 Treats
- 2 Toys
- 2 Accessories

### Nonprofits: 1
- Wisconsin Humane Society

### Banners: 5
- Homepage carousel images

## Need to Add More Products?

Let me know if you have:
1. A CSV file with product data to import
2. Specific products you want to add
3. A Shopify export to process

I can help create SQL INSERT statements or import scripts to add them to the database.
