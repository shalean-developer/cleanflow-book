-- =====================================================
-- ULTRA SIMPLE CLEANER RLS FIX
-- =====================================================
-- This script fixes the RLS error by using only the profiles.role system
-- and avoiding all type conflicts and complex role checking.

-- =====================================================
-- STEP 1: Add user_id column to cleaners table
-- =====================================================

ALTER TABLE public.cleaners 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

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
-- STEP 3: Create simple policies using only profiles.role
-- =====================================================

-- Anyone can view active cleaners
CREATE POLICY "Anyone can view active cleaners"
ON public.cleaners
FOR SELECT
USING (active = true OR active IS NULL);

-- Admins can insert cleaners
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

-- Admins can update all cleaners
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

-- Admins can delete cleaners
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

-- Cleaners can view their own profile
CREATE POLICY "Cleaners can view own profile"
ON public.cleaners
FOR SELECT
USING (auth.uid() = user_id);

-- Cleaners can update their own profile
CREATE POLICY "Cleaners can update own profile"
ON public.cleaners
FOR UPDATE
USING (auth.uid() = user_id);

-- =====================================================
-- STEP 4: Ensure profiles table has role column
-- =====================================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer';

-- =====================================================
-- STEP 5: Make current user admin
-- =====================================================

UPDATE public.profiles 
SET role = 'admin'
WHERE id = auth.uid();

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Test that policies work
SELECT 'Testing admin access...' as info;
SELECT COUNT(*) as total_cleaners FROM public.cleaners;

-- Show current policies
SELECT 'Current cleaners policies:' as info, policyname
FROM pg_policies 
WHERE tablename = 'cleaners'
ORDER BY policyname;
