# Email Testing & Verification Guide

## Quick Testing Checklist

### Test 1: Confirmation Email ✓
```
1. Navigate to /signup
2. Fill form with:
   - Email: test-confirm@example.com
   - Password: Test123!
   - Full Name: Test User
   - Phone: +216 XX XXX XXX
3. Submit form
4. Check email inbox
5. Verify email received within 2 minutes
6. Click confirmation link
7. Verify redirected to login/home
8. Verify email is confirmed in Supabase
```

### Test 2: Password Reset ✓
```
1. Navigate to /login
2. Click "Forgot?" link
3. Enter registered email
4. Submit form
5. Check email inbox
6. Verify reset email received within 2 minutes
7. Click reset link
8. Enter new password (min 6 chars, uppercase, lowercase, number)
9. Confirm password
10. Submit form
11. Verify redirected to login
12. Login with new password
13. Verify login successful
```

### Test 3: Resend Confirmation ✓
```
1. Sign up but don't confirm email
2. Go to /login
3. Try to login (should fail or show unconfirmed message)
4. Click "Resend confirmation" (if available)
5. Check email inbox
6. Verify new confirmation email received
7. Click confirmation link
8. Verify email is confirmed
```

## Email Provider Testing

### Brevo Testing

**Step 1: Verify SMTP Connection**
```bash
# Test SMTP connection
telnet smtp-relay.brevo.com 587

# Expected output:
# 220 smtp-relay.brevo.com ESMTP Postfix
```

**Step 2: Check Brevo Dashboard**
1. Go to https://www.brevo.com
2. Sign in to your account
3. Go to **Statistics > Logs**
4. Filter by date (today)
5. Look for your test emails
6. Check status: Sent, Delivered, Opened, Clicked

**Step 3: Monitor Delivery**
- Sent: Email accepted by Brevo
- Delivered: Email delivered to recipient
- Opened: Recipient opened email
- Clicked: Recipient clicked link

### Mailgun Testing

**Step 1: Check Mailgun Dashboard**
1. Go to https://www.mailgun.com
2. Sign in to your account
3. Go to **Sending > Logs**
4. Look for your test emails
5. Check status and delivery details

**Step 2: Test Email Delivery**
```bash
# Send test email via Mailgun API
curl -s --user 'api:key-xxx' \
  https://api.mailgun.net/v3/yourdomain.com/messages \
  -F from='noreply@yourdomain.com' \
  -F to='test@example.com' \
  -F subject='Test Email' \
  -F text='This is a test email'
```

### SendGrid Testing

**Step 1: Check SendGrid Dashboard**
1. Go to https://sendgrid.com
2. Sign in to your account
3. Go to **Mail Activity**
4. Look for your test emails
5. Check delivery status

## Supabase Email Logs

### View Email Logs in Supabase

1. Go to Supabase Dashboard
2. Click your project
3. Go to **Authentication > Logs**
4. Filter by:
   - Event type: email_signup, email_confirmation, password_reset
   - Date range
   - User email
5. Check for errors or issues

### Common Log Entries

**Successful Confirmation:**
```
Event: user_signup
Status: Success
Message: User created and confirmation email sent
```

**Successful Password Reset:**
```
Event: password_reset
Status: Success
Message: Password reset email sent
```

**SMTP Error:**
```
Event: email_error
Status: Failed
Message: SMTP connection failed - Invalid credentials
```

## Testing Different Email Providers

### Test with Brevo

**Prerequisites:**
- Brevo account created
- SMTP credentials obtained
- Configured in Supabase

**Test Steps:**
1. Configure Supabase with Brevo SMTP
2. Sign up with test email
3. Check Brevo logs for delivery
4. Verify email received

**Expected Results:**
- Email delivered within 30 seconds
- Email appears in Brevo logs
- Confirmation link works

### Test with Mailgun

**Prerequisites:**
- Mailgun account created
- Domain verified
- SMTP credentials obtained
- Configured in Supabase

**Test Steps:**
1. Configure Supabase with Mailgun SMTP
2. Sign up with test email
3. Check Mailgun logs for delivery
4. Verify email received

**Expected Results:**
- Email delivered within 1 minute
- Email appears in Mailgun logs
- Confirmation link works

### Test with SendGrid

**Prerequisites:**
- SendGrid account created
- API key created
- SMTP credentials obtained
- Configured in Supabase

**Test Steps:**
1. Configure Supabase with SendGrid SMTP
2. Sign up with test email
3. Check SendGrid logs for delivery
4. Verify email received

**Expected Results:**
- Email delivered within 1 minute
- Email appears in SendGrid logs
- Confirmation link works

## Troubleshooting Email Issues

### Issue: Email Not Received

**Diagnosis:**
1. Check Supabase logs for errors
2. Check email provider logs
3. Check spam folder
4. Verify email address is correct

**Solutions:**
```
1. Verify SMTP credentials in Supabase
2. Check email provider account status
3. Verify sender email is configured
4. Check firewall allows outbound SMTP
5. Try different SMTP port (587 vs 465)
```

### Issue: Email Marked as Spam

**Diagnosis:**
1. Check email provider reputation
2. Check SPF/DKIM/DMARC records
3. Check email content for spam triggers

