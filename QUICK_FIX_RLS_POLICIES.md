# Quick Fix: Set Up RLS Policies for ad-images Bucket

If you're getting permission errors when uploading images, run this SQL in Supabase.

## Steps

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the SQL below
6. Click **Run**

## SQL to Run

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own ad images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own ad images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own ad images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view ad images" ON storage.objects;

-- Create policy to allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own ad images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ad-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to update their own images
CREATE POLICY "Users can update their own ad images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ad-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to delete their own images
CREATE POLICY "Users can delete their own ad images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ad-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow everyone to view images
CREATE POLICY "Anyone can view ad images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ad-images');
```

## Verify Policies Were Created

After running the SQL, verify the policies:

1. Go to **Storage** > **ad-images**
2. Click **Policies** tab
3. You should see 4 policies listed:
   - ✅ Users can upload their own ad images
   - ✅ Users can update their own ad images
   - ✅ Users can delete their own ad images
   - ✅ Anyone can view ad images

## Test Upload

1. Go to http://localhost:3000
2. Log in
3. Click **Create Ad**
4. Fill in all fields
5. Upload an image
6. Click **Publish Ad**
7. Should work now! ✅

## If Still Not Working

Check the browser console (F12) for the specific error and share it.

---

**Time to complete:** 2 minutes
