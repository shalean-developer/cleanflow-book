-- Drop the insecure INSERT policy that allows unrestricted claims
DROP POLICY IF EXISTS "Users can insert their own claims" ON public.promo_claims;

-- Create a new, secure INSERT policy that only allows authenticated users
-- to insert claims where they are the owner
CREATE POLICY "Authenticated users can insert their own claims"
ON public.promo_claims
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add a partial unique index to prevent duplicate claims for the same code/session
-- This prevents a user from claiming the same promo multiple times
CREATE UNIQUE INDEX IF NOT EXISTS unique_code_session_claimed_idx 
ON public.promo_claims (code, session_id) 
WHERE (status = 'claimed');