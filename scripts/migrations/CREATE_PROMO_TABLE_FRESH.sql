-- Create promo_claims table from scratch
-- This will work regardless of current database state

-- First, drop the table completely if it exists (to start fresh)
DROP TABLE IF EXISTS public.promo_claims CASCADE;

-- Create the table with the correct structure
CREATE TABLE public.promo_claims (
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

-- Create RLS policies
-- Service role can do everything (for Edge Functions)
CREATE POLICY "Service role full access"
ON public.promo_claims
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Authenticated users can read their own claims
CREATE POLICY "Users can read own claims"
ON public.promo_claims
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Authenticated users can insert their own claims
CREATE POLICY "Users can insert own claims"
ON public.promo_claims
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own claims
CREATE POLICY "Users can update own claims"
ON public.promo_claims
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_promo_claims_code_session 
ON public.promo_claims(code, session_id, status);

CREATE INDEX idx_promo_claims_user_status 
ON public.promo_claims(user_id, status);

-- Create unique constraint to prevent duplicate claims
CREATE UNIQUE INDEX unique_code_session_claimed_idx 
ON public.promo_claims (code, session_id) 
WHERE (status = 'claimed');

-- Verify the table was created correctly
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'promo_claims' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verify the policies were created
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'promo_claims'
ORDER BY policyname;
