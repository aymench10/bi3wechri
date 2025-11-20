# Enable Email Authentication in Supabase

## Problem
You're getting: **"Email signups are disabled"**

This means email/password authentication is not enabled in your Supabase project.

## Solution - Enable Email Auth (5 minutes)

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Click your project (bi3wechri)
3. Go to **Authentication** → **Providers**

### Step 2: Enable Email Provider
1. Click on **Email** provider
2. Toggle **Enable Email provider** to **ON**
3. Make sure these are checked:
   - ✅ Enable email confirmations
   - ✅ Require email for signup
4. Set **Email confirmation expiry** to: **86400** (24 hours)
5. Click **Save**

### Step 3: Configure Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/reset-password`
   - `http://localhost:5173` (if using port 5173)
   - Your production domain (when ready)
3. Click **Save**

### Step 4: (Optional) Configure SMTP
If you want to send emails from your own email provider:

1. Go to **Authentication** → **Email Templates**
2. Click **SMTP Settings**
3. Choose your provider:
   - **Brevo** (recommended for Tunisia)
   - **Mailgun**
   - **SendGrid**
   - **AWS SES**
4. Enter your credentials
5. Click **Test** to verify
6. Click **Save**

If you don't configure SMTP, Supabase will send emails from its own service (slower but works).

## After Enabling

### Test Signup
1. Go to: http://localhost:3000/signup
2. Fill in the form:
   - Full Name: Your Name
   - Email: your-email@gmail.com
   - Phone: 21621234567
   - Password: YourPassword123
3. Click **Sign Up**
4. You should see: "Please check your email to confirm your account"
5. Check your email for confirmation link
6. Click the link to confirm
7. You can now log in!

### If Email Doesn't Arrive
- Check spam/junk folder
- Wait 2-3 minutes
- Try with a different email
- Check Supabase logs: Authentication → Logs

## Troubleshooting

### "Email signups are disabled" still shows
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Make sure you saved the settings in Supabase

### Email not arriving
- Check spam folder
- Wait a few minutes
- Try a different email address
- Check Supabase logs for errors
- If using SMTP, verify credentials

### "Invalid email" error
- Make sure email format is correct: user@example.com
- No spaces before/after email

## Quick Checklist
- [ ] Opened Supabase dashboard
- [ ] Went to Authentication → Providers
- [ ] Enabled Email provider
- [ ] Set email confirmation expiry to 86400
- [ ] Added redirect URLs
- [ ] Saved changes
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tried signing up again

## Status
After completing these steps, email signups should work! 🎉

## Need Help?
If you're still having issues:
1. Check Supabase logs: Authentication → Logs
2. Look for error messages
3. Share the error with the developer
