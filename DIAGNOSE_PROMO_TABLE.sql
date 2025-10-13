-- Diagnostic queries to check promo_claims table structure and policies

-- 1. Check if promo_claims table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'promo_claims' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check current RLS policies on promo_claims table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'promo_claims';

-- 3. Check if RLS is enabled on promo_claims table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'promo_claims' AND schemaname = 'public';

-- 4. Check if there are any existing promo claims
SELECT COUNT(*) as total_claims FROM public.promo_claims;

-- 5. Check recent promo claims (if any exist)
SELECT 
    code,
    user_id,
    session_id,
    status,
    created_at
FROM public.promo_claims 
ORDER BY created_at DESC 
LIMIT 5;
