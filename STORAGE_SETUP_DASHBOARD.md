# Storage Setup via Dashboard (No SQL Needed)

## Problem
SQL approach doesn't work due to permissions. We'll use the Supabase dashboard UI instead.

---

## Step-by-Step Setup

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Click your project (bi3wechri)
3. Go to: **Storage** → **Buckets**

### Step 2: Check Bucket Exists
1. Look for: `ad-images` bucket
2. If it exists ✅ → Go to Step 3
3. If not ❌ → Create it:
   - Click: **Create a new bucket**
   - Name: `ad-images` (exactly)
   - Toggle: **Public bucket** → **ON**
   - Click: **Create bucket**

### Step 3: Go to Policies
1. Click: **ad-images** bucket
2. Go to: **Policies** tab
3. You should see: **New Policy** button

### Step 4: Add SELECT Policy
1. Click: **New Policy**
2. Choose: **For SELECT**
3. Name: `Allow public read`
4. Click: **Review**
5. In the policy editor, paste:
```sql
(true)
```
6. Click: **Save policy**

### Step 5: Add INSERT Policy
1. Click: **New Policy**
2. Choose: **For INSERT**
3. Name: `Allow authenticated upload`
4. Click: **Review**
5. In the policy editor, paste:
```sql
(auth.role() = 'authenticated')
```
6. Click: **Save policy**

### Step 6: Add DELETE Policy
1. Click: **New Policy**
2. Choose: **For DELETE**
3. Name: `Allow user delete own files`
4. Click: **Review**
5. In the policy editor, paste:
```sql
(auth.uid()::text = (storage.foldername(name))[1])
```
6. Click: **Save policy**

### Step 7: Verify All Policies
1. Go to: **ad-images** → **Policies**
2. You should see 3 policies:
   - ✅ Allow public read
   - ✅ Allow authenticated upload
   - ✅ Allow user delete own files

---

## Step 8: Test Upload

1. Hard refresh browser: **Ctrl+Shift+R**
2. Go to: http://localhost:3000/create-ad
3. Fill form
4. Upload image
5. Click: **Publish Ad**
6. Should work now! ✅

---

## If You See Errors

### Error: "Policy already exists"
- Click the existing policy
- Delete it
- Create a new one with the correct settings

### Error: "Permission denied"
- Make sure you're logged in as project owner
- Check bucket is public
- Verify all 3 policies exist

### Error: "Upload timeout"
- Check all 3 policies are added
- Hard refresh browser
- Try again

---

## Quick Checklist

- [ ] Opened Supabase dashboard
- [ ] Went to Storage → Buckets
- [ ] Found ad-images bucket
- [ ] Clicked on ad-images
- [ ] Went to Policies tab
- [ ] Added SELECT policy: `(true)`
- [ ] Added INSERT policy: `(auth.role() = 'authenticated')`
- [ ] Added DELETE policy: `(auth.uid()::text = (storage.foldername(name))[1])`
- [ ] Verified 3 policies exist
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tried creating ad with image
- [ ] Ad published successfully ✅

---

## Status
After adding these 3 policies via dashboard, image uploads should work! 🎉
