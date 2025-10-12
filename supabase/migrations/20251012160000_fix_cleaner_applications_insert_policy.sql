-- Fix RLS policy for cleaner_applications INSERT operation
-- This ensures anyone (including anonymous users) can submit job applications

-- Drop any existing INSERT policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Allow public to insert applications" ON public.cleaner_applications;

-- Create a new INSERT policy that allows anyone (including anonymous users) to submit applications
-- This is necessary because job applicants don't have accounts yet
CREATE POLICY "Allow anyone to submit cleaner applications"
ON public.cleaner_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Ensure the table has RLS enabled
ALTER TABLE public.cleaner_applications ENABLE ROW LEVEL SECURITY;

-- Verify storage policies are also set up correctly for application files
DROP POLICY IF EXISTS "Anyone can upload application files" ON storage.objects;
CREATE POLICY "Anyone can upload application files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'applications');

-- Add a comment explaining why this policy allows public access
COMMENT ON POLICY "Allow anyone to submit cleaner applications" ON public.cleaner_applications IS 
'Allows anyone, including anonymous users, to submit job applications. This is necessary because applicants do not have accounts at the time of application.';

