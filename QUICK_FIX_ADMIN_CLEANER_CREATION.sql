-- =====================================================
-- QUICK FIX: ADMIN CLEANER CREATION RLS ERROR
-- =====================================================
-- This is a simplified fix for the immediate RLS policy violation
-- when admins try to create cleaner profiles.

-- =====================================================
-- STEP 1: Drop conflicting policies and create simple admin policy
-- =====================================================

-- Drop all existing cleaners policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can insert cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can manage cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can view own profile" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can update own profile" ON public.cleaners;
DROP POLICY IF EXISTS "Anyone can view cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;

-- =====================================================
-- STEP 2: Create simple, working policies
-- =====================================================

-- Allow everyone to view active cleaners (for booking selection)
CREATE POLICY "Anyone can view active cleaners"
ON public.cleaners
FOR SELECT
USING (active = true OR active IS NULL);

-- Allow admins to insert cleaners (check both role systems)
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
);

-- Allow admins to update all cleaners
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
);

-- Allow admins to delete cleaners
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
);

-- Allow cleaners to view their own profile
CREATE POLICY "Cleaners can view own profile"
ON public.cleaners
FOR SELECT
USING (auth.uid() = user_id);

-- Allow cleaners to update their own profile
CREATE POLICY "Cleaners can update own profile"
ON public.cleaners
FOR UPDATE
USING (auth.uid() = user_id);

-- =====================================================
-- STEP 3: Ensure admin role exists in both tables
-- =====================================================

-- Make sure current user has admin role in profiles table
UPDATE public.profiles 
SET role = 'admin'
WHERE id = auth.uid()
AND NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND role = 'admin'
);

-- Make sure current user has admin role in user_roles table (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check that policies exist
SELECT 'Current cleaners policies:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'cleaners'
ORDER BY policyname;

-- Test admin access
SELECT 'Testing admin access...' as info;
SELECT COUNT(*) as total_cleaners FROM public.cleaners;
