-- Fix the specific user insert policy that has null condition

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can insert payments" ON payments;

-- Recreate it with a proper condition
CREATE POLICY "Users can insert payments"
  ON payments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Verify the fix
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'payments' 
AND policyname = 'Users can insert payments';
