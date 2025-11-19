# Email Integration - Quick Start (30 minutes)

## 1️⃣ Choose SMTP Provider (5 min)

### Recommended: Brevo
```
✓ Best for Tunisia
✓ Free tier: 300 emails/day
✓ Easy setup
✓ Good deliverability
```

**Sign up:** https://www.brevo.com

## 2️⃣ Get SMTP Credentials (5 min)

### For Brevo:
1. Sign in to Brevo
2. Go to **Settings > SMTP & API**
3. Click **Create SMTP Credentials**
4. Copy these:
   - **Host:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **User:** Your Brevo email
   - **Password:** Your SMTP key

## 3️⃣ Configure Supabase (5 min)

1. Go to **Supabase Dashboard > Authentication > Providers > Email**
2. Scroll to **SMTP Settings**
3. Fill in:
   ```
   SMTP Host: smtp-relay.brevo.com
   SMTP Port: 587
   SMTP User: your-email@brevo.com
   SMTP Password: your-smtp-key
   Sender Email: noreply@yourdomain.com
   Sender Name: Bi3wEchri Marketplace
   ```
4. Click **Save**

## 4️⃣ Enable Confirmations (2 min)

1. Go to **Authentication > Providers > Email**
2. Toggle **Enable email confirmations** ON
3. Set expiry: **24 hours**
4. Click **Save**

## 5️⃣ Set Redirect URLs (2 min)

1. Go to **Authentication > URL Configuration**
2. Set **Site URL:** `https://yourdomain.com`
3. Add **Redirect URLs:**
   ```
   https://yourdomain.com/auth/reset-password
   https://yourdomain.com/login
   http://localhost:3000
   ```
4. Click **Save**

## 6️⃣ Customize Email Templates (5 min)

### Confirmation Email:
1. Go to **Authentication > Email Templates**
2. Click **Confirmation Email**
3. Update template with your branding
4. Click **Save**

### Password Reset Email:
1. Click **Password Reset Email**
2. Update template with your branding
3. Click **Save**

## 7️⃣ Test Email Flows (5 min)

### Test Confirmation:
```
1. Go to /signup
2. Sign up with test email
3. Check inbox for confirmation
4. Click confirmation link
5. Verify email confirmed
```

### Test Password Reset:
```
1. Go to /login
2. Click "Forgot?" link
3. Enter email
4. Check inbox for reset email
5. Click reset link
6. Enter new password
7. Login with new password
```

## 🎉 Done!

Your email system is now working!

## Email Pages Available

### `/forgot-password`
- User enters email
- Receives password reset link
- Modern UI with success state

### `/auth/reset-password`
- User sets new password
- Password strength validation
- Auto-redirect after reset

### `/login` (Updated)
- "Forgot?" link next to password
- Links to forgot password page

## Available Functions

```javascript
import { 
  sendPasswordResetEmail,
  resendConfirmationEmail,
  updateUserPassword,
  updateUserEmail,
  isEmailConfirmed,
  isValidEmail
} from '../lib/emailService'

// Send password reset
await sendPasswordResetEmail('user@example.com')

// Resend confirmation
await resendConfirmationEmail('user@example.com')

// Update password
await updateUserPassword('newPassword123')

// Update email
await updateUserEmail('newemail@example.com')

// Check if confirmed
const confirmed = isEmailConfirmed(user)

// Validate email
const valid = isValidEmail('user@example.com')
```

## Troubleshooting

### Email Not Received?
1. Check spam folder
2. Verify SMTP credentials in Supabase
3. Check email provider logs
4. Verify sender email is correct

### Link Not Working?
1. Verify redirect URLs in Supabase
2. Check link hasn't expired
3. Try incognito browsing
4. Check browser console for errors

### SMTP Error?
1. Verify SMTP host and port
2. Check SMTP credentials
3. Try port 465 instead of 587
4. Contact email provider support

## Documentation

- **SMTP_EMAIL_SETUP.md** - Full setup guide
- **SUPABASE_EMAIL_CONFIG_GUIDE.md** - Detailed configuration
- **EMAIL_TESTING_GUIDE.md** - Testing procedures
- **EMAIL_INTEGRATION_SUMMARY.md** - Complete overview
- **backend-email-service-example.js** - Backend service

## Next Steps

1. ✅ Set up SMTP provider
2. ✅ Configure Supabase
3. ✅ Test email flows
4. ⏳ Add DNS records (SPF/DKIM/DMARC)
5. ⏳ Monitor email delivery
6. ⏳ Set up backend email service (optional)

## Support

**Brevo Support:** https://www.brevo.com/support
**Supabase Support:** https://supabase.com/support
**Documentation:** See files listed above

---

**Setup Time: ~30 minutes**
**Status: ✅ Ready to use**
