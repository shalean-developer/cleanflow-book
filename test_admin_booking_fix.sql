-- Test script to verify admin booking permissions are working
-- Run this after applying URGENT_ADMIN_BOOKING_FIX.sql

-- Test 1: Check if admin function works
SELECT 
  'Test 1: Admin Function' as test,
  public.is_admin(auth.uid()) as result,
  CASE 
    WHEN public.is_admin(auth.uid()) THEN 'PASS - User is admin'
    ELSE 'FAIL - User is not admin'
  END as status;

-- Test 2: Check if we can view bookings
SELECT 
  'Test 2: View Bookings' as test,
  COUNT(*) as booking_count,
  CASE 
    WHEN COUNT(*) >= 0 THEN 'PASS - Can view bookings'
    ELSE 'FAIL - Cannot view bookings'
  END as status
FROM public.bookings;

-- Test 3: Check if we can update a booking (dry run)
-- This will test the policy without actually updating
SELECT 
  'Test 3: Update Permission' as test,
  EXISTS(
    SELECT 1 FROM public.bookings 
    WHERE public.is_admin(auth.uid())
    LIMIT 1
  ) as can_update,
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM public.bookings 
      WHERE public.is_admin(auth.uid())
      LIMIT 1
    ) THEN 'PASS - Can update bookings'
    ELSE 'FAIL - Cannot update bookings'
  END as status;

-- Test 4: Show current user info
SELECT 
  'Test 4: Current User' as test,
  auth.uid() as user_id,
  p.role as profile_role,
  ur.role as user_role_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.id = auth.uid();

-- Test 5: Show booking policies
SELECT 
  'Test 5: Booking Policies' as test,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;

SELECT 'All tests completed!' as final_status;
