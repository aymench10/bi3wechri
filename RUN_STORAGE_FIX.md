# Run Storage RLS Fix - Step by Step

## Problem
Upload is timing out because RLS policies aren't working.

## Solution
Run the SQL fix to set up storage policies correctly.

---

## Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard
2. Click your project (bi3wechri)
3. Go to: **SQL Editor**
4. Click: **New Query**

---

## Step 2: Copy the SQL
Open this file: `FIX_STORAGE_RLS.sql`

Copy the entire content (everything from `--` to the end)

---

## Step 3: Paste into SQL Editor
1. In Supabase SQL Editor, paste the content
2. You should see:
```sql
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
...
CREATE POLICY "Allow public read" ON storage.objects
...
```

---

## Step 4: Run the SQL
1. Click: **Run** button (or press Ctrl+Enter)
2. Wait for completion
3. You should see: ✅ **Success** message

---

## Step 5: Verify Policies
1. Go to: **Storage** → **ad-images** → **Policies**
2. You should see 4 policies:
   - ✅ Allow public read
   - ✅ Allow authenticated upload
   - ✅ Allow user delete own files
   - ✅ Allow user update own files

---

## Step 6: Test Upload
1. Hard refresh browser: **Ctrl+Shift+R**
2. Go to: http://localhost:3000/create-ad
3. Fill form
4. Upload image
5. Click: **Publish Ad**
6. Should work now! ✅

---

## If You See Error

### Error: "policy already exists"
- This is OK, it means the policy is already there
- Just continue to Step 6

### Error: "syntax error"
- Make sure you copied the entire file
- Try again with full content

### Error: "permission denied"
- You might not have admin access
- Try with different Supabase account

---

## Quick Checklist

- [ ] Opened Supabase dashboard
- [ ] Went to SQL Editor
- [ ] Clicked New Query
- [ ] Opened FIX_STORAGE_RLS.sql
- [ ] Copied entire content
- [ ] Pasted into SQL Editor
- [ ] Clicked Run
- [ ] Saw ✅ Success message
- [ ] Went to Storage → ad-images → Policies
- [ ] Verified 4 policies exist
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tried creating ad again
- [ ] Ad published successfully ✅

---

## Status
After running this SQL, storage upload should work!
