# Supabase SMTP Email Setup Guide

## Overview
This guide covers integrating Supabase Auth with custom SMTP providers (Brevo, Mailgun, SendGrid, etc.) for email confirmations and password resets.

## Supported SMTP Providers

### 1. Brevo (Recommended for Tunisia)
**Why Brevo?**
- Excellent deliverability in North Africa
- Free tier: 300 emails/day
- Affordable pricing
- Good support for French/Arabic content

**Setup Steps:**
1. Sign up at https://www.brevo.com
2. Go to Settings > SMTP & API
3. Create SMTP credentials
4. Note your SMTP details:
   - Host: `smtp-relay.brevo.com`
   - Port: `587` (TLS) or `465` (SSL)
   - Username: Your Brevo email
   - Password: SMTP key (not your account password)

### 2. Mailgun
**Setup Steps:**
1. Sign up at https://www.mailgun.com
2. Go to Sending > Domain Settings
3. Create SMTP credentials
4. Note your SMTP details:
   - Host: `smtp.mailgun.org`
   - Port: `587` (TLS) or `465` (SSL)
   - Username: `postmaster@your-domain.com`
   - Password: SMTP password

### 3. SendGrid
**Setup Steps:**
1. Sign up at https://sendgrid.com
2. Go to Settings > API Keys
3. Create SMTP credentials
4. Note your SMTP details:
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: Your API key

### 4. AWS SES
**Setup Steps:**
1. Set up AWS SES in your region
2. Verify sender email
3. Create SMTP credentials
4. Note your SMTP details:
   - Host: `email-smtp.region.amazonaws.com`
   - Port: `587`
   - Username: SMTP username
   - Password: SMTP password

## Supabase Configuration

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your project
3. Navigate to **Authentication > Email Templates**

### Step 2: Configure SMTP Provider

#### In Supabase Dashboard:
1. Go to **Authentication > Providers**
2. Click **Email**
3. Scroll to **SMTP Settings**
4. Fill in your SMTP provider details:

```
SMTP Host: smtp-relay.brevo.com (example for Brevo)
SMTP Port: 587
SMTP User: your-email@example.com
SMTP Password: your-smtp-key
Sender Email: noreply@yourdomain.com
Sender Name: Bi3wEchri Marketplace
```

5. Click **Save**

### Step 3: Enable Email Confirmations

1. Go to **Authentication > Providers > Email**
2. Under **Email Confirmations**, toggle **Enable email confirmations**
3. Set **Confirmation email expiry** (default: 24 hours)
4. Click **Save**

### Step 4: Configure Email Templates

#### Confirmation Email Template
1. Go to **Authentication > Email Templates**
2. Click **Confirmation Email**
3. Customize the template:

```html
<h2>Confirm your email</h2>
<p>Welcome to Bi3wEchri Marketplace!</p>
<p>Click the link below to confirm your email address:</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
<p>This link expires in 24 hours.</p>
<p>If you didn't create this account, you can ignore this email.</p>
```

#### Password Reset Email Template
1. Go to **Authentication > Email Templates**
2. Click **Password Reset Email**
3. Customize the template:

```html
<h2>Reset your password</h2>
<p>We received a request to reset your password.</p>
<p>Click the link below to set a new password:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>
<p>This link expires in 1 hour.</p>
<p>If you didn't request this, you can ignore this email.</p>
```

#### Magic Link Email Template (Optional)
1. Go to **Authentication > Email Templates**
2. Click **Magic Link Email**
3. Customize the template:

```html
<h2>Your magic link</h2>
<p>Click the link below to sign in to Bi3wEchri Marketplace:</p>
<a href="{{ .ConfirmationURL }}">Sign In</a>
<p>This link expires in 1 hour.</p>
```

### Step 5: Configure Redirect URLs

1. Go to **Authentication > URL Configuration**
2. Add your redirect URLs:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs:
     - `https://yourdomain.com/auth/callback`
     - `https://yourdomain.com/login`
     - `http://localhost:3000` (for development)

## Environment Variables

Update your `.env` file with SMTP configuration:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Email Configuration (for reference, actual config is in Supabase dashboard)
VITE_SMTP_PROVIDER=brevo
VITE_SENDER_EMAIL=noreply@yourdomain.com
VITE_SENDER_NAME=Bi3wEchri Marketplace
```

## Email Confirmation Flow

### User Signs Up:
```
1. User enters email and password
2. Supabase creates auth user
3. Confirmation email sent to user's email
4. User clicks confirmation link
5. Email verified in auth.users table
6. User can now sign in
```

### Implementation:
```javascript
const { signUp } = useAuth()

