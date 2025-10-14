-- =====================================================
-- QUICK DEBUG: ADMIN ACCESS ISSUE
-- =====================================================
-- This script quickly identifies why the admin dashboard is failing

-- =====================================================
-- STEP 1: Check current user and admin status
-- =====================================================

-- Check if you have admin users
SELECT 'Admin users in profiles:' as info, COUNT(*) as count
FROM public.profiles WHERE role = 'admin';

SELECT 'All users in profiles:' as info;
SELECT id, role, full_name, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- =====================================================
-- STEP 2: Test the exact bookings query that's failing
-- =====================================================

-- This is the exact query from AdminDashboard.tsx that's causing the 500 error
SELECT 'Testing admin bookings query:' as info;

-- First test: Basic bookings query
SELECT 'Basic bookings query:' as info;
SELECT COUNT(*) as booking_count FROM public.bookings;

-- Second test: Bookings with services join
SELECT 'Bookings with services join:' as info;
SELECT COUNT(*) as count
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id;

-- Third test: Bookings with cleaners join  
SELECT 'Bookings with cleaners join:' as info;
SELECT COUNT(*) as count
FROM public.bookings b
LEFT JOIN public.cleaners c ON b.cleaner_id = c.id;

-- Fourth test: Full query (this is what's failing)
SELECT 'Full dashboard query test:' as info;
SELECT 
  b.id,
  b.reference,
  b.status,
  b.user_id,
  b.created_at,
  s.id as service_id,
  s.name as service_name,
  c.id as cleaner_id,
  c.name as cleaner_name
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.cleaners c ON b.cleaner_id = c.id
ORDER BY b.created_at DESC
LIMIT 3;

-- =====================================================
-- STEP 3: Check for data integrity issues
-- =====================================================

-- Check for bookings with invalid service_id
SELECT 'Bookings with invalid service_id:' as info, COUNT(*) as count
FROM public.bookings b
WHERE b.service_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.services s WHERE s.id = b.service_id);

-- Check for bookings with invalid cleaner_id
SELECT 'Bookings with invalid cleaner_id:' as info, COUNT(*) as count
FROM public.bookings b
WHERE b.cleaner_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.cleaners c WHERE c.id = b.cleaner_id);

-- =====================================================
-- STEP 4: Check table structures
-- =====================================================

-- Check bookings table structure
SELECT 'Bookings table columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'bookings'
ORDER BY ordinal_position;

-- Check services table structure
SELECT 'Services table columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'services'
ORDER BY ordinal_position;

-- Check cleaners table structure
SELECT 'Cleaners table columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cleaners'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 5: Check RLS policies
-- =====================================================

-- Check if RLS is enabled
SELECT 'RLS status on bookings:' as info;
SELECT tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookings';

-- Check current policies
SELECT 'Current booking policies:' as info;
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;

-- =====================================================
-- STEP 6: Quick fix suggestions
-- =====================================================

-- Show any problematic bookings
SELECT 'Sample bookings data:' as info;
SELECT 
  id, 
  reference, 
  status, 
  service_id, 
  cleaner_id,
  user_id,
  created_at
FROM public.bookings 
ORDER BY created_at DESC 
LIMIT 5;
