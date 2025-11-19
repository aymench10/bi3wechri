# Supabase CLI Email Configuration Guide

## Prerequisites

1. **Install Supabase CLI**
```bash
npm install -g supabase
```

2. **Verify Installation**
```bash
supabase --version
```

3. **Get Your Supabase Credentials**
   - Project URL: `https://your-project.supabase.co`
   - Project API Key: From Supabase Dashboard > Settings > API
   - Access Token: From Supabase Dashboard > Account > Access Tokens

## Step 1: Initialize Supabase Project Locally

```bash
cd c:\Users\DELL\Documents\GitHub\bi3wechri

# Link to your Supabase project
supabase link --project-ref your-project-id

# When prompted, enter your Supabase access token
```

**To find your project ID:**
1. Go to https://supabase.com/dashboard
2. Click your project
3. Go to Settings > General
4. Copy the "Reference ID"

## Step 2: Create Auth Configuration File

Create `supabase/config.toml` in your project root:

```toml
# Supabase Configuration

[auth]
# Email confirmation settings
enable_signup = true
enable_email_confirmations = true
email_confirmation_expiry = 86400  # 24 hours in seconds
email_change_token_expiry = 3600   # 1 hour in seconds
password_reset_token_expiry = 3600 # 1 hour in seconds

# OTP settings
otp_exp = 3600                     # 1 hour
otp_length = 6

# Session settings
session_duration = 3600            # 1 hour
session_timeout = 3600             # 1 hour
refresh_token_rotation_enabled = true
refresh_token_reuse_interval = 10  # 10 seconds

# Redirect URLs
[auth.redirect_urls]
allowed_redirect_urls = [
  "http://localhost:3000",
  "http://localhost:3000/auth/reset-password",
  "http://localhost:3000/auth/callback",
  "https://yourdomain.com",
  "https://yourdomain.com/auth/reset-password",
  "https://yourdomain.com/auth/callback"
]

# External OAuth providers (optional)
[auth.external]
enable_apple = false
enable_google = false
enable_github = false
enable_discord = false
enable_twitch = false
enable_linkedin = false
enable_facebook = false
enable_spotify = false
enable_slack = false
enable_workos = false
```

## Step 3: Configure via Supabase Dashboard (Recommended)

### Method A: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard

2. **Select Your Project**
   - Click on your project name

3. **Navigate to Authentication Settings**
   - Left sidebar → Authentication
   - Click "Providers"
   - Click "Email"

4. **Configure Email Settings**
   ```
   Enable email confirmations: ON
   Confirmation email expiry: 86400 (24 hours)
   Email change token expiry: 3600 (1 hour)
   Password reset token expiry: 3600 (1 hour)
   ```

5. **Configure Redirect URLs**
   - Left sidebar → Authentication
   - Click "URL Configuration"
   - Site URL: `https://yourdomain.com`
   - Redirect URLs:
     ```
     http://localhost:3000
     http://localhost:3000/auth/reset-password
     http://localhost:3000/auth/callback
     https://yourdomain.com
     https://yourdomain.com/auth/reset-password
     https://yourdomain.com/auth/callback
     ```

6. **Configure SMTP**
   - Go to "Email" provider settings
   - Fill in SMTP details:
     ```
     SMTP Host: smtp-relay.brevo.com
     SMTP Port: 587
     SMTP User: your-email@brevo.com
     SMTP Password: your-smtp-key
     Sender Email: noreply@yourdomain.com
     Sender Name: Bi3wEchri Marketplace
     ```

7. **Save Settings**
   - Click "Save"

### Method B: Using Supabase CLI

1. **Pull Current Configuration**
```bash
supabase link --project-ref your-project-id
supabase db pull
```

2. **Update Auth Configuration**
```bash
# Set email confirmation expiry (24 hours)
supabase auth config set email_confirmation_expiry 86400

# Set password reset expiry (1 hour)
supabase auth config set password_reset_token_expiry 3600

# Set email change expiry (1 hour)
supabase auth config set email_change_token_expiry 3600

# Enable email confirmations
supabase auth config set enable_email_confirmations true
```

3. **Add Redirect URLs**
```bash
supabase auth config set redirect_urls \
  "http://localhost:3000" \
  "http://localhost:3000/auth/reset-password" \
  "https://yourdomain.com" \
  "https://yourdomain.com/auth/reset-password"
```

4. **Push Configuration**
```bash
supabase push
```

## Step 4: Configure Email Templates

### Create Email Template Migration

Create `supabase/migrations/[timestamp]_email_templates.sql`:

