# Authentication Implementation Guide

## Overview
This document outlines the comprehensive Supabase authentication system implemented in the Bi3wEchri marketplace application.

## Architecture

### 1. AuthContext (`src/contexts/AuthContext.jsx`)
The central authentication state management system using React Context API.

**Key Features:**
- Session persistence using `supabase.auth.onAuthStateChange()`
- Automatic profile fetching and management
- Comprehensive error handling
- User profile data synchronization with `profiles` table

**Exported Methods:**
```javascript
{
  user,              // Current authenticated user (from Supabase Auth)
  profile,           // User profile data (from profiles table)
  loading,           // Loading state during auth initialization
  error,             // Error messages from auth operations
  signUp,            // Register new user with email/password
  signIn,            // Login with email/password
  signOut,           // Logout user
  updateProfile,     // Update user profile data
  updateEmail,       // Update user email
  updatePassword,    // Update user password
  isAdmin,           // Boolean: true if user role is 'admin'
  isAuthenticated    // Boolean: true if user is logged in
}
```

### 2. Protected Routes

#### ProtectedRoute (`src/components/ProtectedRoute.jsx`)
Wraps components that require authentication.

**Usage:**
```jsx
<Route path="create-ad" element={
  <ProtectedRoute>
    <CreateAd />
  </ProtectedRoute>
} />
```

**Behavior:**
- Shows loading spinner while verifying session
- Redirects to `/login` if user is not authenticated
- Renders component if user is authenticated

#### AdminRoute (`src/components/AdminRoute.jsx`)
Wraps components that require admin privileges.

**Usage:**
```jsx
<Route path="admin" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

**Behavior:**
- Shows loading spinner while verifying session
- Redirects to `/login` if user is not authenticated
- Shows "Access Denied" page if user is not admin
- Renders component if user is admin

## Authentication Flow

### Sign Up Flow
```
1. User enters email, password, full name, phone
2. signUp() creates auth user in Supabase Auth
3. Profile record created in profiles table
4. Session established automatically
5. User redirected to home or login confirmation page
```

**Implementation:**
```javascript
const { data, error } = await signUp(email, password, fullName, phone)
if (error) {
  // Handle error
} else {
  // User created successfully
  navigate('/')
}
```

### Sign In Flow
```
1. User enters email and password
2. signIn() authenticates with Supabase Auth
3. Session established
4. Profile data fetched from profiles table
5. User redirected to home
```

**Implementation:**
```javascript
const { data, error } = await signIn(email, password)
if (error) {
  // Handle error
} else {
  // User logged in successfully
  navigate('/')
}
```

### Session Persistence
```
1. App initializes
2. AuthContext checks for existing session
3. If session exists, user and profile are restored
4. onAuthStateChange() listener monitors for changes
5. Session persists across page refreshes
```

### Sign Out Flow
```
1. User clicks logout
2. signOut() clears session
3. User and profile state cleared
4. User redirected to home
```

**Implementation:**
```javascript
const { error } = await signOut()
if (error) {
  // Handle error
} else {
  // User logged out successfully
  navigate('/')
}
```

## Database Schema

### profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies
```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Usage Examples

### In Components

#### Using useAuth Hook
```javascript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, profile, loading, signOut, isAdmin } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {profile?.full_name}</h1>
      {isAdmin && <div>Admin Panel</div>}
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

#### Updating User Profile
```javascript
const { updateProfile } = useAuth()

const handleUpdateProfile = async () => {
  const { data, error } = await updateProfile({
    full_name: 'New Name',
    bio: 'My bio',
    avatar_url: 'https://...'
  })

  if (error) {
    console.error('Update failed:', error)
  } else {
    console.log('Profile updated:', data)
  }
}
```

#### Changing Password
```javascript
const { updatePassword } = useAuth()

const handleChangePassword = async (newPassword) => {
  const { data, error } = await updatePassword(newPassword)

  if (error) {
    console.error('Password change failed:', error)
  } else {
    console.log('Password updated successfully')
  }
}
```

#### Changing Email
```javascript
const { updateEmail } = useAuth()

const handleChangeEmail = async (newEmail) => {
  const { data, error } = await updateEmail(newEmail)

  if (error) {
    console.error('Email change failed:', error)
  } else {
    console.log('Email updated successfully')
  }
}
```

## Error Handling

All auth methods return error objects that can be handled:

```javascript
const { data, error } = await signIn(email, password)

if (error) {
  if (error.message.includes('Invalid login credentials')) {
    // Show "Invalid email or password" message
  } else if (error.message.includes('Email not confirmed')) {
    // Show "Please confirm your email" message
  } else {
    // Show generic error message
  }
}
```

## Security Best Practices

1. **Never store passwords in state** - Supabase handles this securely
2. **Use HTTPS only** - All auth requests must be over HTTPS
3. **Enable email confirmation** - Require users to confirm email before login
4. **Use strong passwords** - Enforce password requirements
5. **Implement rate limiting** - Prevent brute force attacks
6. **Use RLS policies** - Restrict database access at the row level
7. **Validate on backend** - Never trust client-side validation alone
8. **Refresh tokens** - Sessions automatically refresh with Supabase

## Supabase Configuration

### Environment Variables
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Auth Settings
1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates
4. Set up email confirmation (optional but recommended)
5. Configure redirect URLs for OAuth (if using social login)

## Testing Authentication

### Manual Testing Checklist
- [ ] Sign up with new email
- [ ] Verify profile created in database
- [ ] Sign in with correct credentials
- [ ] Sign in with incorrect credentials (should fail)
- [ ] Session persists after page refresh
- [ ] Protected routes redirect to login when not authenticated
- [ ] Admin routes show access denied for non-admin users
- [ ] Logout clears session and redirects
- [ ] Update profile works correctly
- [ ] Change password works correctly
- [ ] Change email works correctly

## Troubleshooting

### Session Not Persisting
- Check browser localStorage is enabled
- Verify Supabase URL and key are correct
- Check browser console for errors

### Profile Not Loading
- Verify profiles table exists and has correct schema
- Check RLS policies allow user to read their profile
- Verify profile record was created during signup

### Protected Routes Not Working
- Ensure ProtectedRoute component is wrapping the route
- Check that user is actually authenticated
- Verify loading state is being handled

### Email Confirmation Issues
- Check email provider configuration in Supabase
- Verify email templates are configured
- Check spam folder for confirmation emails

## Future Enhancements

1. **Social Login** - Add Google, GitHub, Facebook login
2. **Two-Factor Authentication** - Implement 2FA for security
3. **Magic Links** - Passwordless authentication
4. **Session Management** - Multiple device sessions
5. **Audit Logging** - Track auth events
6. **Rate Limiting** - Prevent brute force attacks
7. **IP Whitelisting** - Restrict login by IP
8. **Device Fingerprinting** - Detect suspicious logins
