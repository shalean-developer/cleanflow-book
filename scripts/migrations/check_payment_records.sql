-- Check existing payment records to see what's been created

-- Check all recent payments
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status,
  p.created_at as payment_created
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
ORDER BY b.created_at DESC
LIMIT 10;

-- Check specifically for the reference that already exists
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status,
  p.created_at as payment_created
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE p.reference = 'BK-1760311914772-s6sjgzkp0';

-- Check the latest booking
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status,
  p.created_at as payment_created
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE b.reference = 'BK-1760311864892-6tcejwh2s';
