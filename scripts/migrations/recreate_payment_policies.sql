-- Recreate payment policies with proper conditions
-- Drop all existing policies first

DROP POLICY IF EXISTS "Users can insert payments for own bookings" ON payments;
DROP POLICY IF EXISTS "Service role can insert payments" ON payments;
DROP POLICY IF EXISTS "Admins can insert payments" ON payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;

-- Create a simple, working policy for users to insert payments
CREATE POLICY "Users can insert payments"
  ON payments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Create policy for users to view their own payments
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Create policy for service role (Edge Functions)
CREATE POLICY "Service role access"
  ON payments
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Verify the policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'payments' 
ORDER BY policyname;
