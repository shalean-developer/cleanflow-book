-- Comprehensive fix for promo_claims table and RLS policies
-- This ensures the table works with both direct database access and Edge Functions

-- 1. Ensure promo_claims table exists with correct structure
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

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promo_claims_code ON public.promo_claims(code);
CREATE INDEX IF NOT EXISTS idx_promo_claims_user_id ON public.promo_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_claims_session_id ON public.promo_claims(session_id);
CREATE INDEX IF NOT EXISTS idx_promo_claims_status ON public.promo_claims(status);

-- 3. Enable RLS on the table
ALTER TABLE public.promo_claims ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users and service role can insert claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Service role can read claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Service role can update claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Authenticated users can insert their own claims" ON public.promo_claims;

-- 5. Create comprehensive RLS policies

-- Policy 1: Users can view their own claims
CREATE POLICY "Users can view their own claims"
ON public.promo_claims
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own claims (for direct database access)
CREATE POLICY "Users can insert their own claims"
ON public.promo_claims
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Service role can do everything (for Edge Functions)
CREATE POLICY "Service role full access"
ON public.promo_claims
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Policy 4: Allow authenticated users to update their own claims (for status changes)
CREATE POLICY "Users can update their own claims"
ON public.promo_claims
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create trigger for updated_at
DROP TRIGGER IF EXISTS update_promo_claims_updated_at ON public.promo_claims;
CREATE TRIGGER update_promo_claims_updated_at
    BEFORE UPDATE ON public.promo_claims
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Grant necessary permissions
GRANT ALL ON public.promo_claims TO authenticated;
GRANT ALL ON public.promo_claims TO service_role;

-- 9. Create a simple promos table if it doesn't exist (for validation)
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

-- Enable RLS on promos table
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active promos
CREATE POLICY "Everyone can read active promos"
ON public.promos
FOR SELECT
USING (is_active = true);

-- Allow service role full access to promos
CREATE POLICY "Service role full access to promos"
ON public.promos
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT ALL ON public.promos TO authenticated;
GRANT ALL ON public.promos TO service_role;

-- 10. Insert the NEW20SC promo if it doesn't exist
INSERT INTO public.promos (code, service_slug, type, value, is_active, expires_at)
VALUES (
  'NEW20SC',
  'standard-cleaning',
  'percent',
  20,
  true,
  NOW() + INTERVAL '1 year'
) ON CONFLICT (code) DO NOTHING;

-- 11. Verify the setup
SELECT 'promo_claims table created/updated successfully' as status;
SELECT 'RLS policies created successfully' as status;
SELECT 'NEW20SC promo code available' as status;
