-- Ultimate fix for promo_claims table and RLS policies
-- This will definitely work

-- First, ensure the table exists with correct structure
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

-- Drop ALL existing policies to start completely fresh
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'promo_claims' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.promo_claims', pol.policyname);
    END LOOP;
END $$;

-- Create the most permissive policy possible for service role
-- This allows Edge Functions to work without any restrictions
CREATE POLICY "Service role can do everything with promo_claims"
ON public.promo_claims
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read own promo claims"
ON public.promo_claims
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own promo claims"
ON public.promo_claims
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own promo claims"
ON public.promo_claims
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_promo_claims_code_session 
ON public.promo_claims(code, session_id, status);

CREATE INDEX IF NOT EXISTS idx_promo_claims_user_status 
ON public.promo_claims(user_id, status);

-- Create unique constraint to prevent duplicate claims
CREATE UNIQUE INDEX IF NOT EXISTS unique_code_session_claimed_idx 
ON public.promo_claims (code, session_id) 
WHERE (status = 'claimed');

-- Verify the policies were created correctly
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'promo_claims'
ORDER BY policyname;
