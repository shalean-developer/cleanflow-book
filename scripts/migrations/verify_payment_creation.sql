-- Verify payment records are being created
-- Run these queries to check if payments are being saved

-- 1. Check recent bookings with their payments
SELECT 
  b.id as booking_id,
  b.reference as booking_reference,
  b.payment_reference,
  b.status as booking_status,
  b.created_at as booking_created,
  p.id as payment_id,
  p.reference as payment_reference,
  p.status as payment_status,
  p.amount,
  p.created_at as payment_created
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
ORDER BY b.created_at DESC
LIMIT 10;

-- 2. Find bookings without payment records
SELECT 
  b.id,
  b.reference,
  b.payment_reference,
  b.status,
  b.created_at
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE p.reference IS NULL
  AND b.payment_reference IS NOT NULL
  AND b.created_at > NOW() - INTERVAL '24 hours'
ORDER BY b.created_at DESC;

-- 3. Check payment table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- 4. Count payments by status
SELECT status, COUNT(*) as count
FROM payments
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY status;

-- 5. Check RLS policies on payments table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'payments';

-- 6. Test payment insertion (run this carefully)
-- INSERT INTO payments (booking_id, provider, reference, status, amount, currency, paid_at)
-- VALUES (
--   'your-booking-id-here',
--   'paystack',
--   'test-reference-123',
--   'success',
--   435.60,
--   'ZAR',
--   NOW()
-- );
