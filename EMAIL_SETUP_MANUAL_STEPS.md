# Email Confirmation Setup - Manual Steps

## Quick Summary
This guide shows you how to configure email confirmation in Supabase for your marketplace.

## Method 1: Using Supabase Dashboard (Easiest - 10 minutes)

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Sign in to your account
3. Click on your project

### Step 2: Navigate to Authentication Settings
1. In the left sidebar, click **Authentication**
2. Click **Providers**
3. Click **Email**

### Step 3: Enable Email Confirmations
1. Find the toggle for **Enable email confirmations**
2. Turn it **ON**
3. Set **Confirmation email expiry** to **86400** (24 hours)
4. Click **Save**

### Step 4: Configure Email Expiry Times
1. Still in Email settings
2. Find **Email change token expiry**: Set to **3600** (1 hour)
3. Find **Password reset token expiry**: Set to **3600** (1 hour)
4. Click **Save**

### Step 5: Configure Redirect URLs
1. In the left sidebar, click **Authentication**
2. Click **URL Configuration**
3. Set **Site URL** to your domain:
   ```
   For development: http://localhost:3000
   For production: https://yourdomain.com
   ```
4. Add **Redirect URLs**:
   ```
   http://localhost:3000
   http://localhost:3000/auth/reset-password
   http://localhost:3000/auth/callback
   https://yourdomain.com
   https://yourdomain.com/auth/reset-password
   https://yourdomain.com/auth/callback
   ```
5. Click **Save**

### Step 6: Configure SMTP Provider
1. Go to **Authentication > Providers > Email**
2. Scroll to **SMTP Settings**
3. Fill in your SMTP details:

**For Brevo:**
```
SMTP Host: smtp-relay.brevo.com
SMTP Port: 587
SMTP User: your-email@brevo.com
SMTP Password: your-smtp-key
Sender Email: noreply@yourdomain.com
Sender Name: Bi3wEchri Marketplace
```

**For Mailgun:**
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: postmaster@your-domain.com
SMTP Password: your-mailgun-password
Sender Email: noreply@yourdomain.com
Sender Name: Bi3wEchri Marketplace
```

**For SendGrid:**
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: your-sendgrid-api-key
Sender Email: noreply@yourdomain.com
Sender Name: Bi3wEchri Marketplace
```

4. Click **Save**

### Step 7: Customize Email Templates (Optional)
1. Go to **Authentication > Email Templates**
2. Click **Confirmation Email**
3. Update the template with your branding
4. Click **Save**
5. Click **Password Reset Email**
6. Update the template with your branding
7. Click **Save**

### Step 8: Test Email Confirmation
1. Go to your app at `http://localhost:3000`
2. Click **Sign Up**
3. Enter:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Full Name: `Test User`
   - Phone: `+216 XX XXX XXX`
4. Click **Sign Up**
5. Check your email inbox
6. Look for confirmation email from Bi3wEchri
7. Click the confirmation link
8. You should be redirected to your app
9. Email should now be confirmed

### Step 9: Verify in Supabase
1. Go to **Authentication > Users**
2. Find your test user
3. Check if email is marked as **Confirmed**

## Method 2: Using Supabase CLI (Advanced - 15 minutes)

### Prerequisites
1. Install Node.js (if not already installed)
2. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

### Step 1: Get Your Project Reference
1. Go to https://supabase.com/dashboard
2. Click your project
3. Go to **Settings > General**
4. Copy the **Reference ID** (looks like: `abcdefghijklmnop`)

### Step 2: Link to Your Project
```bash
cd c:\Users\DELL\Documents\GitHub\bi3wechri
supabase link --project-ref your-reference-id
```

When prompted, enter your Supabase access token:
1. Go to https://supabase.com/account/tokens
2. Create a new token or copy existing one
3. Paste it in the terminal

### Step 3: Configure Email Settings
Run these commands one by one:

```bash
# Enable email confirmations
supabase auth config set enable_email_confirmations true

# Set confirmation expiry to 24 hours (86400 seconds)
supabase auth config set email_confirmation_expiry 86400

# Set password reset expiry to 1 hour (3600 seconds)
supabase auth config set password_reset_token_expiry 3600

# Set email change expiry to 1 hour (3600 seconds)
supabase auth config set email_change_token_expiry 3600
```

### Step 4: Configure Redirect URLs
```bash
supabase auth config set redirect_urls \
  "http://localhost:3000" \
  "http://localhost:3000/auth/reset-password" \
  "https://yourdomain.com" \
  "https://yourdomain.com/auth/reset-password"
```