```sql
-- Update confirmation email template
UPDATE auth.email_templates
SET template = '<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
      .header { text-align: center; margin-bottom: 30px; }
      .logo { font-size: 24px; font-weight: bold; color: #0ea5e9; }
      .content { color: #333; line-height: 1.6; }
      .button { display: inline-block; background: linear-gradient(to right, #0ea5e9, #0284c7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">Bi3wEchri</div>
        <p style="color: #999; margin: 5px 0;">Marketplace</p>
      </div>
      
      <div class="content">
        <h2>Confirm Your Email</h2>
        <p>Welcome to Bi3wEchri Marketplace!</p>
        <p>Click the button below to confirm your email address:</p>
        
        <center>
          <a href="{{ .ConfirmationURL }}" class="button">Confirm Email</a>
        </center>
        
        <p>Or copy and paste this link:</p>
        <p style="word-break: break-all; color: #0ea5e9;">{{ .ConfirmationURL }}</p>
        
        <p style="color: #999; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
      
      <div class="footer">
        <p>© 2024 Bi3wEchri Marketplace. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>'
WHERE type = 'confirmation';

-- Update password reset email template
UPDATE auth.email_templates
SET template = '<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
      .header { text-align: center; margin-bottom: 30px; }
      .logo { font-size: 24px; font-weight: bold; color: #0ea5e9; }
      .content { color: #333; line-height: 1.6; }
      .button { display: inline-block; background: linear-gradient(to right, #0ea5e9, #0284c7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      .warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 12px; border-radius: 4px; margin: 20px 0; }
      .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">Bi3wEchri</div>
        <p style="color: #999; margin: 5px 0;">Marketplace</p>
      </div>
      
      <div class="content">
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password.</p>
        <p>Click the button below to set a new password:</p>
        
        <center>
          <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
        </center>
        
        <p>Or copy and paste this link:</p>
        <p style="word-break: break-all; color: #0ea5e9;">{{ .ConfirmationURL }}</p>
        
        <div class="warning">
          <strong>Security Note:</strong> This link expires in 1 hour.
        </div>
      </div>
      
      <div class="footer">
        <p>© 2024 Bi3wEchri Marketplace. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>'
WHERE type = 'recovery';
```

5. **Apply Migration**
```bash
supabase db push
```

## Step 5: Verify Configuration

### Check Current Settings
```bash
# View all auth settings
supabase auth config list

# View specific setting
supabase auth config get email_confirmation_expiry
```

### Test Email Confirmation

1. **Sign Up**
   - Go to your app
   - Click "Sign Up"
   - Enter email and password
   - Submit

2. **Check Email**
   - Check inbox for confirmation email
   - Should arrive within 2 minutes

3. **Click Confirmation Link**
   - Click link in email
   - Should redirect to your app
   - Email should be confirmed

4. **Verify in Supabase**
   - Go to Supabase Dashboard
   - Authentication > Users
   - Check if user's email is confirmed

## Step 6: Production Deployment

### Before Going Live

1. **Update Redirect URLs**
   - Add your production domain
   - Example: `https://yourdomain.com`

2. **Configure SMTP**
   - Use production SMTP credentials
   - Test email delivery

3. **Add DNS Records**
   - SPF record for email authentication
   - DKIM record for email signing
   - DMARC record for email policy

4. **Test All Flows**
   - Test signup and confirmation
   - Test password reset
   - Test email resend

### Deploy Configuration
```bash
# Push all changes to production
supabase push

# Verify deployment
supabase auth config list
```

## Troubleshooting

### Email Not Received

**Check SMTP Configuration**
```bash
# Verify SMTP settings
supabase auth config get smtp_host
supabase auth config get smtp_port
supabase auth config get smtp_user
```

**Check Supabase Logs**
1. Go to Supabase Dashboard
2. Authentication > Logs
3. Look for email errors

**Check Email Provider Logs**
- Brevo: https://www.brevo.com/dashboard
- Mailgun: https://www.mailgun.com/dashboard
- SendGrid: https://sendgrid.com/dashboard

### Confirmation Link Not Working

**Check Redirect URLs**
```bash
supabase auth config get redirect_urls
```

**Verify URL Format**
- Should be: `https://yourdomain.com/auth/reset-password`
- Check for typos
- Ensure HTTPS (not HTTP in production)

### OTP/Token Expiry Issues

**Check Token Expiry Settings**
```bash
supabase auth config get email_confirmation_expiry
supabase auth config get password_reset_token_expiry
```

**Update if Needed**
```bash
# Set to 24 hours (86400 seconds)
supabase auth config set email_confirmation_expiry 86400

# Set to 1 hour (3600 seconds)
supabase auth config set password_reset_token_expiry 3600
```

## Complete CLI Commands Reference

```bash
# Link to project
supabase link --project-ref your-project-id

# Pull current config
supabase db pull

# Push changes
supabase push

# View auth config
supabase auth config list

# Set auth config
supabase auth config set key value

# Get specific config
supabase auth config get key

# Run migrations
supabase db push

# View logs
supabase logs --project-ref your-project-id

# Test connection
supabase status
```

## Environment Variables

Add to your `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Email Configuration
VITE_SMTP_PROVIDER=brevo
VITE_SENDER_EMAIL=noreply@yourdomain.com
VITE_SENDER_NAME=Bi3wEchri Marketplace
VITE_CONFIRMATION_REDIRECT_URL=https://yourdomain.com/auth/reset-password
```

## Next Steps

1. ✅ Install Supabase CLI
2. ✅ Link to your project
3. ✅ Configure auth settings
4. ✅ Set redirect URLs
5. ✅ Configure SMTP
6. ✅ Test email flows
7. ✅ Deploy to production

## Support

**Supabase Documentation:**
- Auth Config: https://supabase.com/docs/guides/auth/auth-email
- CLI Reference: https://supabase.com/docs/reference/cli/supabase-auth-config-set
- Email Templates: https://supabase.com/docs/guides/auth/auth-email-templates

**Need Help?**
- Check Supabase logs
- Check email provider logs
- Review this guide
- Contact Supabase support
