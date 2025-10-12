-- Quick Database Verification Script
-- Run this in Supabase SQL Editor to check if fixes are applied

-- ============================================
-- 1. CHECK IF PROFILES HAVE ROLES
-- ============================================
SELECT 
  'Profiles Check' as test_name,
  COUNT(*) as total_users,
  COUNT(p.role) as users_with_role,
  COUNT(*) - COUNT(p.role) as users_without_role,
  CASE 
    WHEN COUNT(*) = COUNT(p.role) THEN '✅ PASS - All users have roles'
    ELSE '❌ FAIL - Some users missing roles'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

-- ============================================
-- 2. CHECK RLS POLICY ON SERVICES TABLE
-- ============================================
SELECT 
  'Services RLS' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'services' 
      AND policyname = 'Services are viewable by everyone'
      AND cmd = 'SELECT'
    ) THEN '✅ PASS - Public read policy exists'
    ELSE '❌ FAIL - Public read policy missing'
  END as status;

-- ============================================
-- 3. CHECK RLS POLICY ON EXTRAS TABLE
-- ============================================
SELECT 
  'Extras RLS' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'extras' 
      AND policyname = 'Extras are viewable by everyone'
      AND cmd = 'SELECT'
    ) THEN '✅ PASS - Public read policy exists'
    ELSE '❌ FAIL - Public read policy missing'
  END as status;

-- ============================================
-- 4. CHECK RLS POLICY ON CLEANERS TABLE
-- ============================================
SELECT 
  'Cleaners RLS' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'cleaners' 
      AND policyname = 'Cleaners are viewable by everyone'
      AND cmd = 'SELECT'
    ) THEN '✅ PASS - Public read policy exists'
    ELSE '❌ FAIL - Public read policy missing'
  END as status;

-- ============================================
-- 5. CHECK USER BOOKINGS POLICY
-- ============================================
SELECT 
  'User Bookings' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'bookings' 
      AND policyname = 'Users can view their own bookings'
      AND cmd = 'SELECT'
    ) THEN '✅ PASS - User bookings policy exists'
    ELSE '❌ FAIL - User bookings policy missing'
  END as status;

-- ============================================
-- 6. TEST ANONYMOUS READ ACCESS
-- ============================================
-- This simulates what happens when a non-logged-in user tries to view services
SET LOCAL ROLE anon;
SELECT 
  'Anonymous Services Read' as test_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.services LIMIT 1)
    THEN '✅ PASS - Anonymous users can read services'
    ELSE '⚠️ WARNING - No services found or access denied'
  END as status;
RESET ROLE;

-- ============================================
-- 7. LIST ALL USERS AND THEIR ROLES
-- ============================================
SELECT 
  u.email,
  p.role,
  p.full_name,
  u.created_at as user_created,
  CASE 
    WHEN p.role IS NULL THEN '❌ Missing role'
    ELSE '✅ Has role'
  END as role_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- ============================================
-- INTERPRETATION
-- ============================================
-- If you see any ❌ FAIL statuses above:
-- 1. The RLS migration has NOT been applied
-- 2. Run the migration: supabase/migrations/20251012150000_fix_rls_policies.sql
-- 3. Run this verification script again
--
-- If all tests show ✅ PASS:
-- - The database is properly configured
-- - The booking flow should work
-- - Both anonymous and authenticated users can access data

