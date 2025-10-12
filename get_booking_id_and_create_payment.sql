-- Step 1: Get the actual booking ID for the specific booking
SELECT 
  id,
  reference,
  payment_reference,
  pricing,
  created_at
FROM bookings 
WHERE reference = 'BK-1760309196047-6tcczw691';

-- Step 2: Create the payment record using the actual booking ID
-- (Run this after getting the booking ID from step 1)
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
WHERE reference = 'BK-1760309196047-6tcczw691';

-- Step 3: Verify the payment record was created
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
