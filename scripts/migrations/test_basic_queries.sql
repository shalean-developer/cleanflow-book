-- Simple test queries to verify basic table access
-- Run these one by one in Supabase SQL Editor

-- Test 1: Basic cleaners query (should work now)
SELECT id, active, created_at FROM public.cleaners LIMIT 3;

-- Test 2: Basic applications query  
SELECT id, status, created_at FROM public.cleaner_applications LIMIT 3;

-- Test 3: Basic payments query
SELECT id, amount, status, created_at FROM public.payments LIMIT 3;

-- Test 4: Basic bookings query
SELECT id, reference, status, created_at FROM public.bookings LIMIT 3;

-- Test 5: Admin stats RPC (should work)
SELECT * FROM public.admin_dashboard_stats();
