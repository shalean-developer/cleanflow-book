-- Fix the payment RLS policies to allow proper payment creation

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can insert payments for their bookings" ON payments;

-- Create a proper policy that allows users to insert payments for their own bookings
CREATE POLICY "Users can insert payments for own bookings"
  ON payments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Also add a policy for service role (Edge Functions)
CREATE POLICY "Service role can insert payments"
  ON payments
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add admin policy
CREATE POLICY "Admins can insert payments"
  ON payments
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Verify the policies are created
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'payments' 
ORDER BY policyname;
