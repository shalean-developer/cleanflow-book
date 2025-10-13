-- =====================================================
-- FIX TYPE MISMATCH ERROR: text = app_role
-- =====================================================
-- This script fixes the type mismatch error between text and app_role
-- by creating a simple solution that works with the existing table structure.

-- =====================================================
-- STEP 1: Add user_id column to cleaners table if missing
-- =====================================================

-- Add user_id column to cleaners table if it doesn't exist
ALTER TABLE public.cleaners 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cleaners_user_id ON public.cleaners(user_id);

-- =====================================================
-- STEP 2: Drop all existing cleaners policies
-- =====================================================

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
-- STEP 3: Create simple RLS policies that avoid type conflicts
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

-- Policy 4: Admins can view all cleaners (using profiles.role only)
CREATE POLICY "Admins can view all cleaners"
ON public.cleaners
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 5: Admins can insert cleaners (using profiles.role only)
CREATE POLICY "Admins can insert cleaners"
ON public.cleaners
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 6: Admins can update all cleaners (using profiles.role only)
CREATE POLICY "Admins can update all cleaners"
ON public.cleaners
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 7: Admins can delete cleaners (using profiles.role only)
CREATE POLICY "Admins can delete cleaners"
ON public.cleaners
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- STEP 4: Ensure profiles table has role column
-- =====================================================

-- Add role column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'cleaner'));

-- =====================================================
-- STEP 5: Ensure current user has admin role in profiles
-- =====================================================

-- Make sure current user has admin role in profiles table
UPDATE public.profiles 
SET role = 'admin'
WHERE id = auth.uid()
AND role != 'admin';

-- =====================================================
-- STEP 6: Optional - Create user_roles table with text type (if needed)
-- =====================================================

-- Create user_roles table with text type (to avoid app_role enum conflicts)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('customer', 'admin', 'cleaner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a simple has_role function that works with text
CREATE OR REPLACE FUNCTION public.has_role_text(_user_id UUID, _role text)
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
-- STEP 7: Sync admin roles between profiles and user_roles
-- =====================================================

-- Ensure admin users have roles in both tables
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM public.profiles 
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- =====================================================
-- STEP 8: Verification queries
-- =====================================================

-- Check that user_id column exists
SELECT 'user_id column exists:' as info, 
       EXISTS (
         SELECT 1 FROM information_schema.columns 
         WHERE table_schema = 'public' 
         AND table_name = 'cleaners' 
         AND column_name = 'user_id'
       ) as column_exists;

-- Check that all policies exist
SELECT 'Current cleaners policies:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'cleaners'
ORDER BY policyname;

-- Check admin users in profiles table
SELECT 'Admin users in profiles:' as info;
SELECT id, role, full_name FROM public.profiles WHERE role = 'admin';

-- Check admin users in user_roles table
SELECT 'Admin users in user_roles:' as info;
SELECT user_id, role FROM public.user_roles WHERE role = 'admin';

-- Test admin access
SELECT 'Testing admin access...' as info;
SELECT COUNT(*) as total_cleaners FROM public.cleaners;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
-- After running this script:
-- 1. The user_id column will be added to cleaners table
-- 2. All RLS policies will use profiles.role (avoiding type conflicts)
-- 3. Admins should be able to create cleaner profiles without errors
-- 4. Both profiles.role and user_roles.role tables are supported
-- 5. No more type mismatch errors between text and app_role
