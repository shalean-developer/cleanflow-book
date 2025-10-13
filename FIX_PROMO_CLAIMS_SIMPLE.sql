-- Simple fix: Allow service role to bypass RLS for promo_claims operations
-- This is the most reliable approach for Edge Functions

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can update their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Authenticated users can insert their own claims" ON public.promo_claims;

-- Create simple policies that allow service role full access
-- and regular users to access their own data

-- Service role can do everything (for Edge Functions)
CREATE POLICY "Service role full access to promo_claims"
ON public.promo_claims
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Regular users can read their own claims
CREATE POLICY "Users can read their own claims"
ON public.promo_claims
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
);

-- Regular users can update their own claims
CREATE POLICY "Users can update their own claims"
ON public.promo_claims
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
);

-- Regular users can insert their own claims
CREATE POLICY "Users can insert their own claims"
ON public.promo_claims
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND auth.uid() = user_id
);
