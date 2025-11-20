# Complete Storage Upload Fix

## Issue
Upload times out and never completes. Button shows "Publishing..." forever.

## Root Cause
Storage RLS policies are not properly configured or enabled.

---

## Complete Fix (10 minutes)

### Step 1: Run Complete Storage Fix SQL
1. Go to: https://supabase.com/dashboard
2. Click your project (bi3wechri)
3. Go to: **SQL Editor** → **New Query**
4. Open file: `COMPLETE_STORAGE_FIX.sql`
5. Copy entire content
6. Paste into SQL Editor
7. Click: **Run**
8. Wait for: ✅ **Success**

This will:
- ✅ Enable RLS on storage.objects table
- ✅ Drop old policies
- ✅ Create 4 new policies
- ✅ Verify everything is set up

---

### Step 2: Verify Policies in Dashboard
1. Go to: **Storage** → **ad-images** → **Policies**
2. You should see 4 policies:
   - ✅ Allow public read
   - ✅ Allow authenticated upload
   - ✅ Allow user delete own files
   - ✅ Allow user update own files

3. If you see them ✅ → Go to Step 3
4. If not ❌ → Run the SQL again

---

### Step 3: Test Upload
1. Hard refresh browser: **Ctrl+Shift+R**
2. Go to: http://localhost:3000/create-ad
3. Fill in form:
   - Title: Test Ad
   - Category: Informatique et Multimedia
   - Location: Tunis
   - Description: This is a test ad for testing uploads
   - Price: 100
4. Upload an image (JPG or PNG, under 5MB)
5. Click: **Publish Ad**
6. Watch console (F12) for messages

---

## Expected Results

### ✅ Success (Console shows):
```
Starting ad creation process...
[1/1] Uploading image: user-id/filename.jpg
[1/1] Upload attempt 1/3
[1/1] ✅ Upload successful
[1/1] Public URL: https://...
✅ All images uploaded successfully
Creating ad in database: {...}
✅ Ad created successfully: ad-id
Ad published successfully!
```

### ❌ Still Timing Out (Console shows):
```
[1/1] Upload attempt 1/3
[1/1] Upload exception: Upload timeout - took too long
[1/1] Retrying after error...
[1/1] Upload attempt 2/3
[1/1] Upload exception: Upload timeout - took too long
[1/1] Retrying after error...
[1/1] Upload attempt 3/3
[1/1] Upload exception: Upload timeout - took too long
[1/1] ❌ Upload failed after 3 attempts
```

---

## If Still Timing Out

### Option 1: Check Bucket Configuration
1. Go to: Storage → Buckets
2. Click: **ad-images**
3. Check:
   - ✅ Bucket name is exactly `ad-images`
   - ✅ Public bucket toggle is ON (blue)
   - ✅ Policies tab shows 4 policies

### Option 2: Try Without Images
1. Go to: http://localhost:3000/create-ad
2. Fill form
3. Skip uploading image (if possible)
4. Click: **Publish Ad**
5. If this works, the issue is storage-specific

### Option 3: Check Supabase Status
1. Go to: https://status.supabase.com
2. Check if there are any outages
3. If yes, wait for service to be restored

### Option 4: Try Different Image
1. Try with smaller image (under 1MB)
2. Try with different format (JPG instead of PNG)
3. Try with different image file

---

## Alternative: Disable RLS Temporarily

If nothing works, you can temporarily disable RLS (not recommended for production):

1. Go to: SQL Editor → New Query
2. Paste:
```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```
3. Click: Run
4. Try uploading again
5. If it works, the issue is RLS policies
6. Re-enable RLS and fix policies properly:
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

---

## Troubleshooting Checklist

- [ ] Ran COMPLETE_STORAGE_FIX.sql
- [ ] Saw ✅ Success message
- [ ] Went to Storage → ad-images → Policies
- [ ] Verified 4 policies exist
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tried uploading image
- [ ] Checked console for error messages
- [ ] Tried with different image
- [ ] Checked Supabase status page

---

## Console Error Messages Reference

| Error | Cause | Fix |
|-------|-------|-----|
| Upload timeout | RLS blocking or network | Run COMPLETE_STORAGE_FIX.sql |
| permission denied | RLS policies wrong | Check policies in dashboard |
| bucket not found | Bucket doesn't exist | Create ad-images bucket |
| Invalid file type | Wrong image format | Use JPG/PNG/GIF |
| File too large | Image over 5MB | Use smaller image |

---

## Still Not Working?

1. **Screenshot console errors** and share
2. **Screenshot storage policies** and share
3. **Check Supabase logs** for errors
4. **Try in incognito mode** (clear cache)
5. **Try different browser**

---

## Status
After running COMPLETE_STORAGE_FIX.sql, storage upload should work! 🎉
