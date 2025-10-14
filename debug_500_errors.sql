-- Quick diagnostic script to identify the exact issues
-- Run this in Supabase SQL Editor to see what's failing

-- 1. Check if tables exist and their structure
SELECT 'bookings' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' AND table_schema = 'public'
UNION ALL
SELECT 'cleaners' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cleaners' AND table_schema = 'public'
UNION ALL
SELECT 'cleaner_applications' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cleaner_applications' AND table_schema = 'public'
ORDER BY table_name, column_name;

-- 2. Test basic queries that are failing
SELECT COUNT(*) as bookings_count FROM public.bookings;
SELECT COUNT(*) as cleaners_count FROM public.cleaners;
SELECT COUNT(*) as applications_count FROM public.cleaner_applications;

-- 3. Test the problematic join query
SELECT 
  b.id,
  b.reference,
  s.name as service_name
FROM public.bookings b
LEFT JOIN public.services s ON b.service_id = s.id
LIMIT 3;

-- 4. Test cleaners query
SELECT id, name, full_name, active FROM public.cleaners LIMIT 3;

-- 5. Test applications query  
SELECT id, status FROM public.cleaner_applications LIMIT 3;
