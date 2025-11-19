# Complete Supabase Email Configuration Guide

## Overview

This guide provides everything you need to set up email confirmation in Supabase for your Bi3wEchri marketplace.

## Three Setup Methods Available

### Method 1: Supabase Dashboard (Easiest) ⭐
- **Time:** 10 minutes
- **Difficulty:** Easy
- **Best for:** Most users
- **Guide:** See `EMAIL_SETUP_MANUAL_STEPS.md` - Method 1

### Method 2: Supabase CLI (Advanced)
- **Time:** 15 minutes
- **Difficulty:** Intermediate
- **Best for:** Developers who prefer CLI
- **Guide:** See `SUPABASE_CLI_EMAIL_SETUP.md`

### Method 3: Automated Setup Script (Fastest) ⭐⭐
- **Time:** 5 minutes
- **Difficulty:** Very Easy
- **Best for:** Quick setup
- **Files:** 
  - Windows: `setup-email-cli.bat`
  - Mac/Linux: `setup-email-cli.sh`

## Quick Start (5 minutes)

### For Windows Users:
```bash
cd c:\Users\DELL\Documents\GitHub\bi3wechri
setup-email-cli.bat
```

### For Mac/Linux Users:
```bash
cd c:\Users\DELL\Documents\GitHub\bi3wechri
chmod +x setup-email-cli.sh
./setup-email-cli.sh
```

### For Dashboard Users:
1. Go to https://supabase.com/dashboard
2. Click your project
3. Authentication > Providers > Email
4. Enable email confirmations
5. Set redirect URLs
6. Configure SMTP

## Configuration Summary

### Email Confirmation Settings
```
Enable email confirmations: ON
Confirmation email expiry: 86400 seconds (24 hours)
Email change token expiry: 3600 seconds (1 hour)
Password reset token expiry: 3600 seconds (1 hour)
```

### Redirect URLs
```
Development:
  http://localhost:3000
  http://localhost:3000/auth/reset-password
  http://localhost:3000/auth/callback

Production:
  https://yourdomain.com
  https://yourdomain.com/auth/reset-password
  https://yourdomain.com/auth/callback
```

### SMTP Providers (Choose One)

**Brevo (Recommended for Tunisia)**
```
Host: smtp-relay.brevo.com
Port: 587
User: your-email@brevo.com
Password: your-smtp-key
```

**Mailgun**
```
Host: smtp.mailgun.org
Port: 587
User: postmaster@your-domain.com
Password: your-mailgun-password
```

**SendGrid**
```
Host: smtp.sendgrid.net
Port: 587
User: apikey
Password: your-sendgrid-api-key
```

## Step-by-Step Instructions

### Step 1: Choose Setup Method
- **Easiest:** Use `setup-email-cli.bat` (Windows) or `setup-email-cli.sh` (Mac/Linux)
- **Manual:** Follow `EMAIL_SETUP_MANUAL_STEPS.md`
- **CLI:** Follow `SUPABASE_CLI_EMAIL_SETUP.md`

### Step 2: Get Your Supabase Project Reference
1. Go to https://supabase.com/dashboard
2. Click your project
3. Settings > General
4. Copy the Reference ID

### Step 3: Run Setup
- **Script:** Run the setup script for your OS
- **Manual:** Follow the dashboard steps in `EMAIL_SETUP_MANUAL_STEPS.md`
- **CLI:** Run the CLI commands in `SUPABASE_CLI_EMAIL_SETUP.md`

### Step 4: Configure SMTP
1. Get SMTP credentials from your email provider
2. Go to Supabase Dashboard
3. Authentication > Providers > Email
4. Fill in SMTP settings
5. Click Save

### Step 5: Test Email Flows
1. Sign up with test email
2. Check inbox for confirmation email
3. Click confirmation link
4. Verify email is confirmed

### Step 6: Deploy to Production
1. Update redirect URLs with production domain
2. Test all email flows in production
3. Monitor email delivery

## File Reference

### Setup Files
- `setup-email-cli.bat` - Windows automated setup script
- `setup-email-cli.sh` - Mac/Linux automated setup script

### Documentation Files
- `EMAIL_SETUP_MANUAL_STEPS.md` - Step-by-step manual guide
- `SUPABASE_CLI_EMAIL_SETUP.md` - Detailed CLI guide
- `EMAIL_QUICK_START.md` - Quick start guide
- `EMAIL_TESTING_GUIDE.md` - Testing procedures
- `QUICK_TROUBLESHOOTING.md` - Troubleshooting guide

