-- Fix RLS policy for promo_claims table to allow Edge Functions (service role) to insert claims
-- The current policy only allows authenticated users to insert their own claims,
-- but Edge Functions need to insert claims on behalf of users

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert their own claims" ON public.promo_claims;

-- Create a new policy that allows:
-- 1. Authenticated users to insert their own claims
-- 2. Service role (Edge Functions) to insert any claims
CREATE POLICY "Users and service role can insert claims"
ON public.promo_claims
FOR INSERT
WITH CHECK (
  -- Allow authenticated users to insert their own claims
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Allow service role to insert any claims (for Edge Functions)
  (auth.jwt() ->> 'role' = 'service_role')
);

-- Also ensure service role can read claims for verification
CREATE POLICY "Service role can read claims"
ON public.promo_claims
FOR SELECT
USING (auth.jwt() ->> 'role' = 'service_role');

-- Ensure service role can update claims (for status changes)
CREATE POLICY "Service role can update claims"
ON public.promo_claims
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role');

-- Keep existing policies for regular users
-- (These should already exist from the original migration)
