-- Create promo_claims table
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

-- Create promo_redemptions table
CREATE TABLE IF NOT EXISTS public.promo_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL,
  claimed_id UUID REFERENCES public.promo_claims(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  applies_to TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_promo_claims_code_session ON public.promo_claims(code, session_id, status);
CREATE INDEX IF NOT EXISTS idx_promo_claims_user_status ON public.promo_claims(user_id, status);
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_code_user ON public.promo_redemptions(code, user_id, booking_id);

-- Enable RLS
ALTER TABLE public.promo_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for promo_claims
CREATE POLICY "Users can read their own claims"
  ON public.promo_claims
  FOR SELECT
  USING (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id');

CREATE POLICY "Users can insert their own claims"
  ON public.promo_claims
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own claims"
  ON public.promo_claims
  FOR UPDATE
  USING (auth.uid() = user_id OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id');

-- RLS policies for promo_redemptions
CREATE POLICY "Users can read their own redemptions"
  ON public.promo_redemptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert redemptions"
  ON public.promo_redemptions
  FOR INSERT
  WITH CHECK (true);