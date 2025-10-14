-- Fix missing payment records for existing bookings
-- Run this to create payment records for bookings that don't have them

-- First, let's see what we're working with
SELECT 
  b.id as booking_id,
  b.reference as booking_reference,
  b.payment_reference,
  b.status as booking_status,
  b.user_id,
  b.pricing,
  b.created_at
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE p.reference IS NULL
  AND b.payment_reference IS NOT NULL
  AND b.created_at > NOW() - INTERVAL '24 hours'
ORDER BY b.created_at DESC;

-- Create payment records for missing ones
-- Note: This will only work if you have admin privileges or if RLS policies allow it

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
  b.id as booking_id,
  'paystack' as provider,
  b.payment_reference as reference,
  'success' as status,
  COALESCE(
    (b.pricing->>'total')::decimal,
    (b.pricing->>'service_price')::decimal,
    0
  ) as amount,
  'ZAR' as currency,
  b.created_at as paid_at,
  b.created_at
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE p.reference IS NULL
  AND b.payment_reference IS NOT NULL
  AND b.created_at > NOW() - INTERVAL '24 hours'
  AND b.status = 'confirmed';

-- Verify the fix worked
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE b.reference = 'BK-1760309196047-6tcczw691';

-- Check for any remaining missing payment records
SELECT COUNT(*) as missing_payments
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
WHERE p.reference IS NULL
  AND b.payment_reference IS NOT NULL
  AND b.created_at > NOW() - INTERVAL '24 hours';
