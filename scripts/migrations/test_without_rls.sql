-- Temporarily disable RLS to test if that's the issue
-- This will help us determine if RLS is blocking payment creation

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'payments';

-- Temporarily disable RLS
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Test payment creation
INSERT INTO payments (
  booking_id,
  provider,
  reference,
  status,
  amount,
  currency
) VALUES (
  (SELECT id FROM bookings WHERE reference = 'BK-1760309805798-r76nk8duj' LIMIT 1),
  'paystack',
  'TEST-NO-RLS-123',
  'success',
  100.00,
  'ZAR'
);

-- Check if the payment was created
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE p.reference = 'TEST-NO-RLS-123';

-- Re-enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create a very simple policy
DROP POLICY IF EXISTS "Users can insert payments" ON payments;
CREATE POLICY "Allow all inserts" ON payments FOR INSERT WITH CHECK (true);