const handleSignUp = async (email, password, fullName, phone) => {
  const { data, error } = await signUp(email, password, fullName, phone)
  
  if (error) {
    setError(error.message)
  } else {
    // Show message to check email
    setMessage('Please check your email to confirm your account')
  }
}
```

## Password Reset Flow

### User Requests Password Reset:
```
1. User clicks "Forgot Password"
2. User enters email
3. Password reset email sent
4. User clicks reset link
5. User enters new password
6. Password updated
7. User redirected to login
```

### Implementation:
```javascript
const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
  
  if (error) {
    console.error('Reset error:', error)
  } else {
    console.log('Reset email sent')
  }
}
```

## Testing Email Delivery

### Test Confirmation Email:
1. Sign up with a test email
2. Check inbox for confirmation email
3. Click confirmation link
4. Verify email is confirmed in Supabase dashboard

### Test Password Reset:
1. Go to login page
2. Click "Forgot Password"
3. Enter registered email
4. Check inbox for reset email
5. Click reset link
6. Enter new password
7. Verify password changed

### Troubleshooting Email Issues:

**Email not received:**
- Check spam/junk folder
- Verify sender email is correct
- Check SMTP credentials in Supabase
- Check email provider logs
- Verify email address is correct

**Email marked as spam:**
- Configure SPF, DKIM, DMARC records
- Use branded sender email
- Avoid spam trigger words
- Keep email templates clean

**SMTP connection errors:**
- Verify SMTP host and port
- Check SMTP credentials
- Verify firewall allows outbound SMTP
- Check email provider status page

## Email Template Variables

Available variables in Supabase email templates:

```
{{ .ConfirmationURL }}     - Confirmation/reset link
{{ .Email }}               - User's email address
{{ .Token }}               - Confirmation token
{{ .Data.name }}           - User's name (from user_metadata)
{{ .Data.full_name }}      - User's full name
{{ .SiteURL }}             - Your site URL
```

## Best Practices

1. **Use a branded sender email** - `noreply@yourdomain.com` instead of generic
2. **Add SPF/DKIM/DMARC records** - Improves deliverability
3. **Keep templates simple** - Avoid complex HTML
4. **Test thoroughly** - Use test emails before production
5. **Monitor delivery** - Check email provider logs
6. **Set appropriate expiry times** - 24h for confirmation, 1h for reset
7. **Provide alternative contact** - Include support email in templates
8. **Localize content** - Support French/Arabic if needed

## SPF, DKIM, DMARC Setup

### SPF Record (DNS):
```
v=spf1 include:sendgrid.net ~all
```
(Replace with your email provider's SPF record)

### DKIM Record (DNS):
- Get DKIM public key from your email provider
- Add as DNS TXT record
- Verify in email provider dashboard

### DMARC Record (DNS):
```
v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com
```

## Monitoring & Analytics

### Check Email Logs:
1. Go to Supabase Dashboard
2. Navigate to **Authentication > Logs**
3. Filter by email events
4. Monitor delivery status

### Email Provider Analytics:
- Brevo: Dashboard > Statistics
- Mailgun: Dashboard > Logs
- SendGrid: Mail Activity > All Mail
- AWS SES: Sending Statistics

## Troubleshooting Common Issues

### Issue: "SMTP authentication failed"
**Solution:**
- Verify SMTP username and password
- Check if SMTP is enabled in provider
- Try different SMTP port (587 vs 465)

### Issue: "Connection timeout"
**Solution:**
- Verify SMTP host is correct
- Check firewall allows outbound SMTP
- Try different port

### Issue: "Emails going to spam"
**Solution:**
- Add SPF/DKIM/DMARC records
- Use branded sender email
- Improve email template content
- Check email provider reputation

### Issue: "Confirmation link not working"
**Solution:**
- Verify redirect URLs in Supabase
- Check link expiry time
- Verify email provider sending link correctly
- Check browser console for errors

## Production Checklist

- [ ] SMTP provider configured in Supabase
- [ ] Email templates customized
- [ ] Redirect URLs configured
- [ ] SPF/DKIM/DMARC records added
- [ ] Test confirmation email works
- [ ] Test password reset works
- [ ] Email provider logs monitored
- [ ] Sender email is branded
- [ ] Email templates are mobile-friendly
- [ ] Fallback contact info in emails
- [ ] Rate limiting configured
- [ ] Error handling implemented

## Next Steps

1. Choose an SMTP provider (Brevo recommended)
2. Set up SMTP credentials
3. Configure Supabase with SMTP details
4. Customize email templates
5. Add DNS records (SPF/DKIM/DMARC)
6. Test confirmation and reset flows
7. Monitor delivery and adjust as needed
