-- =====================================================
-- TEST CLEANER INSERT SPECIFICALLY
-- =====================================================
-- This script tests if we can insert cleaners directly

-- =====================================================
-- STEP 1: Check current user
-- =====================================================

SELECT 'Current user:' as info, auth.uid() as user_id;

-- =====================================================
-- STEP 2: Check admin status
-- =====================================================

SELECT 'Admin status:' as info;
SELECT 
  p.role as profile_role,
  ur.role as user_role_role,
  CASE 
    WHEN p.role = 'admin' OR ur.role = 'admin' THEN 'IS ADMIN'
    ELSE 'NOT ADMIN'
  END as admin_status
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
WHERE p.id = auth.uid();

-- =====================================================
-- STEP 3: Check cleaners table structure
-- =====================================================

SELECT 'Cleaners table columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cleaners'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 4: Check current policies
-- =====================================================

SELECT 'Current policies:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'cleaners'
ORDER BY policyname;

-- =====================================================
-- STEP 5: Test direct insert (bypassing RLS temporarily)
-- =====================================================

-- Temporarily disable RLS to test
ALTER TABLE public.cleaners DISABLE ROW LEVEL SECURITY;

-- Try to insert a test cleaner
INSERT INTO public.cleaners (
    name,
    email,
    phone,
    active,
    experience_years,
    hourly_rate,
    bio,
    service_areas,
    user_id
) VALUES (
    'Test Direct Insert',
    'directtest@example.com',
    '+1234567890',
    true,
    1,
    20.00,
    'Test cleaner direct insert',
    ARRAY['Test Area'],
    auth.uid()
);

SELECT 'Direct insert successful!' as result;
SELECT 'Test cleaner created:' as info, name, email FROM public.cleaners WHERE email = 'directtest@example.com';

-- Clean up test record
DELETE FROM public.cleaners WHERE email = 'directtest@example.com';

-- Re-enable RLS
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 6: Test with RLS enabled
-- =====================================================

-- Now test with RLS enabled
DO $$
DECLARE
    test_cleaner_id uuid;
BEGIN
    BEGIN
        INSERT INTO public.cleaners (
            name,
            email,
            phone,
            active,
            experience_years,
            hourly_rate,
            bio,
            service_areas,
            user_id
        ) VALUES (
            'Test RLS Insert',
            'rlstest@example.com',
            '+1234567890',
            true,
            1,
            20.00,
            'Test cleaner with RLS',
            ARRAY['Test Area'],
            auth.uid()
        ) RETURNING id INTO test_cleaner_id;
        
        RAISE NOTICE 'SUCCESS: RLS insert worked! ID: %', test_cleaner_id;
        
        -- Clean up
        DELETE FROM public.cleaners WHERE id = test_cleaner_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: RLS insert failed: %', SQLERRM;
    END;
END $$;

-- =====================================================
-- FINAL CHECK
-- =====================================================

SELECT 'Final test - current cleaners count:' as info, COUNT(*) as count FROM public.cleaners;
