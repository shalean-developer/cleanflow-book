# Promo Code Error Fix Guide

## Problem
Users are getting "Failed to apply promo. Please try again." error when trying to claim the NEW20SC promo code.

## Root Cause Analysis
The issue is with Row Level Security (RLS) policies on the `promo_claims` table. The Edge Function `claim-promo` uses the service role key to bypass RLS, but the RLS policies were recently changed to be more restrictive.

### What Changed
In migration `20251010131829_3c6b74b2-c741-4f96-b4e1-fd6ae5ea97ac.sql`:
- **Before**: `WITH CHECK (true)` - anyone could insert
- **After**: `WITH CHECK (auth.uid() = user_id)` - only authenticated users can insert their own claims

### The Problem
The Edge Function uses service role authentication, but the RLS policy expects user authentication (`auth.uid()`). This creates a mismatch.

## Solutions

### Option 1: Fix RLS Policies (Recommended)
Apply the SQL fix to allow service role to bypass RLS:

```sql
-- Run this in Supabase SQL Editor
-- File: FIX_PROMO_CLAIMS_SIMPLE.sql

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can update their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Authenticated users can insert their own claims" ON public.promo_claims;

-- Create simple policies that allow service role full access
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
```

### Option 2: Update Edge Function (Alternative)
The Edge Function has been updated to use a separate service role client for database operations, which should bypass RLS entirely.

## Testing the Fix

### 1. Apply the RLS Fix
Run the SQL from `FIX_PROMO_CLAIMS_SIMPLE.sql` in your Supabase SQL Editor.

### 2. Test Promo Claiming
1. Clear browser storage/session
2. Visit homepage
3. Wait for promo modal (2 seconds)
4. Sign in
5. Click "Claim 20% Off"
6. Should see success message and navigate to booking details

### 3. Verify in Database
Check that the promo claim was created:
```sql
SELECT * FROM public.promo_claims 
WHERE code = 'NEW20SC' 
ORDER BY created_at DESC 
LIMIT 5;
```

### 4. Test Full Booking Flow
1. Complete booking details
2. Select cleaner
3. Go to review page
4. Verify promo discount is visible in Order Summary
5. Complete payment
6. Check booking confirmation

## Debugging Steps

### Check Edge Function Logs
1. Go to Supabase Dashboard → Edge Functions
2. Click on `claim-promo` function
3. Check the Logs tab for error messages

### Check Database Logs
1. Go to Supabase Dashboard → Logs
2. Filter by `promo_claims` table
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

## Expected Behavior After Fix

### Successful Promo Claim
- User sees "Promo Applied!" toast
- Navigates to booking details page
- Service is set to "Standard Cleaning"
- Promo is stored in booking state

### On Review Page
- Order Summary shows:
  ```
  Subtotal: R450.00
  Promo Discount (NEW20SC): -R90.00
  Service Fee: R36.00
  Total: R396.00
  ```

### After Payment
- Promo redemption record created in `promo_redemptions` table
- Promo claim status updated to "redeemed"

## Files Modified
1. `supabase/functions/claim-promo/index.ts` - Updated to use service role client
2. `FIX_PROMO_CLAIMS_SIMPLE.sql` - RLS policy fix
3. `test_promo_claim.js` - Test script
4. `PROMO_ERROR_FIX_GUIDE.md` - This guide

## Status
🔧 **IN PROGRESS** - RLS policy fix needed to resolve promo claiming error.
