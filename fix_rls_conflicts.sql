-- Fix RLS policy conflicts by dropping conflicting policies
-- Run this in Supabase SQL Editor

-- Drop conflicting policies that are causing issues
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view payments for own bookings" ON public.payments;
DROP POLICY IF EXISTS "Allow authenticated users to view applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Anyone can view active cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaners can view own profile" ON public.cleaners;

-- Create simple, clean policies that work
CREATE POLICY "bookings_admin_read" ON public.bookings
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "cleaners_admin_read" ON public.cleaners  
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "applications_admin_read" ON public.cleaner_applications
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "payments_admin_read" ON public.payments
  FOR SELECT USING (is_admin(auth.uid()));

-- Test the policies
SELECT 'Testing admin access...' as status;
SELECT COUNT(*) as bookings_count FROM public.bookings;
SELECT COUNT(*) as cleaners_count FROM public.cleaners;
SELECT COUNT(*) as applications_count FROM public.cleaner_applications;
SELECT COUNT(*) as payments_count FROM public.payments;
