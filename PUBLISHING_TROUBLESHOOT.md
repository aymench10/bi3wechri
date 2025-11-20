# Publishing Troubleshooting Guide

## Issue: "Publishing..." Button Stuck

When you click "Publish Ad", the button shows "Publishing..." and nothing happens.

---

## Quick Diagnosis

### Step 1: Open Browser Console
1. Press: **F12**
2. Go to: **Console** tab
3. Try creating an ad again
4. Look for error messages

### Step 2: Check Error Message
Look for one of these errors:

```
❌ "bucket not found"
   → Solution: Create ad-images bucket

❌ "permission denied"
   → Solution: Set up RLS policies

❌ "relation \"ads\" does not exist"
   → Solution: Run SETUP_DATABASE.sql

❌ "not authenticated"
   → Solution: Log in again

❌ "Failed to upload image"
   → Solution: Check image size/format
```

---

## Fix by Error Type

### Error 1: "bucket not found"

**What it means:** The `ad-images` storage bucket doesn't exist.

**How to fix:**
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Go to: **Storage** → **Buckets**
4. Click: **Create a new bucket**
5. Name: `ad-images` (exactly)
6. Toggle: **Public bucket** → **ON**
7. Click: **Create bucket**
8. Hard refresh browser: **Ctrl+Shift+R**
9. Try creating ad again

---

### Error 2: "permission denied"

**What it means:** RLS policies aren't set up for the storage bucket.

**How to fix:**
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Go to: **Storage** → **Buckets**
4. Click: **ad-images** bucket
5. Go to: **Policies** tab
6. Click: **New Policy** → **For SELECT**
   - Name: `Allow public read`
   - Paste: `(true)`
   - Click: **Review** → **Save policy**
7. Click: **New Policy** → **For INSERT**
   - Name: `Allow authenticated upload`
   - Paste: `(auth.role() = 'authenticated')`
   - Click: **Review** → **Save policy**
8. Hard refresh: **Ctrl+Shift+R**
9. Try creating ad again

---

### Error 3: "relation \"ads\" does not exist"

**What it means:** Database tables aren't created.

**How to fix:**
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Go to: **SQL Editor**
4. Click: **New Query**
5. Open file: `SETUP_DATABASE.sql` (in your project)
6. Copy entire content
7. Paste into SQL Editor
8. Click: **Run** (or Ctrl+Enter)
9. Wait for: ✅ "Success"
10. Hard refresh: **Ctrl+Shift+R**
11. Try creating ad again

---

### Error 4: "not authenticated"

**What it means:** You're not logged in.

**How to fix:**
1. Go to: http://localhost:3000/login
2. Log in with your account
3. Go to: http://localhost:3000/create-ad
4. Try creating ad again

---

### Error 5: "Failed to upload image"

**What it means:** Image upload failed.

**Possible causes:**
- Image is too large (max 5MB)
- Image format not supported (use JPG, PNG, GIF)
- Storage bucket not public
- RLS policies not set

**How to fix:**
1. Check image size:
   - Right-click image → Properties
   - Size should be under 5MB
   - If larger, compress it
2. Check image format:
   - Should be: JPG, PNG, or GIF
   - Not: BMP, TIFF, WebP, etc.
3. Check bucket is public:
   - Go to: Storage → Buckets
   - Click: ad-images
   - Check: "Public bucket" is ON
4. Check RLS policies:
   - Go to: Storage → ad-images → Policies
   - Should have SELECT, INSERT, DELETE policies
5. Try again with smaller image

---

## Complete Setup Checklist

### Database Setup
```
Step 1: Go to SQL Editor
Step 2: Copy SETUP_DATABASE.sql
Step 3: Paste into SQL Editor
Step 4: Click Run
Step 5: Wait for ✅ Success
```

### Storage Setup
```
Step 1: Go to Storage → Buckets
Step 2: Create bucket named "ad-images"
Step 3: Toggle "Public bucket" ON
Step 4: Go to Policies tab
Step 5: Add SELECT policy
Step 6: Add INSERT policy
Step 7: Add DELETE policy
```

### Testing
```
Step 1: Hard refresh (Ctrl+Shift+R)
Step 2: Go to /create-ad
Step 3: Fill form
Step 4: Upload image
Step 5: Click Publish Ad
Step 6: Check for success
```

---

## Still Not Working?

### Check Supabase Status
1. Go to: https://status.supabase.com
2. Check if there are any outages
3. If yes, wait for service to be restored

### Check Browser Console
1. Press: **F12**
2. Go to: **Console** tab
3. Look for ALL error messages
4. Share them with developer

### Check Supabase Logs
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Go to: **Logs** → **Edge Functions**
4. Look for errors with matching timestamp
5. Share error details with developer

### Verify Database Tables
1. Go to: **SQL Editor**
2. Run this query:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'ads', 'favorites', 'messages', 'notifications');
```
3. Result should show 5 tables
4. If not, run SETUP_DATABASE.sql again

---

## Success Indicators

✅ **Publishing works when:**
- No error messages in console
- Button changes from "Publishing..." to "Publish Ad"
- Success message appears
- Redirected to /my-ads
- Ad appears in My Ads list

---

## Common Issues Summary

| Issue | Cause | Fix |
|-------|-------|-----|
| "bucket not found" | ad-images bucket missing | Create bucket in Storage |
| "permission denied" | RLS policies missing | Add policies to bucket |
| "relation ads does not exist" | Database not set up | Run SETUP_DATABASE.sql |
| "not authenticated" | Not logged in | Log in first |
| "Failed to upload image" | Image too large/wrong format | Use JPG/PNG under 5MB |
| Button stuck on "Publishing..." | Unknown error | Check console for errors |

---

## Need More Help?

1. Check this guide again
2. Check console for error messages
3. Share error messages with developer
4. Include screenshot of error
5. Include browser console output
