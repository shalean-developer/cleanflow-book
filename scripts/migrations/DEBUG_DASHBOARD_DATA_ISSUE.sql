-- =====================================================
-- DEBUG DASHBOARD DATA LOADING ISSUE
-- =====================================================
-- This script will help diagnose why the dashboard can't load data

-- =====================================================
-- STEP 1: Check admin user status
-- =====================================================

SELECT 'Admin users in profiles table:' as info;
SELECT id, full_name, role, created_at FROM public.profiles WHERE role = 'admin';

-- =====================================================
-- STEP 2: Check if user_roles table exists and has admin users
-- =====================================================

DO $$
DECLARE
  rec RECORD;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles'
  ) THEN
    RAISE NOTICE 'user_roles table exists, checking admin users...';
    PERFORM 1 FROM public.user_roles WHERE role = 'admin' LIMIT 1;
    IF FOUND THEN
      RAISE NOTICE 'Found admin users in user_roles table';
      FOR rec IN SELECT user_id, role FROM public.user_roles WHERE role = 'admin' LOOP
        RAISE NOTICE 'Admin user: %', rec.user_id;
      END LOOP;
    ELSE
      RAISE NOTICE 'No admin users found in user_roles table';
    END IF;
  ELSE
    RAISE NOTICE 'user_roles table does not exist';
  END IF;
END $$;

-- =====================================================
-- STEP 3: Check bookings table structure and data
-- =====================================================

SELECT 'Bookings table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'bookings'
ORDER BY ordinal_position;

SELECT 'Total bookings count:' as info, COUNT(*) as count FROM public.bookings;

SELECT 'Sample booking data:' as info;
SELECT id, reference, status, user_id, created_at 
FROM public.bookings 
ORDER BY created_at DESC 
LIMIT 3;

-- =====================================================
-- STEP 4: Check if bookings have required related data
-- =====================================================

-- Check if bookings have services
SELECT 'Bookings with services:' as info, COUNT(*) as count
FROM public.bookings b
INNER JOIN public.services s ON b.service_id = s.id;

-- Check if bookings have cleaners
SELECT 'Bookings with cleaners:' as info, COUNT(*) as count
FROM public.bookings b
LEFT JOIN public.cleaners c ON b.cleaner_id = c.id;

-- =====================================================
-- STEP 5: Check RLS policies on bookings table
-- =====================================================

SELECT 'Current RLS policies on bookings:' as info;
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;

-- =====================================================
-- STEP 6: Check if RLS is enabled on bookings table
-- =====================================================

SELECT 'RLS status on bookings table:' as info;
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookings';

-- =====================================================
-- STEP 7: Test admin access to bookings (simulate what dashboard does)
-- =====================================================

-- This simulates the exact query the admin dashboard makes
SELECT 'Testing admin bookings query:' as info;
SELECT 
  b.id,
  b.reference,
  b.status,
  b.user_id,
  b.created_at,
  s.name as service_name,
  c.name as cleaner_name
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.cleaners c ON b.cleaner_id = c.id
ORDER BY b.created_at DESC
LIMIT 5;

-- =====================================================
-- STEP 8: Check for any foreign key issues
-- =====================================================

-- Check if there are bookings with invalid service_id
SELECT 'Bookings with invalid service_id:' as info, COUNT(*) as count
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
WHERE b.service_id IS NOT NULL AND s.id IS NULL;

-- Check if there are bookings with invalid cleaner_id
SELECT 'Bookings with invalid cleaner_id:' as info, COUNT(*) as count
FROM public.bookings b
LEFT JOIN public.cleaners c ON b.cleaner_id = c.id
WHERE b.cleaner_id IS NOT NULL AND c.id IS NULL;

-- =====================================================
-- STEP 9: Check cleaners table
-- =====================================================

SELECT 'Cleaners table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cleaners'
ORDER BY ordinal_position;

SELECT 'Total cleaners count:' as info, COUNT(*) as count FROM public.cleaners;

-- =====================================================
-- STEP 10: Check cleaner_applications table
-- =====================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'cleaner_applications'
  ) THEN
    RAISE NOTICE 'cleaner_applications table exists';
    PERFORM 1 FROM public.cleaner_applications LIMIT 1;
    IF FOUND THEN
      RAISE NOTICE 'Found applications data';
    ELSE
      RAISE NOTICE 'No applications data found';
    END IF;
  ELSE
    RAISE NOTICE 'cleaner_applications table does not exist';
  END IF;
END $$;

-- =====================================================
-- DIAGNOSIS SUMMARY
-- =====================================================

-- Summary of potential issues
SELECT 'Potential issues to check:' as info;
SELECT 
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') 
    THEN '❌ No admin users in profiles table'
    ELSE '✅ Admin users found in profiles table'
  END as admin_check,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.bookings) 
    THEN '❌ No bookings data'
    ELSE '✅ Bookings data exists'
  END as bookings_check,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.services) 
    THEN '❌ No services data'
    ELSE '✅ Services data exists'
  END as services_check,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.cleaners) 
    THEN '❌ No cleaners data'
    ELSE '✅ Cleaners data exists'
  END as cleaners_check;
