-- Diagnostic queries to check the current state of your database

-- 1. Check if promo_claims table exists at all
SELECT 
    table_name, 
    table_schema,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE '%promo%' 
AND table_schema = 'public';

-- 2. If promo_claims exists, check its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'promo_claims' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check all tables that contain 'promo' in the name
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE tablename LIKE '%promo%';

-- 4. Check if there are any existing promo-related policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename LIKE '%promo%';

-- 5. Check if there are any promo-related indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename LIKE '%promo%';
