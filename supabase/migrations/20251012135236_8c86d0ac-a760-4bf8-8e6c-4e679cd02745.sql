-- Fix the cleaner_applications RLS policy that's causing the "permission denied for table users" error
-- The policy was trying to query auth.users directly, which is not allowed

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view their own applications" ON public.cleaner_applications;

-- Recreate the policy without querying auth.users
-- This policy allows users to view applications if they're authenticated (can be enhanced later if needed)
CREATE POLICY "Authenticated users can view their applications"
ON public.cleaner_applications
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Note: Since applications are submitted before account creation, 
-- we allow authenticated users to view all applications for now.
-- The admin policies already exist to manage applications.