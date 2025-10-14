-- Quick fix for cleaners table access
-- This script ensures admins can access cleaners data

-- First, let's check if the cleaners table exists and has data
SELECT COUNT(*) as total_cleaners FROM public.cleaners;

-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'cleaners';

-- Drop all existing cleaners policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can view own profile" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can update own profile" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can manage cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
DROP POLICY IF EXISTS "Public can view active cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Everyone can view all cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can view all cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can insert cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can update cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can delete cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can view own cleaner profile" ON public.cleaners;

-- Create simple policies that work
-- Allow everyone to view cleaners (for booking selection)
CREATE POLICY "Enable read access for all users"
ON public.cleaners
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert cleaners (for admin)
CREATE POLICY "Enable insert for authenticated users"
ON public.cleaners
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update cleaners (for admin)
CREATE POLICY "Enable update for authenticated users"
ON public.cleaners
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete cleaners (for admin)
CREATE POLICY "Enable delete for authenticated users"
ON public.cleaners
FOR DELETE
TO authenticated
USING (true);

-- Test the access
SELECT 'Testing cleaners access...' as status;
SELECT COUNT(*) as cleaners_count FROM public.cleaners;
SELECT id, full_name, name, rating, active, created_at FROM public.cleaners LIMIT 3;
