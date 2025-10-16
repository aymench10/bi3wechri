-- ============================================
-- FIX AUTHENTICATION SYSTEM
-- This ensures signup and login work for everyone
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Make sure the trigger function exists and works correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Make sure RLS policies are correct for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. Verify the setup
SELECT 
  'Trigger exists: ' || COUNT(*)::text as trigger_status
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

SELECT 
  'Function exists: ' || COUNT(*)::text as function_status
FROM pg_proc 
WHERE proname = 'handle_new_user';

SELECT 
  'RLS enabled: ' || relrowsecurity::text as rls_status
FROM pg_class 
WHERE relname = 'profiles';

-- 6. Test data - Check if profiles table is accessible
SELECT COUNT(*) as total_profiles FROM profiles;
