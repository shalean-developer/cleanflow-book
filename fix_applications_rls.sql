-- ============================================================================
-- FIX: Applications not showing in admin dashboard
-- ============================================================================
-- This script fixes RLS policies to allow admins to view applications
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Drop all existing SELECT policies on cleaner_applications
DROP POLICY IF EXISTS "Authenticated users can read applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Anyone can view applications" ON public.cleaner_applications;

-- Step 2: Create a comprehensive SELECT policy
-- This policy allows EITHER authenticated users OR checks for admin role
CREATE POLICY "Allow authenticated users to view applications"
ON public.cleaner_applications
FOR SELECT
USING (
  -- Allow if user is authenticated (backwards compatible)
  auth.role() = 'authenticated'
  OR
  -- OR if user has admin role in profiles
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Step 3: Ensure admin UPDATE policy exists (for status changes)
DROP POLICY IF EXISTS "Admins can update all applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.cleaner_applications;

CREATE POLICY "Admins can update applications"
ON public.cleaner_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Step 4: Ensure the INSERT policy exists (for public applications)
DROP POLICY IF EXISTS "Allow anyone to submit cleaner applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.cleaner_applications;

CREATE POLICY "Allow anyone to submit cleaner applications"
ON public.cleaner_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Step 5: Verify your user has admin role
-- IMPORTANT: Replace 'your-email@example.com' with your actual email
-- If you don't know your user ID, first run: SELECT id, email FROM auth.users;

-- Update profile table
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'  -- CHANGE THIS!
);

-- Also add to user_roles table (if it exists)
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        SELECT id INTO v_user_id FROM auth.users WHERE email = 'your-email@example.com';  -- CHANGE THIS!
        IF v_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'admin'::text) THEN
            INSERT INTO public.user_roles (user_id, role)
            VALUES (v_user_id, 'admin'::text);
        END IF;
    END IF;
END $$;

-- Step 6: Add helpful comments
COMMENT ON POLICY "Allow authenticated users to view applications" ON public.cleaner_applications IS 
'Allows authenticated users to view applications. Admin users can access via profiles.role check.';

COMMENT ON POLICY "Admins can update applications" ON public.cleaner_applications IS 
'Allows users with admin role in profiles table to update application status and notes.';

-- ============================================================================
-- VERIFICATION QUERY - Run this to confirm everything is working
-- ============================================================================
SELECT 
    'Applications visible to current user' as check_name,
    COUNT(*) as count
FROM cleaner_applications;

-- You should see the count of applications (should be 3 in your case)
-- If you still see 0, run the diagnostic script to check your admin status
-- ============================================================================

-- ============================================================================
-- TO MAKE A USER ADMIN (if needed):
-- ============================================================================
-- First, find your user ID:
-- SELECT id, email, role FROM profiles;
-- 
-- Then update to admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- ============================================================================

