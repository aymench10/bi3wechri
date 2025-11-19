# Supabase Email Configuration - Step by Step Guide

## Quick Start (5 minutes)

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your project
3. Click on your project name

### Step 2: Navigate to Email Settings
1. In the left sidebar, click **Authentication**
2. Click **Providers**
3. Click **Email**

### Step 3: Choose Your SMTP Provider

#### Option A: Brevo (Recommended for Tunisia)
**Why Brevo?** Best deliverability in North Africa, free tier available

1. Sign up at https://www.brevo.com
2. Go to **Settings > SMTP & API**
3. Click **Create SMTP Credentials**
4. Copy these details:
   - **SMTP Host:** `smtp-relay.brevo.com`
   - **SMTP Port:** `587`
   - **SMTP User:** Your Brevo email
   - **SMTP Password:** Your SMTP key (NOT your account password)

#### Option B: Mailgun
1. Sign up at https://www.mailgun.com
2. Go to **Sending > Domain Settings**
3. Copy these details:
   - **SMTP Host:** `smtp.mailgun.org`
   - **SMTP Port:** `587`
   - **SMTP User:** `postmaster@your-domain.com`
   - **SMTP Password:** Your SMTP password

#### Option C: SendGrid
1. Sign up at https://sendgrid.com
2. Go to **Settings > API Keys**
3. Create SMTP credentials
4. Copy these details:
   - **SMTP Host:** `smtp.sendgrid.net`
   - **SMTP Port:** `587`
   - **SMTP User:** `apikey`
   - **SMTP Password:** Your API key

### Step 4: Configure SMTP in Supabase

In Supabase Dashboard, under **Authentication > Providers > Email**:

1. Scroll to **SMTP Settings**
2. Fill in the fields:
   ```
   SMTP Host: smtp-relay.brevo.com (or your provider's host)
   SMTP Port: 587
   SMTP User: your-email@example.com
   SMTP Password: your-smtp-key
   Sender Email: noreply@yourdomain.com
   Sender Name: Bi3wEchri Marketplace
   ```
3. Click **Save**

### Step 5: Enable Email Confirmations

1. In **Authentication > Providers > Email**
2. Toggle **Enable email confirmations** to ON
3. Set **Confirmation email expiry:** 24 hours
4. Click **Save**

### Step 6: Configure Redirect URLs

1. Go to **Authentication > URL Configuration**
2. Set **Site URL:** `https://yourdomain.com`
3. Add **Redirect URLs:**
   ```
   https://yourdomain.com/auth/reset-password
   https://yourdomain.com/login
   http://localhost:3000 (for development)
   ```
4. Click **Save**

### Step 7: Test Email Sending

1. Go to your app's signup page
2. Create a test account with a real email
3. Check your inbox for confirmation email
4. Click the confirmation link
5. Verify email is confirmed

## Email Templates Configuration

### Customize Confirmation Email

1. Go to **Authentication > Email Templates**
2. Click **Confirmation Email**
3. Replace the template with:

```html
<!DOCTYPE html>
<html>
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
      <p>Click the button below to confirm your email address and activate your account:</p>
      
      <center>
        <a href="{{ .ConfirmationURL }}" class="button">Confirm Email</a>
      </center>
      
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #0ea5e9;">{{ .ConfirmationURL }}</p>
      
      <p style="color: #999; font-size: 12px;">This link expires in 24 hours.</p>
      <p>If you didn't create this account, you can safely ignore this email.</p>
    </div>
    
    <div class="footer">
      <p>© 2024 Bi3wEchri Marketplace. All rights reserved.</p>
      <p>Contact us: support@bi3wechri.com</p>
    </div>
  </div>
</body>
</html>
```

4. Click **Save**

### Customize Password Reset Email

1. Go to **Authentication > Email Templates**
2. Click **Password Reset Email**
3. Replace the template with:

```html
<!DOCTYPE html>
<html>
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
      
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #0ea5e9;">{{ .ConfirmationURL }}</p>
      
      <div class="warning">
        <strong>Security Note:</strong> This link expires in 1 hour. If you didn't request this, please ignore this email.
      </div>
      
      <p>If you have any issues, contact our support team.</p>
    </div>
    
    <div class="footer">
      <p>© 2024 Bi3wEchri Marketplace. All rights reserved.</p>
      <p>Contact us: support@bi3wechri.com</p>
    </div>
  </div>
</body>
</html>
```

