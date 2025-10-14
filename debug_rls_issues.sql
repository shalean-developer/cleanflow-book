-- Test the is_admin function and RLS policies
-- Run this in Supabase SQL Editor

-- 1. Test the is_admin function
SELECT 
  auth.uid() as current_user_id,
  public.is_admin(auth.uid()) as is_admin_result;

-- 2. Test if profiles table has the user
SELECT 
  id, 
  role, 
  full_name 
FROM public.profiles 
WHERE id = auth.uid();

-- 3. Test basic table access without RLS (temporarily)
-- This will help us see if the issue is RLS or something else
SET row_security = off;
SELECT COUNT(*) as bookings_count FROM public.bookings;
SELECT COUNT(*) as cleaners_count FROM public.cleaners;
SELECT COUNT(*) as applications_count FROM public.cleaner_applications;
SELECT COUNT(*) as payments_count FROM public.payments;
SET row_security = on;

-- 4. Check what RLS policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('bookings', 'cleaners', 'cleaner_applications', 'payments')
ORDER BY tablename, policyname;
