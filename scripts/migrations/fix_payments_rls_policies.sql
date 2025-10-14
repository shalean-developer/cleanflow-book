-- Fix RLS policies for payments to ensure admin access works properly
-- This will clean up any conflicting policies and ensure proper admin access

-- First, let's see what policies currently exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'payments'
ORDER BY policyname;

-- Drop all existing payment policies to start clean
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert payments for own bookings" ON public.payments;
DROP POLICY IF EXISTS "Service role can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can view payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert payments" ON public.payments;
DROP POLICY IF EXISTS "payments admin or owner can read" ON public.payments;

-- Create clean, working policies for payments
-- 1. Admin can view all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (public.is_admin(auth.uid()));

-- 2. Users can view their own payments (through bookings)
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- 3. Admin can insert payments
CREATE POLICY "Admins can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- 4. Users can insert payments for their own bookings
CREATE POLICY "Users can insert payments for own bookings"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- 5. Service role can do everything (for edge functions)
CREATE POLICY "Service role can manage payments"
  ON public.payments FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Verify the policies were created
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'payments'
ORDER BY policyname;
