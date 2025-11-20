# Supabase Email Authentication - Visual Setup Guide

## ⚠️ Current Issue
You're seeing: **"Email signups are disabled"**

This happens because email authentication is turned OFF in Supabase.

---

## 🎯 Solution: Enable Email Auth (5 minutes)

### Step 1️⃣: Open Supabase Dashboard
```
1. Go to: https://supabase.com/dashboard
2. Log in with your account
3. Click your project name (bi3wechri)
```

**You should see:**
```
Project: bi3wechri
├── Home
├── SQL Editor
├── Authentication  ← CLICK HERE
├── Database
├── Storage
└── ...
```

---

### Step 2️⃣: Go to Providers
```
Click: Authentication → Providers
```

**You should see a list of providers:**
```
✓ Email
✓ Google
✓ GitHub
✓ Discord
... and more
```

---

### Step 3️⃣: Enable Email Provider
```
Click on: Email
```

**You should see:**
```
┌─────────────────────────────────┐
│ Email                           │
├─────────────────────────────────┤
│ Enable Email provider      [ON] │  ← Toggle this to ON
│ Require email for signup   [✓]  │
│ Enable email confirmations [✓]  │
│ Email confirmation expiry: 86400│  ← Set to 86400
│ Password min length:       6    │
└─────────────────────────────────┘
```

**Make sure:**
- ✅ Enable Email provider = **ON**
- ✅ Require email for signup = **Checked**
- ✅ Enable email confirmations = **Checked**
- ✅ Email confirmation expiry = **86400** (24 hours)

---

### Step 4️⃣: Save Settings
```
Click: SAVE button at bottom
```

**Wait for confirmation message:**
```
✓ Settings saved successfully
```

---

### Step 5️⃣: Configure Redirect URLs
```
Click: Authentication → URL Configuration
```

**Add these URLs:**
```
Redirect URLs:
├── http://localhost:3000
├── http://localhost:3000/auth/reset-password
├── http://localhost:5173 (if needed)
└── https://yourdomain.com (production)
```

**Click: SAVE**

---

### Step 6️⃣: (Optional) Configure SMTP
If you want emails sent from your account:

```
Click: Authentication → Email Templates
Click: SMTP Settings
```

**Choose provider:**
```
SMTP Provider:
├── Brevo (recommended for Tunisia)
├── Mailgun
├── SendGrid
└── AWS SES
```

**Enter credentials and click: TEST**

---

## ✅ Test It Works

### Step 1: Go to Signup
```
URL: http://localhost:3000/signup
```

### Step 2: Fill Form
```
Full Name:    Chebili Aymen
Email:        aymenchebili19@gmail.com
Phone:        21621234567
Password:     Password123
```

### Step 3: Click Sign Up
```
Button: Sign Up
```

### Step 4: Check Result
**You should see:**
```
✓ Account created successfully!
✓ Please check your email to confirm your account
```

### Step 5: Check Email
```
1. Open your email inbox
2. Look for: "Confirm your email"
3. Click the link
4. You'll be redirected to login page
5. Log in with your credentials
```

---

## 🐛 Troubleshooting

### Problem: "Email signups are disabled" still shows
**Solution:**
1. Hard refresh: **Ctrl+Shift+R**
2. Clear browser cache: **Ctrl+Shift+Delete**
3. Close and reopen browser
4. Try again

### Problem: Email not arriving
**Solution:**
1. Check spam/junk folder
2. Wait 2-3 minutes
3. Try with Gmail or Outlook
4. Check Supabase logs:
   ```
   Authentication → Logs
   ```

### Problem: "Invalid email" error
**Solution:**
- Make sure email is valid: `user@example.com`
- No spaces before/after
- Use real email address

### Problem: Redirect URL error
**Solution:**
1. Go to: Authentication → URL Configuration
2. Make sure URLs are exactly:
   - `http://localhost:3000` (not `http://localhost:3000/`)
   - `http://localhost:3000/auth/reset-password`
3. Click SAVE

---

## 📋 Quick Checklist

- [ ] Opened Supabase dashboard
- [ ] Went to Authentication → Providers
- [ ] Clicked on Email provider
- [ ] Toggled "Enable Email provider" to ON
- [ ] Set email confirmation expiry to 86400
- [ ] Clicked SAVE
- [ ] Went to Authentication → URL Configuration
- [ ] Added redirect URLs
- [ ] Clicked SAVE
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tried signing up again
- [ ] Checked email for confirmation link
- [ ] Clicked confirmation link
- [ ] Logged in successfully

---

## 🎉 Success!
After these steps, you should be able to:
- ✅ Sign up with email
- ✅ Receive confirmation email
- ✅ Confirm email and log in
- ✅ Access My Ads, Create Ad, Profile, etc.

---

## 📞 Still Having Issues?
1. Check browser console: **F12 → Console**
2. Look for error messages
3. Check Supabase logs: **Authentication → Logs**
4. Share the error message with developer