### Code Files
- `src/lib/emailService.js` - Email utility functions
- `src/pages/ForgotPassword.jsx` - Forgot password page
- `src/pages/ResetPassword.jsx` - Reset password page
- `src/contexts/AuthContext.jsx` - Auth state management

## Email Flows

### Signup & Confirmation Flow
```
User clicks Sign Up
    ↓
Enters email and password
    ↓
Clicks Sign Up button
    ↓
Auth user created in Supabase
    ↓
Profile created in profiles table
    ↓
Confirmation email sent
    ↓
User receives email
    ↓
User clicks confirmation link
    ↓
Email verified
    ↓
User can login
```

### Password Reset Flow
```
User clicks "Forgot?" on login
    ↓
Enters email address
    ↓
Clicks "Send Reset Email"
    ↓
Reset email sent
    ↓
User receives email
    ↓
User clicks reset link
    ↓
Enters new password
    ↓
Confirms password
    ↓
Clicks "Reset Password"
    ↓
Password updated
    ↓
Redirected to login
    ↓
User logs in with new password
```

## Troubleshooting

### Email Not Received
1. Check SMTP configuration in Supabase
2. Check email provider logs
3. Check spam folder
4. Verify sender email is correct
5. Check Supabase logs for errors

### Confirmation Link Not Working
1. Verify redirect URLs in Supabase
2. Check link hasn't expired
3. Try incognito browsing
4. Check browser console for errors

### SMTP Connection Failed
1. Verify SMTP host and port
2. Check SMTP credentials
3. Try different port (587 vs 465)
4. Check firewall allows SMTP
5. Contact email provider support

**For detailed troubleshooting:** See `QUICK_TROUBLESHOOTING.md`

## Testing Checklist

- [ ] SMTP provider account created
- [ ] SMTP credentials obtained
- [ ] Supabase project linked
- [ ] Email confirmations enabled
- [ ] Redirect URLs configured
- [ ] SMTP settings configured
- [ ] Email templates customized
- [ ] Test signup and confirmation
- [ ] Test password reset
- [ ] Test resend confirmation
- [ ] Verify in Supabase dashboard
- [ ] Test on mobile devices
- [ ] Test in different email clients
- [ ] Add DNS records (SPF/DKIM/DMARC)
- [ ] Deploy to production

## Important Notes

### Security
- Always use HTTPS in production
- Keep SMTP credentials secure
- Use environment variables for sensitive data
- Enable SPF/DKIM/DMARC records

### Performance
- Email delivery typically takes 1-2 minutes
- Confirmation links expire after 24 hours
- Password reset links expire after 1 hour
- No rate limiting by default (add if needed)

### Best Practices
- Test all flows before production
- Monitor email delivery rates
- Check email provider logs regularly
- Keep email templates updated
- Test on multiple email clients
- Use branded sender email

## Next Steps

1. **Choose Setup Method**
   - Automated script (fastest)
   - Manual dashboard (easiest)
   - CLI (most control)

2. **Get Email Provider Account**
   - Brevo (recommended)
   - Mailgun
   - SendGrid

3. **Run Setup**
   - Follow chosen method
   - Configure SMTP
   - Test email flows

4. **Deploy to Production**
   - Update redirect URLs
   - Add DNS records
   - Monitor delivery

## Support Resources

**Official Documentation:**
- Supabase Auth: https://supabase.com/docs/guides/auth
- Email Configuration: https://supabase.com/docs/guides/auth/auth-email
- CLI Reference: https://supabase.com/docs/reference/cli

**Email Providers:**
- Brevo: https://www.brevo.com
- Mailgun: https://www.mailgun.com
- SendGrid: https://sendgrid.com

**Project Documentation:**
- See all .md files in project root
- Check browser console for errors
- Check Supabase logs for issues

## Quick Commands Reference

### Supabase CLI
```bash
# Link to project
supabase link --project-ref your-project-id

# View auth config
supabase auth config list

# Set auth config
supabase auth config set key value

# Push changes
supabase push

# View logs
supabase logs --project-ref your-project-id
```

### Setup Scripts
```bash
# Windows
setup-email-cli.bat

# Mac/Linux
./setup-email-cli.sh
```

## Summary

You now have everything needed to set up email confirmation in Supabase:

✅ Three setup methods (automated, manual, CLI)
✅ Step-by-step guides for each method
✅ Troubleshooting guides
✅ Testing procedures
✅ Email utility functions
✅ Modern UI pages for password reset
✅ Comprehensive documentation

**Choose your preferred method and follow the guide!**

---

**Last Updated:** November 19, 2025
**Status:** Ready for Setup
**Recommended Method:** Automated Setup Script (5 minutes)
