-- Fix RLS policy for payments table to allow payment record creation
-- This ensures users can create payment records for their own bookings

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;

-- Create a more permissive policy that allows users to insert payments
-- for bookings they own, without requiring the booking to already exist
CREATE POLICY "Users can insert payments for own bookings"
  ON public.payments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Also add a policy for service role (Edge Functions) to bypass RLS
-- This is needed for the Edge Function to create payment records
CREATE POLICY "Service role can insert payments"
  ON public.payments
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Ensure admins can also insert payments
CREATE POLICY "Admins can insert payments"
  ON public.payments
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add a policy for users to view their own payments
CREATE POLICY "Users can view own payments"
  ON public.payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Add a policy for admins to view all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add a policy for service role to view payments
CREATE POLICY "Service role can view payments"
  ON public.payments
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');
