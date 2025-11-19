# Fix Protected Routes - Complete Guide

## Problem
Logged-in users cannot access Messages, Profile, My Ads, or Favorites pages. They get redirected to login.

## Debugging Steps

### Step 1: Check Browser Console
1. Open http://localhost:3000
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Log in to your account
5. Click on "My Ads" or "Messages"
6. Look for console messages like:
   - `ProtectedRoute - user: {...} loading: false` ✅ (Good)
   - `ProtectedRoute - No user found, redirecting to login` ❌ (Bad)

### Step 2: Verify Session Token
In the browser console, run:
```javascript
// Check if session token exists
const token = localStorage.getItem('sb-auth-token')
console.log('Session token:', token ? 'EXISTS' : 'MISSING')

// Check Supabase session
const { data: { session } } = await supabase.auth.getSession()
console.log('Current session:', session)
```

### Step 3: Test Direct Navigation
Try navigating directly to:
- http://localhost:3000/my-ads
- http://localhost:3000/messages
- http://localhost:3000/favorites

**Expected:**
- If logged in: Should show the page
- If not logged in: Should redirect to login

### Step 4: Check Network Requests
1. Open **Network** tab in F12
2. Click "My Ads"
3. Look for failed requests (red status)
4. Check response status codes

## Common Issues & Fixes

### Issue 1: Session Lost After Login
**Symptom:** Can log in, but session disappears when navigating

**Causes:**
- Supabase session not persisting
- AuthContext not properly initialized
- Browser cookies disabled

**Fix:**
1. Check browser settings - allow cookies
2. Hard refresh: Ctrl+Shift+R
3. Log out and log in again
4. Check browser console for errors

### Issue 2: User Object is Null
**Symptom:** Console shows `user: null` even when logged in

**Causes:**
- Session not loaded yet
- Supabase connection issue
- Profile fetch failing

**Fix:**
1. Wait for loading to complete (3 seconds max)
2. Check Supabase connection in `.env`
3. Verify user exists in Supabase auth
4. Check profiles table for user record

### Issue 3: Loading Never Completes
**Symptom:** Shows loading spinner forever

**Causes:**
- Profile fetch hanging
- Network issue
- Supabase timeout

**Fix:**
1. Hard refresh the page
2. Check network tab for hanging requests
3. Restart dev server: `npm run dev`
4. Check Supabase status

### Issue 4: Redirects to Login Immediately
**Symptom:** Clicks link, briefly shows page, then redirects to login

**Causes:**
- User object cleared unexpectedly
- Session expired
- Auth state change event firing

**Fix:**
1. Check console for "Auth state changed" messages
2. Verify session token hasn't expired
3. Check for errors in profile fetch
4. Look for auth state change events

## Enhanced Debugging

### Add Logging to Components
The following components now have debug logging:
- `ProtectedRoute.jsx` - Logs user state and redirects
- `AuthContext.jsx` - Logs auth state changes

**Console output to look for:**
```
ProtectedRoute - user: {...} loading: false
Auth state changed: INITIAL_SESSION session: user-id-123
```

### Check Auth Flow
1. **Initial load:** Should see `Auth state changed: INITIAL_SESSION`
2. **After login:** Should see `Auth state changed: SIGNED_IN`
3. **Navigate to protected page:** Should see `ProtectedRoute - user: {...}`

## Solution Checklist

- [ ] Hard refresh page (Ctrl+Shift+R)
- [ ] Check browser console for errors
- [ ] Verify session token exists
- [ ] Log out and log in again
- [ ] Check Supabase connection
- [ ] Verify user profile exists
- [ ] Check network requests for errors
- [ ] Restart dev server

## If Still Not Working

1. **Share console output:**
   - Copy all messages from console
   - Include any red errors

2. **Share network errors:**
   - Open Network tab
   - Try to access protected page
   - Screenshot failed requests

3. **Check Supabase:**
   - Go to Supabase Dashboard
   - Verify user exists in auth
   - Verify user profile exists in profiles table
   - Check RLS policies

## Files Modified for Debugging
- ✅ `src/components/ProtectedRoute.jsx` - Added debug logging
- ✅ `src/contexts/AuthContext.jsx` - Added debug logging

## Next Steps

1. **Test the fix:**
   - Hard refresh the app
   - Log in
   - Try clicking "My Ads"
   - Check console for messages

2. **If it works:**
   - Remove debug logging (optional)
   - Test all protected routes
   - Test logout and login again

3. **If it doesn't work:**
   - Follow debugging steps above
   - Share console output
   - Share network errors

---

**Last Updated:** Nov 19, 2025
