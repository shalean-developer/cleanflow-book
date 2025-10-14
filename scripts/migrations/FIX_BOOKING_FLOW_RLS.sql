-- =====================================================
-- FIX BOOKING FLOW DATA FETCHING ISSUES
-- =====================================================
-- Run this SQL script in your Supabase SQL Editor to fix
-- data fetching issues in the booking flow.
--
-- This will allow anonymous users to fetch services,
-- extras, and cleaners data needed for the booking process.
-- =====================================================

-- Step 1: Clean up conflicting policies
-- =====================================================
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
DROP POLICY IF EXISTS "Public can view active extras" ON public.extras;
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
DROP POLICY IF EXISTS "Public can view active cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Anyone can view cleaners" ON public.cleaners;

-- Step 2: Ensure RLS is enabled
-- =====================================================
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

-- Step 3: Create public read policies
-- =====================================================
-- These policies allow EVERYONE (including anonymous users) to read data

CREATE POLICY "Everyone can view all services"
ON public.services
FOR SELECT
TO public
USING (true);

CREATE POLICY "Everyone can view all extras"
ON public.extras
FOR SELECT
TO public
USING (true);

CREATE POLICY "Everyone can view all cleaners"
ON public.cleaners
FOR SELECT
TO public
USING (true);

-- Step 4: Ensure admin policies exist (for data management)
-- =====================================================

-- Services admin policies
CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Extras admin policies
CREATE POLICY "Admins can update extras"
ON public.extras
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert extras"
ON public.extras
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete extras"
ON public.extras
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the policies are working:

-- Check services policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'services'
ORDER BY policyname;

-- Check extras policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'extras'
ORDER BY policyname;

-- Check cleaners policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'cleaners'
ORDER BY policyname;

-- Test data fetch (should return results)
SELECT id, name, base_price FROM public.services LIMIT 5;
SELECT id, name, base_price FROM public.extras LIMIT 5;
SELECT id, name FROM public.cleaners LIMIT 5;

