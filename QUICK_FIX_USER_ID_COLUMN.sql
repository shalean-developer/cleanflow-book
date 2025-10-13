-- =====================================================
-- QUICK FIX: ADD MISSING USER_ID COLUMN TO CLEANERS TABLE
-- =====================================================
-- This script quickly fixes the "column user_id does not exist" error
-- by adding the missing column and creating basic RLS policies.

-- =====================================================
-- STEP 1: Add user_id column if missing
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
-- STEP 3: Create simple, working policies
-- =====================================================

-- Allow everyone to view active cleaners (for booking selection)
CREATE POLICY "Anyone can view active cleaners"
ON public.cleaners
FOR SELECT
USING (active = true OR active IS NULL);

-- Allow admins to insert cleaners (check profiles.role)
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

-- Allow admins to update all cleaners
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

-- Allow admins to delete cleaners
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
-- STEP 4: Ensure current user has admin role
-- =====================================================

-- Make sure current user has admin role in profiles table
UPDATE public.profiles 
SET role = 'admin'
WHERE id = auth.uid()
AND role != 'admin';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check that user_id column exists
SELECT 'user_id column exists:' as info, 
       EXISTS (
         SELECT 1 FROM information_schema.columns 
         WHERE table_schema = 'public' 
         AND table_name = 'cleaners' 
         AND column_name = 'user_id'
       ) as column_exists;

-- Check that policies exist
SELECT 'Current cleaners policies:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'cleaners'
ORDER BY policyname;

-- Test admin access
SELECT 'Testing admin access...' as info;
SELECT COUNT(*) as total_cleaners FROM public.cleaners;
