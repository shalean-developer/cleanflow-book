-- =====================================================
-- FIX ADMIN CLEANER CREATION RLS POLICY
-- =====================================================
-- This script fixes the RLS policy error that prevents admins
-- from creating cleaner profiles in the cleaners table.

-- Problem: Conflicting RLS policies on cleaners table - some use has_role() 
-- function, others use profiles.role, causing policy violations.

-- Solution: Replace all cleaners table policies with unified policies that
-- check both role systems (profiles.role and user_roles.role) for maximum compatibility.

-- =====================================================
-- STEP 1: Drop all existing cleaners policies
-- =====================================================

-- Drop all existing policies on cleaners table
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can view own profile" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can update own profile" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can insert cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can update cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can delete cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can manage cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Anyone can view cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can view own cleaner profile" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can view all cleaners" ON public.cleaners;

-- =====================================================
-- STEP 2: Create unified RLS policies for cleaners table
-- =====================================================

-- Policy 1: Anyone can view active cleaners (for booking selection)
CREATE POLICY "Anyone can view active cleaners"
ON public.cleaners
FOR SELECT
USING (active = true OR active IS NULL);

-- Policy 2: Cleaners can view their own profile
CREATE POLICY "Cleaners can view own profile"
ON public.cleaners
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 3: Cleaners can update their own profile
CREATE POLICY "Cleaners can update own profile"
ON public.cleaners
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy 4: Admins can view all cleaners
CREATE POLICY "Admins can view all cleaners"
ON public.cleaners
FOR SELECT
USING (
  -- Check profiles.role for admin
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR
  -- Check user_roles.role for admin (if table exists)
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
  OR
  -- Check has_role function for admin (if function exists)
  EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'has_role' 
    AND routine_schema = 'public'
  ) AND public.has_role(auth.uid(), 'admin')
);

-- Policy 5: Admins can insert cleaners (CREATE)
CREATE POLICY "Admins can insert cleaners"
ON public.cleaners
FOR INSERT
WITH CHECK (
  -- Check profiles.role for admin
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR
  -- Check user_roles.role for admin (if table exists)
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
  OR
  -- Check has_role function for admin (if function exists)
  EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'has_role' 
    AND routine_schema = 'public'
  ) AND public.has_role(auth.uid(), 'admin')
);

-- Policy 6: Admins can update all cleaners
CREATE POLICY "Admins can update all cleaners"
ON public.cleaners
FOR UPDATE
USING (
  -- Check profiles.role for admin
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR
  -- Check user_roles.role for admin (if table exists)
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
  OR
  -- Check has_role function for admin (if function exists)
  EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'has_role' 
    AND routine_schema = 'public'
  ) AND public.has_role(auth.uid(), 'admin')
);

-- Policy 7: Admins can delete cleaners
CREATE POLICY "Admins can delete cleaners"
ON public.cleaners
FOR DELETE
USING (
  -- Check profiles.role for admin
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
  OR
  -- Check user_roles.role for admin (if table exists)
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
  OR
  -- Check has_role function for admin (if function exists)
  EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'has_role' 
    AND routine_schema = 'public'
  ) AND public.has_role(auth.uid(), 'admin')
);

-- =====================================================
-- STEP 3: Ensure user_roles table and has_role function exist
-- =====================================================

-- Create app_role enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('customer', 'admin', 'cleaner');
  END IF;
END $$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role function if it doesn't exist
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- =====================================================
-- STEP 4: Sync admin roles between profiles and user_roles
-- =====================================================

-- Ensure admin users have roles in both tables
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM public.profiles 
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- Update profiles table with admin roles from user_roles (if user_roles exists)
UPDATE public.profiles 
SET role = 'admin'
WHERE id IN (
  SELECT user_id FROM public.user_roles 
  WHERE role = 'admin'
);

-- =====================================================
-- STEP 5: Verification queries
-- =====================================================

-- Check that all policies exist
SELECT 'Current cleaners policies:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'cleaners'
ORDER BY policyname;

-- Check admin users in both tables
SELECT 'Admin users in profiles:' as info;
SELECT id, role, full_name FROM public.profiles WHERE role = 'admin';

SELECT 'Admin users in user_roles:' as info;
SELECT user_id, role FROM public.user_roles WHERE role = 'admin';

-- Test admin access by checking if current user can view cleaners
SELECT 'Testing admin access to cleaners table...' as info;
SELECT COUNT(*) as total_cleaners FROM public.cleaners;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
-- After running this script:
-- 1. Admins should be able to create cleaner profiles without RLS errors
-- 2. All role systems (profiles.role, user_roles.role, has_role function) are supported
-- 3. Cleaners can still view and update their own profiles
-- 4. Anyone can view active cleaners for booking selection
-- 5. Admins have full CRUD access to all cleaners
