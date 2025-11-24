# Quick Start - Fix Everything in 15 Minutes

## What's Wrong
- Database not set up
- Storage not configured
- Can't create ads

## What to Do

### 1. Setup Database (3 minutes)
```
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Go to: SQL Editor → New Query
4. Copy file: SETUP_DATABASE.sql
5. Paste into SQL Editor
6. Click: Run
7. Wait for: ✅ Success
```

### 2. Setup Storage (5 minutes)
```
1. Go to: Storage → Buckets
2. Create bucket: ad-images
3. Toggle: Public bucket ON
4. Go to: Policies tab
5. Add 3 policies:
   - SELECT: (true)
   - INSERT: (auth.role() = 'authenticated')
   - DELETE: (auth.uid()::text = (storage.foldername(name))[1])
```

### 3. Test (5 minutes)
```
1. Hard refresh: Ctrl+Shift+R
2. Go to: http://localhost:3000
3. Log in
4. Click: Create Ad
5. Fill form
6. Click: Publish Ad
7. Should work! ✅
```

---

## That's It!

After these 3 steps, everything should work:
- ✅ Can log in
- ✅ Can navigate
- ✅ Can create ads
- ✅ Can publish ads

---

## Need Help?

See: `FINAL_COMPLETE_FIX.md` for detailed steps
