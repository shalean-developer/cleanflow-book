-- Auto-fix: Create payment record for the specific booking
-- This query automatically gets the booking ID and creates the payment record

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
WHERE reference = 'BK-1760309196047-6tcczw691'
  AND payment_reference = 'BK-1760309244527-7qyv8ehya'
  AND NOT EXISTS (
    SELECT 1 FROM payments 
    WHERE reference = 'BK-1760309244527-7qyv8ehya'
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
WHERE b.reference = 'BK-1760309196047-6tcczw691';
