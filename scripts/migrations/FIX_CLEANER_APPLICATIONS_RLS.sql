-- ============================================================================
-- FIX FOR: "new row violates row-level security policy for table 'cleaner_applications'"
-- ============================================================================
-- This script fixes the RLS policy issue preventing job applications from being submitted
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Drop any existing INSERT policies that might be conflicting
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Allow public to insert applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Allow anyone to submit cleaner applications" ON public.cleaner_applications;

-- Step 2: Ensure RLS is enabled on the table
ALTER TABLE public.cleaner_applications ENABLE ROW LEVEL SECURITY;

-- Step 3: Create a new INSERT policy that allows ANYONE (including anonymous users) to submit applications
-- This is crucial because job applicants don't have user accounts yet
CREATE POLICY "Allow anyone to submit cleaner applications"
ON public.cleaner_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Step 4: Verify storage policies for application file uploads
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can upload application files" ON storage.objects;

-- Create storage policy for uploads
CREATE POLICY "Anyone can upload application files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'applications');

-- Step 5: Ensure the storage bucket exists and is configured correctly
-- Update bucket settings if needed (this won't error if bucket doesn't exist)
UPDATE storage.buckets 
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
WHERE id = 'applications';

-- If bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'applications',
  'applications',
  true,
  5242880,
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Step 6: Add helpful comments
COMMENT ON POLICY "Allow anyone to submit cleaner applications" ON public.cleaner_applications IS 
'Allows anyone, including anonymous users, to submit job applications. Applicants do not have user accounts at the time of application.';

-- ============================================================================
-- Verification Query - Run this to confirm the policy exists
-- ============================================================================
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
WHERE tablename = 'cleaner_applications' 
AND cmd = 'INSERT'
ORDER BY policyname;

-- You should see a row with:
-- policyname: "Allow anyone to submit cleaner applications"
-- cmd: INSERT
-- with_check: true
-- ============================================================================

