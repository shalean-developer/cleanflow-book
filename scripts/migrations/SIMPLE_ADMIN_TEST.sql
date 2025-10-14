-- =====================================================
-- SIMPLE ADMIN TEST - Focus on the 500 Error
-- =====================================================

-- Test 1: Basic bookings access
SELECT 'Basic bookings count:' as info, COUNT(*) as count FROM public.bookings;

-- Test 2: Check for invalid foreign keys
SELECT 'Bookings with invalid service_id:' as info, COUNT(*) as count
FROM public.bookings b
WHERE b.service_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.services s WHERE s.id = b.service_id);

SELECT 'Bookings with invalid cleaner_id:' as info, COUNT(*) as count
FROM public.bookings b
WHERE b.cleaner_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM public.cleaners c WHERE c.id = b.cleaner_id);

-- Test 3: Sample booking data
SELECT 'Sample booking:' as info;
SELECT id, reference, status, service_id, cleaner_id, user_id
FROM public.bookings 
ORDER BY created_at DESC 
LIMIT 1;

-- Test 4: Check services table
SELECT 'Services count:' as info, COUNT(*) as count FROM public.services;

-- Test 5: Check cleaners table  
SELECT 'Cleaners count:' as info, COUNT(*) as count FROM public.cleaners;

-- Test 6: Admin users
SELECT 'Admin users:' as info, COUNT(*) as count 
FROM public.profiles WHERE role = 'admin';

-- Test 7: Try the problematic query step by step
SELECT 'Testing bookings + services join:' as info;
SELECT COUNT(*) as count
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id;

SELECT 'Testing bookings + cleaners join:' as info;
SELECT COUNT(*) as count
FROM public.bookings b
LEFT JOIN public.cleaners c ON b.cleaner_id = c.id;

-- Test 8: Full query that's failing
SELECT 'Testing full dashboard query:' as info;
SELECT 
  b.id,
  b.reference,
  b.status,
  s.name as service_name,
  c.name as cleaner_name
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LEFT JOIN public.cleaners c ON b.cleaner_id = c.id
LIMIT 1;