4. Click **Save**

## Testing Email Flows

### Test 1: Confirmation Email
```
1. Go to /signup
2. Enter: test@example.com, password, name, phone
3. Check inbox for confirmation email
4. Click confirmation link
5. Verify email is confirmed
```

### Test 2: Password Reset
```
1. Go to /login
2. Click "Forgot?" link
3. Enter registered email
4. Check inbox for reset email
5. Click reset link
6. Enter new password
7. Verify password changed
8. Login with new password
```

### Test 3: Resend Confirmation
```
1. Sign up but don't confirm email
2. Click "Resend confirmation" (if available)
3. Check inbox for new confirmation email
4. Click link to confirm
```

## Troubleshooting

### Email Not Received

**Check 1: Verify SMTP Credentials**
- Go to Supabase > Authentication > Providers > Email
- Verify SMTP Host, Port, User, Password are correct
- Test credentials with your email provider

**Check 2: Check Email Provider Logs**
- Brevo: Dashboard > Statistics > Logs
- Mailgun: Dashboard > Logs
- SendGrid: Mail Activity > All Mail
- Look for bounce or rejection reasons

**Check 3: Check Spam Folder**
- Email might be marked as spam
- Add sender email to contacts
- Check spam filter rules

**Check 4: Verify Sender Email**
- Go to Supabase > Authentication > Providers > Email
- Verify "Sender Email" is correct
- Use a branded email (noreply@yourdomain.com)

### Email Marked as Spam

**Solution 1: Add DNS Records**

Add these DNS records to your domain:

**SPF Record:**
```
v=spf1 include:sendgrid.net ~all
```
(Replace with your email provider's SPF)

**DKIM Record:**
- Get from your email provider
- Add as TXT record in DNS

**DMARC Record:**
```
v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com
```

**Solution 2: Improve Email Content**
- Use branded sender name
- Avoid spam trigger words
- Keep HTML simple and clean
- Include unsubscribe link (for marketing emails)

### SMTP Connection Error

**Check 1: Verify Port**
- Try port 587 (TLS) first
- If fails, try port 465 (SSL)

**Check 2: Check Firewall**
- Verify outbound SMTP is allowed
- Check with your hosting provider

**Check 3: Test Connection**
```bash
telnet smtp-relay.brevo.com 587
```

### Confirmation Link Not Working

**Check 1: Verify Redirect URLs**
- Go to Supabase > Authentication > URL Configuration
- Ensure redirect URLs are correct
- Include both HTTP and HTTPS

**Check 2: Check Link Format**
- Link should be: `https://yourdomain.com/auth/reset-password?token=...`
- Verify token is included

**Check 3: Check Token Expiry**
- Default: 24 hours for confirmation
- Default: 1 hour for password reset
- Adjust in Supabase settings if needed

## Environment Variables

Update your `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Email Configuration (optional, for reference)
VITE_SMTP_PROVIDER=brevo
VITE_SENDER_EMAIL=noreply@yourdomain.com
VITE_SENDER_NAME=Bi3wEchri Marketplace
```

## Production Checklist

- [ ] SMTP provider account created
- [ ] SMTP credentials configured in Supabase
- [ ] Email confirmations enabled
- [ ] Email templates customized
- [ ] Redirect URLs configured
- [ ] SPF/DKIM/DMARC records added
- [ ] Test confirmation email works
- [ ] Test password reset works
- [ ] Test resend confirmation works
- [ ] Email provider logs monitored
- [ ] Sender email is branded
- [ ] Email templates are mobile-friendly
- [ ] Error handling implemented
- [ ] Rate limiting configured

## Support

For issues:
1. Check Supabase logs: Authentication > Logs
2. Check email provider logs
3. Check browser console for errors
4. Verify all credentials are correct
5. Test with different email addresses

## Next Steps

1. Choose SMTP provider (Brevo recommended)
2. Create account and get SMTP credentials
3. Configure in Supabase dashboard
4. Customize email templates
5. Add DNS records (SPF/DKIM/DMARC)
6. Test all email flows
7. Monitor delivery and adjust as needed
