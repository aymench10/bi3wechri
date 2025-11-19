# Storage Bucket Setup Guide

## Problem
The "Publishing..." button gets stuck because the `ad-images` storage bucket doesn't exist or is not properly configured in Supabase.

## Solution

### Step 1: Create the Storage Bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Storage** in the left sidebar
4. Click **Create a new bucket**
5. Name it: `ad-images`
6. Make sure **Public bucket** is enabled (toggle ON)
7. Click **Create bucket**

### Step 2: Configure RLS Policies

After creating the bucket, run the SQL from `supabase_migrations/06_setup_storage.sql`:

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy and paste the entire content of `supabase_migrations/06_setup_storage.sql`
4. Click **Run**

This will set up the following policies:
- ✅ Users can upload their own images
- ✅ Users can update their own images
- ✅ Users can delete their own images
- ✅ Everyone can view images

### Step 3: Verify Setup

After running the SQL, verify the policies are created:

1. In Supabase Dashboard, go to **Storage** > **ad-images**
2. Click **Policies** tab
3. You should see 4 policies listed:
   - "Users can upload their own ad images"
   - "Users can update their own ad images"
   - "Users can delete their own ad images"
   - "Anyone can view ad images"

### Step 4: Test the Ad Creation

1. Go to your app at `http://localhost:3000`
2. Log in with your account
3. Click **Create Ad**
4. Fill in all the form fields
5. Upload an image
6. Click **Publish Ad**
7. The ad should now be created successfully!

## Troubleshooting

### Issue: "Failed to upload image" error

**Cause:** The bucket doesn't exist or policies are not set up correctly.

**Solution:**
1. Verify the bucket exists in Storage > Buckets
2. Verify the bucket is public (toggle ON)
3. Run the SQL policies again from Step 2

### Issue: "Failed to create ad" error

**Cause:** The ads table RLS policies might be blocking the insert.

**Solution:**
1. Go to **SQL Editor**
2. Run this query to verify policies:
```sql
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'ads';
```
3. Ensure there's a policy allowing authenticated users to insert ads

### Issue: Images upload but ad doesn't get created

**Cause:** The user_id might not match the profile in the database.

**Solution:**
1. Verify your profile exists in the `profiles` table
2. Check that `auth.uid()` matches your user ID
3. Try logging out and logging back in

## Environment Variables

Make sure your `.env` file has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Files Involved

- `src/pages/CreateAd.jsx` - Form component for creating ads
- `supabase_migrations/06_setup_storage.sql` - Storage bucket policies
- `supabase_migrations/01_initial_setup.sql` - Database schema

## Next Steps

After setup is complete:
1. ✅ Create a test ad with images
2. ✅ Verify it appears in "My Ads" with "Pending" status
3. ✅ Log in as admin and approve the ad
4. ✅ Verify the ad appears on the marketplace

---

**Need help?** Check the browser console (F12) for detailed error messages.