**Solutions:**
```
1. Add SPF record to DNS
2. Add DKIM record to DNS
3. Add DMARC record to DNS
4. Use branded sender email
5. Improve email template content
6. Remove spam trigger words
```

### Issue: Confirmation Link Not Working

**Diagnosis:**
1. Check link format in email
2. Check token in URL
3. Check redirect URL configuration
4. Check link expiry time

**Solutions:**
```
1. Verify redirect URLs in Supabase
2. Check token is included in link
3. Verify link hasn't expired
4. Check browser console for errors
5. Try incognito/private browsing
```

### Issue: SMTP Connection Failed

**Diagnosis:**
1. Check SMTP credentials
2. Check SMTP host and port
3. Check firewall/network

**Solutions:**
```
1. Verify SMTP host is correct
2. Verify SMTP port is correct
3. Verify SMTP user and password
4. Try different port (587 vs 465)
5. Check firewall allows SMTP
6. Contact email provider support
```

## Performance Testing

### Load Testing Emails

**Test Setup:**
```javascript
// Send 100 emails in sequence
for (let i = 0; i < 100; i++) {
  await sendPasswordResetEmail(`test${i}@example.com`)
  await new Promise(resolve => setTimeout(resolve, 100)) // 100ms delay
}
```

**Expected Results:**
- All emails sent successfully
- No rate limiting errors
- Delivery time < 5 minutes

### Stress Testing

**Test Setup:**
```javascript
// Send 1000 emails concurrently
const promises = []
for (let i = 0; i < 1000; i++) {
  promises.push(sendPasswordResetEmail(`test${i}@example.com`))
}
await Promise.all(promises)
```

**Expected Results:**
- Most emails sent successfully
- Some may be rate limited
- No server crashes
- Check email provider limits

## Email Template Testing

### Test Confirmation Email Template

1. Go to Supabase > Authentication > Email Templates
2. Click **Confirmation Email**
3. Click **Preview**
4. Verify:
   - Logo displays correctly
   - Text is readable
   - Button is clickable
   - Link is correct
   - Mobile responsive

### Test Password Reset Email Template

1. Go to Supabase > Authentication > Email Templates
2. Click **Password Reset Email**
3. Click **Preview**
4. Verify:
   - Logo displays correctly
   - Text is readable
   - Button is clickable
   - Link is correct
   - Security warning visible
   - Mobile responsive

## Browser Email Testing

### Test Email Clients

**Gmail:**
1. Send test email to Gmail account
2. Verify email displays correctly
3. Check links work
4. Check images load

**Outlook:**
1. Send test email to Outlook account
2. Verify email displays correctly
3. Check links work
4. Check images load

**Apple Mail:**
1. Send test email to iCloud account
2. Verify email displays correctly
3. Check links work
4. Check images load

**Mobile Email Apps:**
1. Send test email to mobile device
2. Verify email displays correctly
3. Check links work
4. Check images load

## DNS Records Testing

### Verify SPF Record

```bash
# Check SPF record
nslookup -type=TXT yourdomain.com

# Expected output:
# yourdomain.com text = "v=spf1 include:sendgrid.net ~all"
```

### Verify DKIM Record

```bash
# Check DKIM record
nslookup -type=TXT selector._domainkey.yourdomain.com

# Expected output:
# DKIM public key
```

### Verify DMARC Record

```bash
# Check DMARC record
nslookup -type=TXT _dmarc.yourdomain.com

# Expected output:
# _dmarc.yourdomain.com text = "v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com"
```

## Automated Testing

### Email Testing Script

```javascript
// test-emails.js
import { sendPasswordResetEmail, resendConfirmationEmail } from './src/lib/emailService.js'

async function testEmails() {
  console.log('Starting email tests...')

  // Test 1: Password reset
  console.log('Test 1: Password reset email')
  const resetResult = await sendPasswordResetEmail('test@example.com')
  console.log(resetResult)

  // Test 2: Resend confirmation
  console.log('Test 2: Resend confirmation email')
  const resendResult = await resendConfirmationEmail('test@example.com')
  console.log(resendResult)

  console.log('Email tests completed')
}

testEmails().catch(console.error)
```

**Run tests:**
```bash
node test-emails.js
```

## Production Testing Checklist

- [ ] All SMTP credentials verified
- [ ] Email templates customized and tested
- [ ] Confirmation emails working
- [ ] Password reset emails working
- [ ] Resend confirmation working
- [ ] SPF/DKIM/DMARC records added
- [ ] Email provider logs monitored
- [ ] Sender email is branded
- [ ] Email templates are mobile-friendly
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Bounce handling configured
- [ ] Unsubscribe link added (if needed)
- [ ] Email provider support contacted
- [ ] Load testing completed
- [ ] Stress testing completed

## Support & Resources

**Brevo Support:**
- Website: https://www.brevo.com
- Docs: https://developers.brevo.com
- Support: support@brevo.com

**Mailgun Support:**
- Website: https://www.mailgun.com
- Docs: https://documentation.mailgun.com
- Support: support@mailgun.com

**SendGrid Support:**
- Website: https://sendgrid.com
- Docs: https://docs.sendgrid.com
- Support: support@sendgrid.com

**Supabase Support:**
- Website: https://supabase.com
- Docs: https://supabase.com/docs
- Support: support@supabase.com
