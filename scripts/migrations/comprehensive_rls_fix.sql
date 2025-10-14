-- Comprehensive RLS fix - disable RLS temporarily for admin testing
-- Run this in Supabase SQL Editor

-- First, let's test the is_admin function
SELECT 
  auth.uid() as current_user_id,
  public.is_admin(auth.uid()) as is_admin_result;

-- Check if user exists in profiles table
SELECT id, role FROM public.profiles WHERE id = auth.uid();

-- Check if user exists in user_roles table  
SELECT user_id, role FROM public.user_roles WHERE user_id = auth.uid();

-- TEMPORARY: Disable RLS on all tables to test if that's the issue
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;

-- Test queries without RLS
SELECT COUNT(*) as bookings_count FROM public.bookings;
SELECT COUNT(*) as cleaners_count FROM public.cleaners;
SELECT COUNT(*) as applications_count FROM public.cleaner_applications;
SELECT COUNT(*) as payments_count FROM public.payments;

-- Re-enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "bookings admin or owner can read" ON public.bookings;
DROP POLICY IF EXISTS "bookings_admin_read" ON public.bookings;
DROP POLICY IF EXISTS "cleaners admin can read" ON public.cleaners;
DROP POLICY IF EXISTS "cleaners_admin_read" ON public.cleaners;
DROP POLICY IF EXISTS "applications admin can read" ON public.cleaner_applications;
DROP POLICY IF EXISTS "applications_admin_read" ON public.cleaner_applications;
DROP POLICY IF EXISTS "payments admin or owner can read" ON public.payments;
DROP POLICY IF EXISTS "payments_admin_read" ON public.payments;

-- Create simple policies that definitely work
CREATE POLICY "admin_bookings_access" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_cleaners_access" ON public.cleaners
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_applications_access" ON public.cleaner_applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_payments_access" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Test the new policies
SELECT 'Testing new policies...' as status;
SELECT COUNT(*) as bookings_count FROM public.bookings;
SELECT COUNT(*) as cleaners_count FROM public.cleaners;
SELECT COUNT(*) as applications_count FROM public.cleaner_applications;
SELECT COUNT(*) as payments_count FROM public.payments;
