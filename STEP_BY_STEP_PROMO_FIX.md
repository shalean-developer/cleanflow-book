# Step-by-Step Promo Fix Guide

## Current Status
You're still getting "Failed to apply promo. Please try again." error.

## Root Cause
The issue is likely one of these:
1. `promo_claims` table doesn't exist or has wrong structure
2. RLS policies are blocking the Edge Function
3. Edge Function has an error

## Solution: Step-by-Step Fix

### Step 1: Apply the Ultimate SQL Fix
Run this SQL in your Supabase SQL Editor:

```sql
-- File: ULTIMATE_PROMO_FIX.sql
-- This will create the table and fix all policies

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_promo_claims_code_session 
ON public.promo_claims(code, session_id, status);

CREATE INDEX IF NOT EXISTS idx_promo_claims_user_status 
ON public.promo_claims(user_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS unique_code_session_claimed_idx 
ON public.promo_claims (code, session_id) 
WHERE (status = 'claimed');
```

### Step 2: Verify the Fix
Run this query to check if everything is set up correctly:

```sql
-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'promo_claims' 
ORDER BY ordinal_position;

-- Check policies
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'promo_claims'
ORDER BY policyname;
```

### Step 3: Test the Edge Function
1. Go to Supabase Dashboard → Edge Functions
2. Click on `claim-promo` function
3. Check the Logs tab for any errors
4. Look for the console.log messages we added

### Step 4: Alternative - Bypass Edge Function
If the Edge Function still doesn't work, we can bypass it entirely. 

Replace the `supabase.functions.invoke` call in `NewCustomerPromoModal.tsx` with direct database insertion:

```typescript
// Replace this:
const { data, error } = await supabase.functions.invoke('claim-promo', {
  // ... existing code
});

// With this:
const { data: newClaim, error } = await supabase
  .from('promo_claims')
  .insert({
    code: PROMO_CONFIG.code,
    user_id: user.id,
    email: user.email,
    service_slug: PROMO_CONFIG.appliesTo,
    applies_to: PROMO_CONFIG.appliesTo,
    session_id: sessionId,
    expires_at: expiresAt.toISOString(),
    status: 'claimed',
  })
  .select()
  .single();

// Then update the setPromo call:
setPromo({
  code: PROMO_CONFIG.code,
  type: PROMO_CONFIG.type,
  value: PROMO_CONFIG.value,
  appliesTo: PROMO_CONFIG.appliesTo,
  expiresAt: expiresAt.toISOString(),
  claimId: newClaim.id, // Use newClaim.id instead of data.claim.id
});
```

### Step 5: Test the Promo Flow
1. Clear browser storage completely
2. Visit homepage
3. Wait for promo modal
4. Sign in
5. Click "Claim 20% Off"
6. Should see success message

## Debugging Steps

### Check Edge Function Logs
1. Supabase Dashboard → Edge Functions → claim-promo
2. Click Logs tab
3. Look for error messages

### Check Database Logs
1. Supabase Dashboard → Logs
2. Filter by "promo_claims"
3. Look for INSERT errors

### Test with curl
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/claim-promo' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "NEW20SC",
    "serviceSlug": "standard-cleaning",
    "sessionId": "test123",
    "email": "test@example.com",
    "expiresAt": "2024-12-31T23:59:59Z"
  }'
```

## Expected Result
After applying the fix:
- ✅ No more "Failed to apply promo" error
- ✅ Promo modal shows success
- ✅ User navigates to booking details
- ✅ Service set to "Standard Cleaning"
- ✅ Promo discount visible in Order Summary

## Files to Apply
1. **ULTIMATE_PROMO_FIX.sql** - Run this SQL first
2. **BYPASS_EDGE_FUNCTION_FIX.js** - Use this if Edge Function still fails
3. **Updated claim-promo function** - Has better error logging

## Status
🔧 **READY** - Apply the Ultimate SQL fix first, then test the promo flow.
