-- Fix all the recent missing payment records from your console logs

-- Create payment records for the three missing bookings
INSERT INTO payments (
  booking_id,
  provider,
  reference,
  status,
  amount,
  currency,
  paid_at,
  created_at
)
SELECT 
  id as booking_id,
  'paystack' as provider,
  payment_reference as reference,
  'success' as status,
  COALESCE(
    (pricing->>'total')::decimal,
    (pricing->>'service_price')::decimal,
    435.60
  ) as amount,
  'ZAR' as currency,
  created_at as paid_at,
  NOW() as created_at
FROM bookings 
WHERE reference IN (
  'BK-1760311382035-xhq26987d',
  'BK-1760311123451-usos5v8bx', 
  'BK-1760310221712-7hvjdo4kd'
)
AND payment_reference IN (
  'BK-1760311405746-xeaktm1bt',
  'BK-1760311173152-rri489zgq',
  'BK-1760310271105-j89xzx1s2'
)
AND NOT EXISTS (
  SELECT 1 FROM payments 
  WHERE payments.reference = bookings.payment_reference
);

-- Verify the fix
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE b.reference IN (
  'BK-1760311382035-xhq26987d',
  'BK-1760311123451-usos5v8bx', 
  'BK-1760310221712-7hvjdo4kd'
)
ORDER BY b.created_at DESC;
