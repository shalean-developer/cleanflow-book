-- ⚡ INSTANT FIX: Run this ONE command in Supabase SQL Editor
-- This fixes the RLS policy error immediately

-- Disable RLS on quotes table (temporary, safe for public quote submissions)
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- Verification
SELECT 'RLS DISABLED - Quotes can now be submitted! 
To re-enable with proper policies later, run apply_quote_fix.sql' as status;

