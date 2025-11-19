# Authentication Quick Reference

## Quick Start

### 1. Use Auth in Components
```javascript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, profile, loading, signOut, isAdmin } = useAuth()
  
  if (loading) return <LoadingSpinner />
  if (!user) return <NotLoggedIn />
  
  return <div>Welcome {profile?.full_name}</div>
}
```

### 2. Protect Routes
```javascript
// In App.jsx
<Route path="create-ad" element={
  <ProtectedRoute>
    <CreateAd />
  </ProtectedRoute>
} />
```

### 3. Admin-Only Routes
```javascript
<Route path="admin" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

## Common Tasks

### Sign Up
```javascript
const { signUp } = useAuth()

const handleSignUp = async () => {
  const { data, error } = await signUp(
    'user@example.com',
    'password123',
    'John Doe',
    '+216 XX XXX XXX'
  )
  
  if (error) console.error(error)
  else navigate('/')
}
```

### Sign In
```javascript
const { signIn } = useAuth()

const handleSignIn = async () => {
  const { data, error } = await signIn(
    'user@example.com',
    'password123'
  )
  
  if (error) console.error(error)
  else navigate('/')
}
```

### Sign Out
```javascript
const { signOut } = useAuth()

const handleLogout = async () => {
  await signOut()
  navigate('/')
}
```

### Update Profile
```javascript
const { updateProfile } = useAuth()

const handleUpdateProfile = async () => {
  const { data, error } = await updateProfile({
    full_name: 'New Name',
    bio: 'My bio',
    avatar_url: 'https://...'
  })
  
  if (error) console.error(error)
  else console.log('Profile updated')
}
```

### Change Password
```javascript
const { updatePassword } = useAuth()

const handleChangePassword = async () => {
  const { data, error } = await updatePassword('newPassword123')
  
  if (error) console.error(error)
  else console.log('Password changed')
}
```

### Change Email
```javascript
const { updateEmail } = useAuth()

const handleChangeEmail = async () => {
  const { data, error } = await updateEmail('newemail@example.com')
  
  if (error) console.error(error)
  else console.log('Email changed')
}
```

## Context API Reference

### Available Properties
```javascript
const {
  user,              // Supabase user object
  profile,           // User profile from profiles table
  loading,           // Boolean: auth is initializing
  error,             // Error message string
  isAdmin,           // Boolean: user is admin
  isAuthenticated,   // Boolean: user is logged in
  signUp,            // Function: register new user
  signIn,            // Function: login user
  signOut,           // Function: logout user
  updateProfile,     // Function: update profile data
  updateEmail,       // Function: change email
  updatePassword     // Function: change password
} = useAuth()
```

### User Object Structure
```javascript
{
  id: 'uuid',
  email: 'user@example.com',
  email_confirmed_at: '2024-01-01T00:00:00Z',
  phone: '+216 XX XXX XXX',
  last_sign_in_at: '2024-01-01T00:00:00Z',
  app_metadata: {},
  user_metadata: {
    full_name: 'John Doe',
    phone: '+216 XX XXX XXX'
  }
}
```

### Profile Object Structure
```javascript
{
  id: 'uuid',
  full_name: 'John Doe',
  phone: '+216 XX XXX XXX',
  email: 'user@example.com',
  avatar_url: 'https://...',
  bio: 'My bio',
  role: 'user', // or 'admin'
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}
```

## Error Handling

### Common Errors
```javascript
const { data, error } = await signIn(email, password)

if (error) {
  if (error.message.includes('Invalid login credentials')) {
    // Wrong email or password
  } else if (error.message.includes('Email not confirmed')) {
    // User needs to confirm email
  } else if (error.message.includes('User not found')) {
    // Email not registered
  } else {
    // Other error
  }
}
```

## Session Persistence

Session automatically persists across page refreshes via `onAuthStateChange()` listener. No additional code needed!

```javascript
// This happens automatically in AuthContext
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      // Session restored automatically
    }
  )
  return () => subscription?.unsubscribe()
}, [])
```

## Protected Routes

### ProtectedRoute
Requires authentication. Redirects to login if not authenticated.

```javascript
<ProtectedRoute>
  <MyComponent />
</ProtectedRoute>
```

### AdminRoute
Requires authentication AND admin role. Shows access denied page if not admin.

```javascript
<AdminRoute>
  <AdminPanel />
</AdminRoute>
```

## Database Schema

### profiles Table
```sql
id (UUID) - Primary key, references auth.users
full_name (TEXT)
phone (TEXT)
email (TEXT)
avatar_url (TEXT)
bio (TEXT)
role (TEXT) - 'user' or 'admin'
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Debugging

### Check Current Auth State
```javascript
const { user, profile, loading } = useAuth()

console.log('User:', user)
console.log('Profile:', profile)
console.log('Loading:', loading)
console.log('Is Admin:', isAdmin)
```

### Check Session in Browser
```javascript
// In browser console
const { data } = await supabase.auth.getSession()
console.log(data.session)
```

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Authentication > Logs
3. Check for errors

## Testing Checklist

- [ ] Sign up creates user and profile
- [ ] Sign in restores session
- [ ] Session persists after refresh
- [ ] Protected routes redirect to login
- [ ] Admin routes show access denied
- [ ] Logout clears session
- [ ] Update profile works
- [ ] Change password works
- [ ] Change email works
- [ ] Error messages display correctly

## Common Issues

### Session Not Persisting
- Check localStorage is enabled
- Verify Supabase credentials
- Check browser console for errors

### Profile Not Loading
- Verify profiles table exists
- Check RLS policies
- Verify profile record created

### Protected Routes Not Working
- Ensure ProtectedRoute wraps component
- Check user is authenticated
- Verify loading state handled

### Email Confirmation Issues
- Check email provider in Supabase
- Verify email templates
- Check spam folder
