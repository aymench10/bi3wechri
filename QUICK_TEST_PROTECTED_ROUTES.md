# Quick Test - Protected Routes

## What to Do Right Now

### Step 1: Hard Refresh
Press **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

### Step 2: Open Console
Press **F12** and go to **Console** tab

### Step 3: Log In
1. Go to http://localhost:3000
2. Click "Sign Up" or "Login"
3. Create account or log in
4. Should see home page

### Step 4: Test Navigation
Try clicking these links:
1. **My Ads** - Should go to `/my-ads`
2. **Favorites** - Should go to `/favorites`
3. **Messages** - Should go to `/messages`
4. **Profile** - Should go to `/profile/{userId}`

### Step 5: Check Console
Look for these messages:
```
✅ GOOD:
ProtectedRoute - user: {...} loading: false
Auth state changed: SIGNED_IN session: user-id-123

❌ BAD:
ProtectedRoute - No user found, redirecting to login
Auth state changed: SIGNED_OUT
```

## Expected Results

### If Working ✅
- Click link → Page loads
- Console shows user object
- No redirect to login
- Can see your data (ads, favorites, etc.)

### If Not Working ❌
- Click link → Redirects to login
- Console shows `user: null`
- See "Auth state changed: SIGNED_OUT"
- Can't access any protected pages

## Quick Fixes

### Fix 1: Hard Refresh
```
Windows: Ctrl+Shift+R
Mac: Cmd+Shift+R
```

### Fix 2: Log Out and Log In
1. Click Logout
2. Log in again
3. Try accessing protected page

### Fix 3: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then run:
npm run dev
```

### Fix 4: Clear Browser Data
1. Press F12
2. Go to Application tab
3. Clear Local Storage
4. Clear Cookies
5. Refresh page

## Report Issues

If it's still not working, tell me:
1. **What you clicked:** (e.g., "My Ads link")
2. **What happened:** (e.g., "Redirected to login")
3. **Console message:** (Copy from F12 console)
4. **Are you logged in?** (Yes/No)

---

**Time to test:** 2 minutes
