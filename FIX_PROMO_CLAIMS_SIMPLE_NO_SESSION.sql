-- Simple fix for promo_claims RLS policies without relying on session_id
-- This avoids the column not found error

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can update their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Authenticated users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Service role full access to promo_claims" ON public.promo_claims;

-- Create simple policies that allow service role full access
-- Service role can do everything (for Edge Functions)
CREATE POLICY "Service role full access to promo_claims"
ON public.promo_claims
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Regular authenticated users can read their own claims
CREATE POLICY "Authenticated users can read own claims"
ON public.promo_claims
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Regular authenticated users can update their own claims
CREATE POLICY "Authenticated users can update own claims"
ON public.promo_claims
FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Regular authenticated users can insert their own claims
CREATE POLICY "Authenticated users can insert own claims"
ON public.promo_claims
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Verify the policies were created
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'promo_claims'
ORDER BY policyname;
