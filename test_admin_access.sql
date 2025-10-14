-- Test script to verify admin access to tables
-- Run this in Supabase SQL Editor to test if admin policies are working

-- 1. First, check if you have admin role in profiles
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

-- 5. Test a sample query (what the dashboard uses)
SELECT 
  b.id,
  b.reference,
  b.status,
  b.created_at,
  s.name as service_name,
  c.full_name as cleaner_name
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.cleaners c ON b.cleaner_id = c.id
ORDER BY b.created_at DESC
LIMIT 5;
