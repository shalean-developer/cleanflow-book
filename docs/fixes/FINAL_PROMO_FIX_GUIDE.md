# Final Promo Fix Guide

## Current Issue
The `promo_claims` table doesn't exist or has the wrong structure. The error "column 'code' does not exist" confirms this.

## Solution Options

### Option 1: Create Fresh Table (Recommended)
Run this SQL in your Supabase SQL Editor:

```sql
-- CREATE_PROMO_TABLE_FRESH.sql
-- This will create the table from scratch

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
```

### Option 2: Bypass Edge Function (Alternative)
If you want to avoid the Edge Function entirely, replace the `handleClaim` function in `NewCustomerPromoModal.tsx` with the code from `FRONTEND_ONLY_PROMO_FIX.tsx`.

## Testing Steps

### Step 1: Apply the SQL Fix
Run the SQL from `CREATE_PROMO_TABLE_FRESH.sql` in your Supabase SQL Editor.

### Step 2: Verify Table Creation
Run this query to confirm the table was created correctly:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'promo_claims' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

You should see these columns:
- id (uuid)
- code (text)
- user_id (uuid)
- email (text)
- service_slug (text)
- applies_to (text)
- claimed_at (timestamp with time zone)
- expires_at (timestamp with time zone)
- session_id (text)
- status (text)
- revoke_reason (text)
- created_at (timestamp with time zone)

### Step 3: Test the Promo Flow
1. Clear browser storage completely
2. Visit homepage
3. Wait for promo modal (2 seconds)
4. Sign in
5. Click "Claim 20% Off"
6. Should see "Promo Applied!" success message
7. Should navigate to booking details page
8. Service should be set to "Standard Cleaning"

### Step 4: Verify Promo Works in Booking
1. Complete booking details
2. Select cleaner
3. Go to review page
4. Check that promo discount appears in Order Summary:
   ```
   Subtotal: R450.00
   Promo Discount (NEW20SC): -R90.00
   Service Fee: R36.00
   Total: R396.00
   ```

## Debugging

### Check Edge Function Logs
1. Go to Supabase Dashboard → Edge Functions
2. Click on `claim-promo` function
3. Check the Logs tab for any errors

### Check Database Logs
1. Go to Supabase Dashboard → Logs
2. Filter by "promo_claims"
3. Look for INSERT errors

### Test Direct Database Access
Run this query to test if you can insert a promo claim directly:

```sql
INSERT INTO public.promo_claims (
  code, 
  user_id, 
  email, 
  service_slug, 
  applies_to, 
  session_id, 
  expires_at, 
  status
) VALUES (
  'TEST123',
  '00000000-0000-0000-0000-000000000000', -- dummy UUID
  'test@example.com',
  'standard-cleaning',
  'standard-cleaning',
  'test_session',
  NOW() + INTERVAL '30 days',
  'claimed'
);

-- Clean up the test record
DELETE FROM public.promo_claims WHERE code = 'TEST123';
```

## Expected Result
After applying the fix:
- ✅ Promo modal appears on homepage
- ✅ User can claim promo successfully
- ✅ "Promo Applied!" success message shows
- ✅ User navigates to booking details
- ✅ Service is set to "Standard Cleaning"
- ✅ Promo discount appears in Order Summary
- ✅ Final total reflects 20% discount

## Files Created
1. `CREATE_PROMO_TABLE_FRESH.sql` - Creates the table from scratch
2. `FRONTEND_ONLY_PROMO_FIX.tsx` - Alternative frontend-only solution
3. `DIAGNOSE_CURRENT_STATE.sql` - Diagnostic queries
4. `FINAL_PROMO_FIX_GUIDE.md` - This guide

## Status
🔧 **READY TO APPLY** - Use `CREATE_PROMO_TABLE_FRESH.sql` to create the table from scratch.
