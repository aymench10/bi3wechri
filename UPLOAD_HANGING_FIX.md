# Fix: Upload Hanging on "Upload attempt 1/3"

## Problem
When publishing an ad, the upload gets stuck on "Upload attempt 1/3" and never completes.

## Root Cause
The storage upload is hanging indefinitely. This usually means:
1. Storage bucket RLS policies are blocking the upload
2. Storage bucket is not properly configured
3. Network issue or Supabase service issue

---

## Solution: Check Storage Configuration

### Step 1: Verify Bucket Exists
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Go to: **Storage** → **Buckets**
4. Look for: `ad-images` bucket
5. If it exists ✅ → Go to Step 2
6. If not ❌ → Create it:
   - Click: **Create a new bucket**
   - Name: `ad-images`
   - Toggle: **Public bucket** → **ON**
   - Click: **Create bucket**

### Step 2: Check Bucket is Public
1. Click: **ad-images** bucket
2. Look for: **Public bucket** toggle
3. Should be: **ON** (blue)
4. If OFF ❌ → Click to toggle ON

### Step 3: Verify Policies Exist
1. Click: **ad-images** bucket
2. Go to: **Policies** tab
3. You should see 3 policies:
   - ✅ Allow public read (SELECT)
   - ✅ Allow authenticated upload (INSERT)
   - ✅ Allow user delete own files (DELETE)

4. If any are missing ❌ → Add them:

**For SELECT:**
```sql
(true)
```

**For INSERT:**
```sql
(auth.role() = 'authenticated')
```

**For DELETE:**
```sql
(auth.uid()::text = (storage.foldername(name))[1])
```

### Step 4: Test Upload
1. Hard refresh: **Ctrl+Shift+R**
2. Go to: http://localhost:3000/create-ad
3. Fill form
4. Upload image
5. Click: **Publish Ad**
6. Watch console for messages

---

## Expected Console Output

### ✅ Success:
```
[1/1] Uploading image: user-id/filename.jpg
[1/1] Upload attempt 1/3
[1/1] ✅ Upload successful
[1/1] Public URL: https://...
✅ All images uploaded successfully
Creating ad in database: {...}
✅ Ad created successfully: ad-id
```

### ❌ Timeout Error (after 30 seconds):
```
[1/1] Upload attempt 1/3
[1/1] Upload exception: Upload timeout - took too long
[1/1] Retrying after error...
[1/1] Upload attempt 2/3
[1/1] Upload exception: Upload timeout - took too long
[1/1] Retrying after error...
[1/1] Upload attempt 3/3
[1/1] Upload exception: Upload timeout - took too long
[1/1] ❌ Upload failed after 3 attempts: Upload timeout - took too long
```

---

## If You See Timeout Error

### Possible Causes:
1. **RLS policies blocking upload** - Most common
2. **Bucket not public** - Can't upload to private bucket
3. **Supabase service issue** - Temporary outage
4. **Network issue** - Your internet connection

### How to Fix:

#### Option 1: Check RLS Policies (Most Likely)
1. Go to: Storage → ad-images → Policies
2. Make sure INSERT policy exists
3. Make sure it says: `(auth.role() = 'authenticated')`
4. If wrong, delete and recreate it

#### Option 2: Make Bucket Public
1. Go to: Storage → ad-images
2. Check: **Public bucket** toggle is ON
3. If OFF, click to toggle ON
4. Try uploading again

#### Option 3: Check Supabase Status
1. Go to: https://status.supabase.com
2. Check if there are any outages
3. If yes, wait for service to be restored

#### Option 4: Try Different Image
1. Try with a smaller image (under 1MB)
2. Try with different format (JPG instead of PNG)
3. Try with different image file

---

## Advanced Troubleshooting

### Check Bucket Configuration
1. Go to: Storage → ad-images
2. Verify:
   - ✅ Bucket name is exactly `ad-images`
   - ✅ Public bucket toggle is ON
   - ✅ 3 policies exist (SELECT, INSERT, DELETE)

### Check RLS Policy Details
1. Go to: Storage → ad-images → Policies
2. Click on INSERT policy
3. Verify it shows:
   ```sql
   (auth.role() = 'authenticated')
   ```
4. If different, delete and recreate

### Check Browser Network Tab
1. Press: **F12**
2. Go to: **Network** tab
3. Try uploading again
4. Look for request to `upload` endpoint
5. Check response for error message

---

## Quick Checklist

- [ ] Opened Supabase dashboard
- [ ] Went to Storage → Buckets
- [ ] Found `ad-images` bucket
- [ ] Clicked on bucket
- [ ] Checked "Public bucket" is ON
- [ ] Went to Policies tab
- [ ] Verified 3 policies exist
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tried uploading again
- [ ] Checked console for messages

---

## Status
After these steps, upload should work! If still hanging:
1. Share console error message
2. Share screenshot of policies
3. Check Supabase status page
