# Promo Code Error Fix Guide - CORRECTED

## Problem
Users are getting "Failed to apply promo. Please try again." error when trying to claim the NEW20SC promo code.

## Root Cause
The error `column "session_id" does not exist` indicates that either:
1. The `promo_claims` table doesn't exist in your database
2. The table exists but doesn't have the `session_id` column
3. There's a mismatch between the migration files and actual database structure

## Solution Steps

### Step 1: Diagnose the Table Structure
First, run this diagnostic query to check what's actually in your database:

```sql
-- Run this in Supabase SQL Editor first
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'promo_claims' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Step 2: Apply the Corrected Fix
If the table doesn't exist or is missing columns, run this comprehensive fix:

```sql
-- File: FIX_PROMO_CLAIMS_CORRECTED.sql
-- This will create the table if it doesn't exist and fix all policies

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
CREATE POLICY "Service role full access to promo_claims"
ON public.promo_claims
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Regular users can read their own claims
CREATE POLICY "Users can read their own claims"
ON public.promo_claims
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Regular users can update their own claims
CREATE POLICY "Users can update their own claims"
ON public.promo_claims
FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Regular users can insert their own claims
CREATE POLICY "Users can insert their own claims"
ON public.promo_claims
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_promo_claims_code_session ON public.promo_claims(code, session_id, status);
CREATE INDEX IF NOT EXISTS idx_promo_claims_user_status ON public.promo_claims(user_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS unique_code_session_claimed_idx 
ON public.promo_claims (code, session_id) 
WHERE (status = 'claimed');
```

### Alternative: Simple Fix (if table exists but has issues)
If you prefer a simpler approach that doesn't rely on session_id in policies:

```sql
-- File: FIX_PROMO_CLAIMS_SIMPLE_NO_SESSION.sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can update their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Authenticated users can insert their own claims" ON public.promo_claims;
DROP POLICY IF EXISTS "Service role full access to promo_claims" ON public.promo_claims;

-- Create simple policies that allow service role full access
CREATE POLICY "Service role full access to promo_claims"
ON public.promo_claims
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Regular authenticated users can read their own claims
CREATE POLICY "Authenticated users can read own claims"
ON public.promo_claims
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Regular authenticated users can update their own claims
CREATE POLICY "Authenticated users can update own claims"
ON public.promo_claims
FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Regular authenticated users can insert their own claims
CREATE POLICY "Authenticated users can insert own claims"
ON public.promo_claims
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
```

## Testing After Fix

### 1. Verify Table Structure
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'promo_claims' 
ORDER BY ordinal_position;
```

### 2. Verify Policies
```sql
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'promo_claims'
ORDER BY policyname;
```

### 3. Test Promo Claiming
1. Clear browser storage
2. Visit homepage
3. Wait for promo modal
4. Sign in and click "Claim 20% Off"
5. Should see success message

## Expected Result
After applying the fix, the promo claiming should work correctly:
- ✅ No more "Failed to apply promo" error
- ✅ Promo modal shows success message
- ✅ User navigates to booking details
- ✅ Service is set to "Standard Cleaning"
- ✅ Promo discount appears in Order Summary

## Files Created
1. `FIX_PROMO_CLAIMS_CORRECTED.sql` - Comprehensive fix with table creation
2. `FIX_PROMO_CLAIMS_SIMPLE_NO_SESSION.sql` - Simple policy-only fix
3. `DIAGNOSE_PROMO_TABLE.sql` - Diagnostic queries
4. `PROMO_ERROR_FIX_GUIDE_CORRECTED.md` - This guide

## Status
🔧 **READY TO APPLY** - Use the corrected SQL fix to resolve the promo claiming error.
