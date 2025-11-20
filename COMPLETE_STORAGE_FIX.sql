-- ============================================
-- COMPLETE STORAGE FIX
-- Copy and paste into Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. ENABLE RLS ON STORAGE OBJECTS
-- ============================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. DROP EXISTING POLICIES
-- ============================================
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow user delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow user update own files" ON storage.objects;

-- ============================================
-- 3. CREATE NEW POLICIES
-- ============================================

-- SELECT: Anyone can read from ad-images bucket
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'ad-images');

-- INSERT: Authenticated users can upload to ad-images
CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'ad-images' AND 
    auth.role() = 'authenticated'
  );

-- DELETE: Users can delete their own files
CREATE POLICY "Allow user delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'ad-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- UPDATE: Users can update their own files
CREATE POLICY "Allow user update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'ad-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 4. VERIFY SETUP
-- ============================================
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check policies
SELECT policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- ✅ DONE!
-- ============================================
-- You should see:
-- - RLS is enabled on storage.objects
-- - 4 policies exist for ad-images bucket
-- - Now try uploading an image
