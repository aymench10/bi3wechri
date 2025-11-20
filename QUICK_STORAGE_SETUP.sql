-- ============================================
-- QUICK STORAGE RLS POLICIES SETUP
-- Copy and paste into Supabase SQL Editor
-- ============================================

-- Note: You must create the bucket manually first!
-- Go to: Storage → Buckets → Create a new bucket
-- Name: ad-images
-- Toggle: Public bucket = ON

-- Then run these policies:

-- ============================================
-- 1. SELECT POLICY (Allow public read)
-- ============================================
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'ad-images');

-- ============================================
-- 2. INSERT POLICY (Allow authenticated upload)
-- ============================================
CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'ad-images' AND 
    auth.role() = 'authenticated'
  );

-- ============================================
-- 3. DELETE POLICY (Allow user delete own files)
-- ============================================
CREATE POLICY "Allow user delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'ad-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 4. UPDATE POLICY (Allow user update own files)
-- ============================================
CREATE POLICY "Allow user update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'ad-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- ✅ DONE!
-- ============================================
-- Now you can:
-- 1. Create ads with images
-- 2. Upload images to storage
-- 3. Delete your own images
