-- Manual fix for the specific booking that's missing a payment record
-- BK-1760309196047-6tcczw691

-- First, get the booking details
SELECT 
  id,
  reference,
  payment_reference,
  pricing,
  user_id,
  created_at
FROM bookings 
WHERE reference = 'BK-1760309196047-6tcczw691';

-- Create the missing payment record
-- Note: Replace the booking_id with the actual ID from the query above
INSERT INTO payments (
  booking_id,
  provider,
  reference,
  status,
  amount,
  currency,
  paid_at,
  created_at
) VALUES (
  (SELECT id FROM bookings WHERE reference = 'BK-1760309196047-6tcczw691'),
  'paystack',
  'BK-1760309244527-7qyv8ehya',
  'success',
  COALESCE(
    (SELECT (pricing->>'total')::decimal FROM bookings WHERE reference = 'BK-1760309196047-6tcczw691'),
    435.60
  ),
  'ZAR',
  (SELECT created_at FROM bookings WHERE reference = 'BK-1760309196047-6tcczw691'),
  NOW()
);

-- Verify the fix
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status,
  p.created_at as payment_created
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE b.reference = 'BK-1760309196047-6tcczw691';
