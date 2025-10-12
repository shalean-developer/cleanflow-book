-- Fix the second missing payment record
-- BK-1760309805798-r76nk8duj with payment reference BK-1760309850121-1i6uhuinq

-- Create payment record for the second booking
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
WHERE reference = 'BK-1760309805798-r76nk8duj'
  AND payment_reference = 'BK-1760309850121-1i6uhuinq'
  AND NOT EXISTS (
    SELECT 1 FROM payments 
    WHERE reference = 'BK-1760309850121-1i6uhuinq'
  );

-- Verify both payment records exist
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE b.reference IN ('BK-1760309805798-r76nk8duj', 'BK-1760309196047-6tcczw691')
ORDER BY b.created_at DESC;
