-- Corrected fix for promo_claims RLS policies
-- First, let's ensure the table exists with the correct structure

-- Check if promo_claims table exists, if not create it
CREATE TABLE IF NOT EXISTS public.promo_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  service_slug TEXT NOT NULL,
  applies_to TEXT NOT NULL,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'claimed' CHECK (status IN ('claimed', 'revoked', 'redeemed')),
  revoke_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_claims ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can update their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Authenticated users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Service role full access to promo_claims" ON public.promo_claims;

-- Create new policies that allow service role full access
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
  auth.uid() = user_id
);

-- Regular users can update their own claims
CREATE POLICY "Users can update their own claims"
ON public.promo_claims
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id
);

-- Regular users can insert their own claims
CREATE POLICY "Users can insert their own claims"
ON public.promo_claims
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND auth.uid() = user_id
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_promo_claims_code_session ON public.promo_claims(code, session_id, status);
CREATE INDEX IF NOT EXISTS idx_promo_claims_user_status ON public.promo_claims(user_id, status);

-- Add unique constraint to prevent duplicate claims
CREATE UNIQUE INDEX IF NOT EXISTS unique_code_session_claimed_idx 
ON public.promo_claims (code, session_id) 
WHERE (status = 'claimed');
