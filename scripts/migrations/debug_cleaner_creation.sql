-- =====================================================
-- DEBUG CLEANER CREATION ISSUE
-- =====================================================
-- This script helps diagnose why cleaner creation is stuck loading

-- =====================================================
-- STEP 1: Check current user authentication
-- =====================================================

SELECT 'Current authenticated user:' as info;
SELECT 
  auth.uid() as current_user_id,
  CASE 
    WHEN auth.uid() IS NULL THEN 'NO USER AUTHENTICATED'
    ELSE 'USER AUTHENTICATED'
  END as auth_status;

-- =====================================================
-- STEP 2: Check admin permissions for current user
-- =====================================================

SELECT 'Admin permissions check:' as info;
SELECT 
  p.id,
  p.role as profile_role,
  p.full_name,
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
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cleaners'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 4: Check RLS policies on cleaners table
-- =====================================================

SELECT 'Current cleaners policies:' as info, policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'cleaners'
ORDER BY policyname;

-- =====================================================
-- STEP 5: Test admin access to cleaners table
-- =====================================================

SELECT 'Testing admin access to cleaners table:' as info;
SELECT COUNT(*) as total_cleaners FROM public.cleaners;

-- =====================================================
-- STEP 6: Check if we can insert into cleaners table
-- =====================================================

-- Test insert permissions (this will show if there are any RLS issues)
DO $$
DECLARE
    test_cleaner_id uuid;
BEGIN
    -- Try to insert a test cleaner record
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
            'Test Cleaner Debug',
            'test@debug.com',
            '+1234567890',
            true,
            1,
            20.00,
            'Test cleaner for debugging',
            ARRAY['Test Area'],
            auth.uid()
        ) RETURNING id INTO test_cleaner_id;
        
        RAISE NOTICE 'SUCCESS: Test cleaner inserted with ID: %', test_cleaner_id;
        
        -- Clean up test record
        DELETE FROM public.cleaners WHERE id = test_cleaner_id;
        RAISE NOTICE 'Test cleaner deleted successfully';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR inserting test cleaner: %', SQLERRM;
    END;
END $$;

-- =====================================================
-- STEP 7: Check for any trigger issues
-- =====================================================

SELECT 'Triggers on cleaners table:' as info;
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'cleaners'
AND event_object_schema = 'public';

-- =====================================================
-- STEP 8: Check for any foreign key constraints
-- =====================================================

SELECT 'Foreign key constraints on cleaners table:' as info;
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'cleaners'
    AND tc.table_schema = 'public';

-- =====================================================
-- STEP 9: Check recent cleaner creation attempts
-- =====================================================

SELECT 'Recent cleaners (last 10):' as info;
SELECT id, name, email, active, created_at, user_id
FROM public.cleaners
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- SUMMARY
-- =====================================================

SELECT 'DIAGNOSTIC SUMMARY:' as info;
SELECT '1. Check if current user is authenticated' as step_1;
SELECT '2. Verify admin permissions are set correctly' as step_2;
SELECT '3. Ensure RLS policies allow admin access' as step_3;
SELECT '4. Test if insert operation works from SQL' as step_4;
SELECT '5. Check browser console for JavaScript errors' as step_5;
