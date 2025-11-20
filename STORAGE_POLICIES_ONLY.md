# Storage Bucket Setup - Policies Only

## You Already Have:
✅ Database tables created
✅ Profiles, ads, messages tables exist
✅ RLS policies on tables

## What You Need:
❌ Storage bucket policies for `ad-images`

---

## Setup Storage Policies (5 minutes)

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Click your project (bi3wechri)
3. Go to: **Storage** → **Buckets**

### Step 2: Check Bucket Exists
- Look for: `ad-images` bucket
- If it exists ✅ → Go to Step 3
- If it doesn't exist ❌ → Create it:
  1. Click: **Create a new bucket**
  2. Name: `ad-images`
  3. Toggle: **Public bucket** → **ON**
  4. Click: **Create bucket**

### Step 3: Add Policies to Bucket
1. Click: **ad-images** bucket
2. Go to: **Policies** tab
3. You should see: **New Policy** button

### Step 4: Add SELECT Policy
1. Click: **New Policy** → **For SELECT**
2. Name: `Allow public read`
3. Click: **Review**
4. In the policy editor, paste:
```sql
(true)
```
5. Click: **Save policy**

### Step 5: Add INSERT Policy
1. Click: **New Policy** → **For INSERT**
2. Name: `Allow authenticated upload`
3. Click: **Review**
4. In the policy editor, paste:
```sql
(auth.role() = 'authenticated')
```
5. Click: **Save policy**

### Step 6: Add DELETE Policy
1. Click: **New Policy** → **For DELETE**
2. Name: `Allow user delete own files`
3. Click: **Review**
4. In the policy editor, paste:
```sql
(auth.uid()::text = (storage.foldername(name))[1])
```
5. Click: **Save policy**

### Step 7: Test
1. Hard refresh browser: **Ctrl+Shift+R**
2. Go to: http://localhost:3000/create-ad
3. Fill in form
4. Upload image
5. Click: **Publish Ad**
6. Should work! ✅

---

## Expected Policies

After setup, you should see in **ad-images → Policies**:
```
✅ Allow public read (SELECT)
✅ Allow authenticated upload (INSERT)
✅ Allow user delete own files (DELETE)
```

---

## If You See Errors

### Error: "Policy already exists"
- The policy is already there
- You can ignore this error
- Just make sure all 3 policies exist

### Error: "bucket not found"
- Create the bucket first
- Go to: Storage → Buckets → Create a new bucket
- Name: `ad-images`
- Toggle: Public bucket ON

### Error: "permission denied"
- Check all 3 policies are added
- Hard refresh browser
- Try again

---

## Quick Checklist

- [ ] Opened Supabase dashboard
- [ ] Went to Storage → Buckets
- [ ] Found ad-images bucket (or created it)
- [ ] Clicked on ad-images bucket
- [ ] Went to Policies tab
- [ ] Added SELECT policy
- [ ] Added INSERT policy
- [ ] Added DELETE policy
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tried creating ad
- [ ] Ad published successfully ✅

---

## Status
After adding these 3 policies, your app should work! 🎉
