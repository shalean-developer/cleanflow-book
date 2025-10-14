-- =====================================================
-- AUTH SESSION REFRESH FIX - DATABASE MIGRATION
-- =====================================================
-- This migration ensures robust auth restoration by:
-- 1. Creating profiles table with proper structure
-- 2. Setting up RLS policies for secure access
-- 3. Auto-creating profile on user signup
-- 4. Ensuring every user has a profile row
-- =====================================================

-- ==================
-- 1. PROFILES TABLE
-- ==================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'customer',
  full_name text,
  avatar_url text,
  phone text,
  address text,
  city text,
  postal_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==================
-- 2. RLS POLICIES
-- ==================

-- Drop existing policies if they exist (to ensure clean state)
DROP POLICY IF EXISTS "read own profile" ON public.profiles;
DROP POLICY IF EXISTS "update own profile" ON public.profiles;
DROP POLICY IF EXISTS "insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Users can read their own profile
CREATE POLICY "read own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "update own profile" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "insert own profile" ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "admins can read all profiles" ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ==================
-- 3. AUTO-INSERT TRIGGER
-- ==================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ==================
-- 4. BACKFILL EXISTING USERS
-- ==================

-- Create profiles for any existing users that don't have one
INSERT INTO public.profiles (id, full_name, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  'customer'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- ==================
-- 5. UPDATE TIMESTAMP TRIGGER
-- ==================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==================
-- 6. VERIFICATION
-- ==================

-- Verify the setup
DO $$
DECLARE
  profile_count int;
  user_count int;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  RAISE NOTICE 'Migration complete!';
  RAISE NOTICE 'Users: %, Profiles: %', user_count, profile_count;
  
  IF profile_count < user_count THEN
    RAISE WARNING 'Some users are missing profiles. This should not happen.';
  END IF;
END $$;

-- ==================
-- NOTES
-- ==================

/*
After running this migration:

1. Every new user will automatically get a profile with role='customer'
2. All existing users have been backfilled with profiles
3. RLS is enabled - users can only see/edit their own profiles
4. Admins can view all profiles (via user_roles table check)
5. The updated_at timestamp automatically updates on profile changes

To verify everything works:

-- Check profiles exist for all users
SELECT 
  COUNT(*) as total_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles
FROM auth.users;

-- Check RLS is working (should only see your own profile)
SELECT * FROM profiles;

-- Test profile creation (as admin)
-- Should see the new profile in the profiles table

Next steps:
1. Ensure your frontend uses the new AuthProvider with INITIAL_SESSION
2. Use the ProtectedRoute component for dashboard routes
3. Test the fail-safe timeout by blocking localStorage
*/

