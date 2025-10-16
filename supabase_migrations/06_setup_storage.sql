-- ============================================
-- SETUP STORAGE BUCKET FOR AD IMAGES
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create storage bucket (if not exists)
-- Note: This might need to be done in Supabase Dashboard > Storage
-- But we can set up the policies here

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own ad images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ad-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Create policy to allow users to update their own images
CREATE POLICY "Users can update their own ad images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ad-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Create policy to allow users to delete their own images
CREATE POLICY "Users can delete their own ad images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ad-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Create policy to allow everyone to view images
CREATE POLICY "Anyone can view ad images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ad-images');

-- 7. Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects'
AND schemaname = 'storage';
