# Diagnose Storage Bucket Issue

Since you have the `ad-images` bucket created, let's figure out what's preventing uploads.

## Step 1: Check Browser Console for Error Messages

1. Open your app at http://localhost:3000
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Try to create an ad and upload an image
5. Click **Publish Ad**
6. Look for error messages in the console

## Step 2: Common Error Messages and Solutions

### Error: "bucket_id = 'ad-images'"
**Meaning:** The bucket doesn't exist or the name is wrong
**Solution:** Verify bucket name is exactly `ad-images` in Supabase Dashboard

### Error: "permission denied" or "403"
**Meaning:** RLS policies are blocking the upload
**Solution:** 
1. Go to Supabase Dashboard
2. Storage > ad-images > Policies
3. Check if policies exist
4. If not, run SQL from `supabase_migrations/06_setup_storage.sql`

### Error: "Bucket not found"
**Meaning:** The bucket doesn't exist
**Solution:** Create it in Supabase Dashboard > Storage > Create bucket

### Error: "Invalid file type" or "File too large"
**Meaning:** File validation failed
**Solution:** Use PNG/JPG/GIF images under 5MB

### Error: "Failed to create ad: ..."
**Meaning:** Images uploaded but database insert failed
**Solution:** Check RLS policies in `ads` table

## Step 3: Verify Bucket Configuration

In Supabase Dashboard, check:

1. **Storage > Buckets**
   - ✅ Bucket name: `ad-images`
   - ✅ Public: Toggle should be ON
   - ✅ File size limit: At least 5MB

2. **Storage > ad-images > Policies**
   - Should have 4 policies (or at least allow INSERT for authenticated users)

3. **SQL Editor** - Run this to check policies:
```sql
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%ad%';
```

## Step 4: Test Upload Directly

1. Go to Supabase Dashboard
2. Storage > ad-images
3. Click **Upload file**
4. Try uploading a test image manually
5. If this works, the bucket is fine
6. If this fails, the bucket configuration is wrong

## Step 5: Share Console Error

Once you see the error message in the console, share it and I can provide the exact fix.

## Quick Checklist

- [ ] Bucket `ad-images` exists in Supabase
- [ ] Bucket is set to Public (toggle ON)
- [ ] Can upload files manually to the bucket
- [ ] RLS policies are configured (or disabled)
- [ ] User is logged in
- [ ] Images are valid (PNG/JPG/GIF, under 5MB)

## Next Steps

1. Try creating an ad now
2. Check the browser console (F12) for errors
3. Share the exact error message
4. I'll provide the specific fix

---

**Note:** The code now has retry logic and better error messages, so you should see the actual error instead of just "Publishing..." hanging.
