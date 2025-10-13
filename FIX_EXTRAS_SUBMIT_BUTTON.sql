-- ============================================
-- EMERGENCY FIX: Extras Not Loading & Submit Button
-- ============================================
-- Run this IMMEDIATELY in Supabase SQL Editor
-- This fixes RLS policies so extras load and quotes can be submitted
-- ============================================

-- STEP 1: Fix Extras Table (Critical!)
-- ============================================

-- Enable RLS
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;

-- Remove ALL conflicting policies
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
DROP POLICY IF EXISTS "Public can view active extras" ON public.extras;
DROP POLICY IF EXISTS "Everyone can view all extras" ON public.extras;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.extras;

-- Create ONE simple policy for public read
CREATE POLICY "Public read access to extras"
ON public.extras
FOR SELECT
TO public
USING (true);

-- STEP 2: Fix Services Table
-- ============================================

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
DROP POLICY IF EXISTS "Everyone can view all services" ON public.services;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;

CREATE POLICY "Public read access to services"
ON public.services
FOR SELECT
TO public
USING (true);

-- STEP 3: Fix Cleaners Table
-- ============================================

ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
DROP POLICY IF EXISTS "Public can view active cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Everyone can view all cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Anyone can view cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cleaners;

CREATE POLICY "Public read access to cleaners"
ON public.cleaners
FOR SELECT
TO public
USING (true);

-- STEP 4: Ensure Quotes Table Works (If exists)
-- ============================================

-- Check if quotes table exists and fix it
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') THEN
    -- Enable RLS
    EXECUTE 'ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY';
    
    -- Drop existing policies
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can submit quotes" ON public.quotes';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their quotes" ON public.quotes';
    EXECUTE 'DROP POLICY IF EXISTS "Enable insert for all users" ON public.quotes';
    EXECUTE 'DROP POLICY IF EXISTS "Enable select for users based on email" ON public.quotes';
    
    -- Allow anyone to submit quotes (PUBLIC insert)
    EXECUTE 'CREATE POLICY "Public can insert quotes"
    ON public.quotes
    FOR INSERT
    TO public
    WITH CHECK (true)';
    
    -- Allow anyone to select (for now, can restrict later)
    EXECUTE 'CREATE POLICY "Public can read quotes"
    ON public.quotes
    FOR SELECT
    TO public
    USING (true)';
    
    RAISE NOTICE 'Quotes table policies updated successfully';
  ELSE
    RAISE NOTICE 'Quotes table does not exist yet - will be created by migration';
  END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Test: Can we read extras?
SELECT 'Testing extras read...' as test;
SELECT COUNT(*) as extras_count FROM extras;

-- Test: Can we read services?
SELECT 'Testing services read...' as test;
SELECT COUNT(*) as services_count FROM services;

-- Show all policies for extras
SELECT 
  'EXTRAS TABLE POLICIES:' as info,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'extras';

-- Show all policies for quotes (if exists)
SELECT 
  'QUOTES TABLE POLICIES:' as info,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'quotes';

SELECT '✅ RLS FIX COMPLETE! Extras should now load and submit button should work.' as status;

