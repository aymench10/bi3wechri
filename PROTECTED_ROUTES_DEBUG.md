# Protected Routes Debug Guide

## Issue
Logged-in users cannot access Messages, Profile, My Ads, or Favorites pages.

## Diagnostic Steps

### Step 1: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Try clicking on "My Ads" or "Messages"
4. Look for any red error messages
5. Share the error message

### Step 2: Check Auth State
In the browser console, run:
```javascript
// Check if user is logged in
console.log('User:', localStorage.getItem('sb-auth-token'))
```

### Step 3: Test Navigation Directly
Try navigating directly to these URLs:
- http://localhost:3000/my-ads
- http://localhost:3000/messages
- http://localhost:3000/favorites
- http://localhost:3000/notifications

**Expected behavior:**
- If logged in: Should show the page
- If not logged in: Should redirect to login

### Step 4: Check Network Requests
1. Open **Network** tab in F12
2. Try clicking "My Ads"
3. Look for failed requests (red)
4. Check response status codes

### Step 5: Verify User Object
In the browser console, add this to a page:
```javascript
// Add this to any component to debug
useEffect(() => {
  console.log('Current user:', user)
  console.log('Loading:', loading)
  console.log('Auth context:', { user, loading })
}, [user, loading])
```

## Common Issues and Solutions

### Issue 1: Redirects to Login
**Cause:** User object is null or loading is true
**Solution:** 
- Check if user is actually logged in
- Verify session token exists
- Try logging out and logging back in

### Issue 2: Page Shows But No Data
**Cause:** Data fetching is failing
**Solution:**
- Check browser console for fetch errors
- Verify Supabase connection
- Check RLS policies on tables

### Issue 3: Page Blank/White
**Cause:** Component error or infinite loading
**Solution:**
- Check console for JavaScript errors
- Look for network errors
- Try hard refresh (Ctrl+Shift+R)

## What to Check

### 1. AuthContext State
- Is `user` object populated?
- Is `loading` false?
- Is `isAuthenticated` true?

### 2. ProtectedRoute Component
- Is it showing loading spinner?
- Is it redirecting to login?
- Is it showing the protected page?

### 3. Page Components
- Are they fetching data?
- Are they showing errors?
- Are they showing empty states?

## Files to Check

### Authentication
- `src/contexts/AuthContext.jsx` - Auth state management
- `src/components/ProtectedRoute.jsx` - Route protection logic

### Protected Pages
- `src/pages/MyAds.jsx` - My Ads page
- `src/pages/Messages.jsx` - Messages page
- `src/pages/Favorites.jsx` - Favorites page
- `src/pages/Notifications.jsx` - Notifications page

### Navigation
- `src/components/Navbar.jsx` - Navigation links
- `src/App.jsx` - Route definitions

## Quick Test

1. Log in to your account
2. Open browser console (F12)
3. Run: `console.log(JSON.parse(localStorage.getItem('sb-auth-token')))`
4. If you see a token, you're logged in
5. Try clicking "My Ads"
6. Check console for errors

## Report Format

When reporting issues, please include:
1. **What you tried:** (e.g., "Clicked My Ads link")
2. **What happened:** (e.g., "Page went blank" or "Redirected to login")
3. **Console errors:** (Copy any red errors from F12 console)
4. **Network errors:** (Any failed requests in Network tab)
5. **Browser:** (Chrome, Firefox, Safari, etc.)

---

**Next Steps:** Follow the diagnostic steps above and share the findings.
