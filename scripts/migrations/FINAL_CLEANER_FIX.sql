-- =====================================================
-- FINAL CLEANER RLS FIX - NO CONFLICTS
-- =====================================================
-- This script fixes all RLS issues without using ON CONFLICT
-- to avoid constraint errors.

-- =====================================================
-- STEP 1: Add user_id column to cleaners table
-- =====================================================

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
DROP POLICY IF EXISTS "Active cleaners are viewable by everyone" ON public.cleaners;

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
-- STEP 5: Make current user admin (without ON CONFLICT)
-- =====================================================

-- Check if current user exists in profiles table
DO $$
BEGIN
  -- Insert current user as admin if they don't exist in profiles
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()) THEN
    INSERT INTO public.profiles (id, role, full_name, created_at)
    VALUES (auth.uid(), 'admin', 'Admin User', now());
  ELSE
    -- Update existing user to admin role
    UPDATE public.profiles 
    SET role = 'admin'
    WHERE id = auth.uid();
  END IF;
END $$;

-- =====================================================
-- STEP 6: Create user_roles table with proper constraints (if needed)
-- =====================================================

-- Create user_roles table with text type and proper constraints
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('customer', 'admin', 'cleaner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add unique constraint on user_id only (one role per user)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 7: Sync admin roles (without ON CONFLICT)
-- =====================================================

-- Insert admin role into user_roles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid()
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'admin');
  ELSE
    UPDATE public.user_roles 
    SET role = 'admin'
    WHERE user_id = auth.uid();
  END IF;
END $$;

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

-- Check that all policies exist
SELECT 'Current cleaners policies:' as info, policyname
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
