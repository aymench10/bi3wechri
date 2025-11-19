# Quick Troubleshooting Guide

## Problem: Stuck on Loading Screen

### Symptoms
- Page shows "Loading... Please wait while we verify your session"
- Spinner keeps spinning indefinitely
- Can't access protected routes like `/create-ad`

### Quick Fix
1. **Hard refresh browser:** Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. **Clear browser cache:** 
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data
3. **Try incognito/private mode:** Open new private window and test

### If Still Not Working
1. Open browser console: Press `F12`
2. Look for error messages in red
3. Share the error message for debugging

### Root Cause
- Auth context was not properly completing profile fetch
- **Fixed:** Added 5-second timeout to prevent infinite loading

---

## Problem: Logout Button Not Working

### Symptoms
- Click logout button → Nothing happens
- No error message
- Still logged in after clicking logout

### Quick Fix
1. **Try again:** Sometimes it's just slow, wait 2-3 seconds
2. **Hard refresh:** Press `Ctrl+Shift+R`
3. **Check console:** Press `F12` to see if there's an error

### If Still Not Working
1. Try logging out from a different page
2. Try using the mobile menu logout button
3. Check if you're actually logged in (check navbar)

### Root Cause
- Logout handler wasn't catching errors
- No feedback if logout failed
- **Fixed:** Added error handling and user feedback

---

## Problem: Can't Access Create Ad Page

### Symptoms
- Click "Post Ad" button
- Page gets stuck loading
- Can't create ads

### Quick Fix
1. **Wait 5 seconds:** Page should load (new timeout added)
2. **Hard refresh:** Press `Ctrl+Shift+R`
3. **Check login:** Make sure you're logged in
4. **Try home page first:** Go to home, then try create ad

### If Still Not Working
1. Check if you're authenticated (look at navbar)
2. Try logging out and back in
3. Check browser console for errors

### Root Cause
- Protected route was checking auth state indefinitely
- **Fixed:** Added 5-second timeout for auth verification

---

## Problem: Session Lost After Refresh

### Symptoms
- Login works
- Refresh page → Back to login
- Session not persisting

### This is Normal If
- You cleared browser cookies
- Using private/incognito mode
- Browser cache was cleared

### Quick Fix
1. **Login again:** Session should persist this time
2. **Check cookies:** Browser must allow cookies
3. **Check browser settings:** Make sure cookies are enabled

### If Keeps Happening
1. Check browser cookie settings
2. Try different browser
3. Check Supabase session settings

---

## Problem: "Access Denied" on Admin Page

### Symptoms
- Try to access `/admin`
- See "Access Denied" message
- Can't access admin dashboard

### This is Normal If
- You're not an admin user
- Your role is not set to 'admin' in database

### To Become Admin
1. Contact database admin
2. Update your profile role to 'admin' in Supabase
3. Refresh page

### If You Should Be Admin
1. Check Supabase profiles table
2. Verify your role is set to 'admin'
3. Refresh page after updating

---

## Problem: Email Confirmation Not Received

### Symptoms
- Signed up
- No confirmation email received
- Can't verify email

### Quick Fix
1. **Check spam folder:** Email might be there
2. **Wait 2 minutes:** Email takes time to send
3. **Check email address:** Make sure you entered correct email
4. **Try resend:** Look for "Resend confirmation" link

### If Still Not Received
1. Check SMTP provider logs (Brevo, Mailgun, etc.)
2. Verify SMTP is configured in Supabase
3. Check Supabase logs for email errors
4. See `EMAIL_QUICK_START.md` for setup

---

## Problem: Password Reset Link Not Working

### Symptoms
- Click "Forgot Password"
- Enter email
- Receive reset email
- Click link → Doesn't work

### Quick Fix
1. **Check link expiry:** Link expires in 1 hour
2. **Copy link manually:** Try copying and pasting URL
3. **Try different browser:** Sometimes browser cache issues
4. **Request new link:** Go back and request new reset email

### If Still Not Working
1. Check redirect URLs in Supabase
2. Verify email link format
3. Check browser console for errors
4. See `EMAIL_QUICK_START.md` for setup

---

## Debugging Steps

### Step 1: Check Browser Console
1. Press `F12` to open developer tools
2. Click "Console" tab
3. Look for red error messages
4. Screenshot and share errors

### Step 2: Check Network Tab
1. Press `F12` to open developer tools
2. Click "Network" tab
3. Refresh page
4. Look for failed requests (red)
5. Check response for error details

### Step 3: Check Application/Storage
1. Press `F12` to open developer tools
2. Click "Application" or "Storage" tab
3. Look for "Cookies" or "Local Storage"
4. Check if session token exists

### Step 4: Check Supabase Logs
1. Go to Supabase Dashboard
2. Click your project
3. Go to "Authentication" → "Logs"
4. Look for error messages
5. Check timestamps match your actions

---

## Common Error Messages

### "Session not found"
- **Cause:** Not logged in or session expired
- **Fix:** Login again

### "User not found"
- **Cause:** Account doesn't exist
- **Fix:** Sign up first

### "Invalid password"
- **Cause:** Wrong password entered
- **Fix:** Check caps lock, try again

### "Email already exists"
- **Cause:** Account with this email already exists
- **Fix:** Use different email or login

### "SMTP connection failed"
- **Cause:** Email provider not configured
- **Fix:** See `EMAIL_QUICK_START.md`

### "Redirect URL not allowed"
- **Cause:** URL not in Supabase redirect list
- **Fix:** Add URL to Supabase URL Configuration

---

## When to Contact Support

Contact support if:
1. Error persists after trying all fixes
2. Error message is unclear
3. Multiple issues at once
4. Can't access any pages
5. Database seems corrupted

**Provide:**
1. Screenshot of error
2. Browser console error message
3. Steps to reproduce
4. Your email/user ID
5. When issue started

---

## Quick Checklist

- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Cleared browser cache
- [ ] Checked browser console (F12)
- [ ] Tried incognito/private mode
- [ ] Checked Supabase logs
- [ ] Verified you're logged in
- [ ] Waited 5+ seconds for loading
- [ ] Tried different browser
- [ ] Checked email spam folder
- [ ] Verified environment variables

---

## Still Need Help?

1. **Check documentation:** See all .md files in project root
2. **Check Supabase docs:** https://supabase.com/docs
3. **Check browser console:** Press F12
4. **Check Supabase logs:** Go to project dashboard
5. **Restart dev server:** Stop and restart `npm run dev`

---

**Last Updated:** November 19, 2025
**Status:** All known issues fixed
