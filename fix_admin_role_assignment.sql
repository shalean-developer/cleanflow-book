-- =============================================
-- Fix Admin Role Assignment for admin@shalean.com
-- =============================================
-- This script ensures the admin user has proper role assignment

-- Step 1: Check current state
SELECT 
  'Current State Check' as step,
  u.id, 
  u.email, 
  u.created_at,
  p.full_name,
  p.role as profile_role,
  ur.role as user_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'admin@shalean.com';

-- Step 2: Ensure app_role enum exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('customer', 'admin', 'cleaner');
  END IF;
END $$;

-- Step 3: Ensure user_roles table exists with proper structure
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_roles if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Ensure profiles table has proper structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'cleaner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create or update admin profile
INSERT INTO public.profiles (id, full_name, role)
SELECT 
  id, 
  'Admin User',
  'admin'
FROM auth.users 
WHERE email = 'admin@shalean.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = now();

-- Step 6: Create or update admin role in user_roles table
-- First, delete any existing role for this user to avoid conflicts
DELETE FROM public.user_roles 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@shalean.com');

-- Then insert the admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'admin@shalean.com';

-- Step 7: Ensure RLS policies exist for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Step 8: Ensure RLS policies exist for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Step 9: Verify the fix
SELECT 
  'After Fix Verification' as step,
  u.email,
  u.id as user_id,
  p.full_name,
  p.role as profile_role,
  ur.role as user_role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'admin@shalean.com';

-- Step 10: Test the has_role function if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'has_role' AND routine_schema = 'public') THEN
    PERFORM public.has_role(
      (SELECT id FROM auth.users WHERE email = 'admin@shalean.com'), 
      'admin'::public.app_role
    );
    RAISE NOTICE 'has_role function test: admin@shalean.com has admin role = %', 
      public.has_role(
        (SELECT id FROM auth.users WHERE email = 'admin@shalean.com'), 
        'admin'::public.app_role
      );
  END IF;
END $$;