### Step 5: Push Configuration
```bash
supabase push
```

### Step 6: Verify Configuration
```bash
# View all auth settings
supabase auth config list

# View specific setting
supabase auth config get email_confirmation_expiry
```

## Method 3: Using Setup Script (Easiest - 5 minutes)

### For Windows:
1. Open Command Prompt
2. Navigate to project:
   ```bash
   cd c:\Users\DELL\Documents\GitHub\bi3wechri
   ```
3. Run the setup script:
   ```bash
   setup-email-cli.bat
   ```
4. Follow the prompts

### For Mac/Linux:
1. Open Terminal
2. Navigate to project:
   ```bash
   cd c:\Users\DELL\Documents\GitHub\bi3wechri
   ```
3. Make script executable:
   ```bash
   chmod +x setup-email-cli.sh
   ```
4. Run the setup script:
   ```bash
   ./setup-email-cli.sh
   ```
5. Follow the prompts

## Troubleshooting

### Email Not Received

**Check 1: Verify SMTP Configuration**
1. Go to Supabase Dashboard
2. Authentication > Providers > Email
3. Verify SMTP Host, Port, User, Password are correct

**Check 2: Check Email Provider Logs**
- Brevo: https://www.brevo.com/dashboard > Statistics > Logs
- Mailgun: https://www.mailgun.com/dashboard > Logs
- SendGrid: https://sendgrid.com/dashboard > Mail Activity

**Check 3: Check Supabase Logs**
1. Go to Supabase Dashboard
2. Authentication > Logs
3. Look for email errors

**Check 4: Check Spam Folder**
- Email might be marked as spam
- Add sender email to contacts
- Check spam filter rules

### Confirmation Link Not Working

**Check 1: Verify Redirect URLs**
1. Go to Supabase Dashboard
2. Authentication > URL Configuration
3. Verify redirect URLs are correct
4. Include both HTTP and HTTPS

**Check 2: Check Link Format**
- Link should be: `https://yourdomain.com/auth/reset-password?token=...`
- Verify token is included in link

**Check 3: Check Link Expiry**
- Default: 24 hours for confirmation
- Link might have expired
- Request new confirmation email

### SMTP Connection Error

**Check 1: Verify SMTP Credentials**
- Host: Correct for your provider
- Port: Usually 587 (TLS) or 465 (SSL)
- User: Your email or username
- Password: Your SMTP password (not account password)

**Check 2: Try Different Port**
- If 587 doesn't work, try 465
- If 465 doesn't work, try 587

**Check 3: Check Firewall**
- Verify outbound SMTP is allowed
- Check with your hosting provider

## Testing Checklist

- [ ] SMTP provider account created
- [ ] SMTP credentials configured in Supabase
- [ ] Email confirmations enabled
- [ ] Email templates customized
- [ ] Redirect URLs configured
- [ ] Test signup and confirmation email
- [ ] Test password reset flow
- [ ] Test resend confirmation
- [ ] Verify emails in provider logs
- [ ] Test on mobile devices
- [ ] Test in different email clients

## Next Steps

1. ✅ Choose setup method (Dashboard, CLI, or Script)
2. ✅ Configure email settings
3. ✅ Set redirect URLs
4. ✅ Configure SMTP provider
5. ✅ Test email flows
6. ✅ Deploy to production

## Support

**Supabase Documentation:**
- Email Auth: https://supabase.com/docs/guides/auth/auth-email
- URL Configuration: https://supabase.com/docs/guides/auth/auth-email-templates
- SMTP Setup: https://supabase.com/docs/guides/auth/auth-smtp

**Email Providers:**
- Brevo: https://www.brevo.com
- Mailgun: https://www.mailgun.com
- SendGrid: https://sendgrid.com

## Quick Reference

### Important URLs
- Supabase Dashboard: https://supabase.com/dashboard
- Supabase Docs: https://supabase.com/docs
- Brevo Dashboard: https://www.brevo.com/dashboard
- Mailgun Dashboard: https://www.mailgun.com/dashboard

### Important Settings
- Confirmation Expiry: 86400 seconds (24 hours)
- Password Reset Expiry: 3600 seconds (1 hour)
- Email Change Expiry: 3600 seconds (1 hour)
- SMTP Port: 587 (TLS) or 465 (SSL)

### Important Files
- `SUPABASE_CLI_EMAIL_SETUP.md` - Detailed CLI guide
- `setup-email-cli.sh` - Mac/Linux setup script
- `setup-email-cli.bat` - Windows setup script
- `EMAIL_QUICK_START.md` - Quick start guide
