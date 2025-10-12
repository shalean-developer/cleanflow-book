-- Fix the payment record for the latest booking
-- BK-1760311864892-6tcejwh2s with payment reference BK-1760311914772-s6sjgzkp0

-- First, let's check if the booking exists and get its details
SELECT 
  id,
  reference,
  payment_reference,
  pricing,
  user_id,
  created_at
FROM bookings 
WHERE reference = 'BK-1760311864892-6tcejwh2s';

-- Create the missing payment record
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
WHERE reference = 'BK-1760311864892-6tcejwh2s'
  AND payment_reference = 'BK-1760311914772-s6sjgzkp0'
  AND NOT EXISTS (
    SELECT 1 FROM payments 
    WHERE reference = 'BK-1760311914772-s6sjgzkp0'
  );

-- Verify the fix worked
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
