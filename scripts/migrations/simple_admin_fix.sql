-- Simple Admin Role Fix
-- This script fixes the admin role assignment without constraint conflicts

-- Step 1: Check current state
SELECT 
  'Current State' as step,
  u.id, 
  u.email, 
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

-- Step 3: Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'cleaner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Delete existing admin role (if any)
DELETE FROM public.user_roles 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@shalean.com');

-- Step 6: Insert admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'admin@shalean.com';

-- Step 7: Update or insert admin profile
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

-- Step 8: Create basic RLS policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Step 9: Verify the fix
SELECT 
  'After Fix' as step,
  u.email,
  p.role as profile_role,
  ur.role as user_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'admin@shalean.com';
