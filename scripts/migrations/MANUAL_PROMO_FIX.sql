-- Manual fix for promo_claims CORS issue
-- Run this in your Supabase SQL Editor

-- 1. Create promo_claims table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.promo_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  service_slug TEXT NOT NULL,
  applies_to TEXT NOT NULL,
  session_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'claimed' CHECK (status IN ('claimed', 'used', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.promo_claims ENABLE ROW LEVEL SECURITY;

-- 3. Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users and service role can insert claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Service role can read claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Service role can update claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Authenticated users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Service role full access" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can update their own claims" ON public.promo_claims;

-- 4. Create new policies
CREATE POLICY "Users can view their own claims"
ON public.promo_claims
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own claims"
ON public.promo_claims
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access"
ON public.promo_claims
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 5. Create promos table for validation
CREATE TABLE IF NOT EXISTS public.promos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  service_slug TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  value NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read active promos" ON public.promos;
DROP POLICY IF EXISTS "Service role full access to promos" ON public.promos;

CREATE POLICY "Everyone can read active promos"
ON public.promos
FOR SELECT
USING (is_active = true);

CREATE POLICY "Service role full access to promos"
ON public.promos
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 6. Insert the promo code
INSERT INTO public.promos (code, service_slug, type, value, is_active, expires_at)
VALUES (
  'NEW20SC',
  'standard-cleaning',
  'percent',
  20,
  true,
  NOW() + INTERVAL '1 year'
) ON CONFLICT (code) DO NOTHING;

-- 7. Grant permissions
GRANT ALL ON public.promo_claims TO authenticated;
GRANT ALL ON public.promo_claims TO service_role;
GRANT ALL ON public.promos TO authenticated;
GRANT ALL ON public.promos TO service_role;

-- 8. Verify setup
SELECT 'promo_claims table ready' as status;
SELECT COUNT(*) as promo_count FROM public.promos WHERE code = 'NEW20SC';
