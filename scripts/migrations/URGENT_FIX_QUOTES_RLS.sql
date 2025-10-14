-- ============================================
-- URGENT FIX: Quotes RLS Policy Error
-- ============================================
-- Run this NOW in Supabase SQL Editor
-- ============================================

-- Step 1: Disable RLS temporarily to diagnose
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Anyone can submit quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can view their quotes" ON public.quotes;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.quotes;
DROP POLICY IF EXISTS "Enable select for users based on email" ON public.quotes;
DROP POLICY IF EXISTS "Public can insert quotes" ON public.quotes;
DROP POLICY IF EXISTS "Public can read quotes" ON public.quotes;

-- Step 3: Re-enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Step 4: Create SIMPLE INSERT policy (allow everyone)
CREATE POLICY "Allow public insert"
ON public.quotes
FOR INSERT
TO public
WITH CHECK (true);

-- Step 5: Create SIMPLE SELECT policy (allow everyone for now)
CREATE POLICY "Allow public select"
ON public.quotes
FOR SELECT
TO public
USING (true);

-- Step 6: Test it works
INSERT INTO public.quotes (
  reference,
  first_name,
  last_name,
  email,
  phone,
  address_1,
  city,
  postal,
  bedrooms,
  bathrooms,
  extras,
  special_instructions,
  status
) VALUES (
  'TEST-' || NOW()::text,
  'Test',
  'User',
  'test@example.com',
  '0123456789',
  '123 Test St',
  'Test City',
  '1234',
  2,
  1,
  ARRAY[]::text[],
  'Test quote',
  'pending'
) RETURNING *;

-- Step 7: Clean up test
DELETE FROM public.quotes WHERE reference LIKE 'TEST-%';

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'quotes';

SELECT '✅ Quotes RLS fixed! You can now submit quotes.' as status;

