-- Test script to verify admin access to tables
-- Run this in Supabase SQL Editor to test if admin policies are working

-- 0. First, check the actual structure of the cleaners table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cleaners' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 1. Check if you have admin role in profiles
SELECT 
  id, 
  role, 
  full_name 
FROM public.profiles 
WHERE id = auth.uid();

-- 2. Test the is_admin function
SELECT public.is_admin(auth.uid()) as is_admin_check;

-- 3. Test admin stats RPC
SELECT * FROM public.admin_dashboard_stats();

-- 4. Test direct table access (should return data if you're admin)
SELECT COUNT(*) as bookings_count FROM public.bookings;
SELECT COUNT(*) as payments_count FROM public.payments;
SELECT COUNT(*) as cleaners_count FROM public.cleaners;
SELECT COUNT(*) as applications_count FROM public.cleaner_applications;

-- 5. Test a simple booking query first (without cleaner join)
SELECT 
  b.id,
  b.reference,
  b.status,
  b.created_at,
  s.name as service_name
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
ORDER BY b.created_at DESC
LIMIT 5;
