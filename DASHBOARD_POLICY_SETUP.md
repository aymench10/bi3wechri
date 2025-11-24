# Dashboard Policy Setup - Visual Guide

## The SQL approach doesn't work due to permissions

We need to set up policies using the **Supabase Dashboard UI** instead.

---

## Visual Steps

### Step 1: Open Supabase
```
https://supabase.com/dashboard
↓
Click your project (bi3wechri)
↓
Click: Storage (left menu)
↓
Click: Buckets
```

### Step 2: Find ad-images Bucket
```
Look for: ad-images bucket
If exists ✅ → Click on it
If not ❌ → Create it:
  - Click: Create a new bucket
  - Name: ad-images
  - Toggle: Public bucket ON
  - Click: Create bucket
```

### Step 3: Go to Policies Tab
```
Click: ad-images bucket
↓
Go to: Policies tab
↓
You should see: New Policy button
```

### Step 4: Add First Policy (SELECT)
```
Click: New Policy
↓
Choose: For SELECT
↓
Name: Allow public read
↓
Click: Review
↓
Paste this in editor:
(true)
↓
Click: Save policy
```

### Step 5: Add Second Policy (INSERT)
```
Click: New Policy
↓
Choose: For INSERT
↓
Name: Allow authenticated upload
↓
Click: Review
↓
Paste this in editor:
(auth.role() = 'authenticated')
↓
Click: Save policy
```

### Step 6: Add Third Policy (DELETE)
```
Click: New Policy
↓
Choose: For DELETE
↓
Name: Allow user delete own files
↓
Click: Review
↓
Paste this in editor:
(auth.uid()::text = (storage.foldername(name))[1])
↓
Click: Save policy
```

### Step 7: Verify
```
Go to: ad-images → Policies
↓
You should see 3 policies:
✅ Allow public read
✅ Allow authenticated upload
✅ Allow user delete own files
```

### Step 8: Test
```
Hard refresh: Ctrl+Shift+R
↓
Go to: http://localhost:3000/create-ad
↓
Fill form and upload image
↓
Click: Publish Ad
↓
Should work! ✅
```

---

## Copy-Paste Values

### Policy 1 - SELECT
```
(true)
```

### Policy 2 - INSERT
```
(auth.role() = 'authenticated')
```

### Policy 3 - DELETE
```
(auth.uid()::text = (storage.foldername(name))[1])
```

---

## Expected Result

After adding all 3 policies:
- ✅ Can upload images
- ✅ Can create ads with images
- ✅ Images appear in ads
- ✅ Can delete own images

---

## If Still Not Working

1. Check all 3 policies exist
2. Hard refresh browser
3. Try with different image
4. Check browser console for errors
5. Share error message

---

## Status
Follow these steps and image uploads should work! 🎉
