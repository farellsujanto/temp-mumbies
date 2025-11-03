/*
  # Create Public Assets Storage Bucket
  
  1. Create public-assets bucket for giveaway images
  2. Set proper access policies
  3. Allow uploads for authenticated users
  4. Allow public read access
*/

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload public assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-assets');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update public assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public-assets');

-- Allow everyone to read public assets
CREATE POLICY "Anyone can view public assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public-assets');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete public assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public-assets');
