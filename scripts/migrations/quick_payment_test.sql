-- Quick test to verify payment data and relationships
-- Run this to see what data is actually available

-- 1. Check recent payments
SELECT 
    p.id,
    p.reference,
    p.amount,
    p.status,
    p.booking_id,
    p.created_at
FROM payments p
ORDER BY p.created_at DESC
LIMIT 3;

-- 2. Check if payments have valid booking_ids
SELECT 
    p.id as payment_id,
    p.booking_id,
    b.id as booking_exists,
    b.reference as booking_ref,
    b.customer_email
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
ORDER BY p.created_at DESC
LIMIT 5;

-- 3. Check the exact query structure that should work
-- This simulates what the frontend should be doing
SELECT 
    p.id,
    p.reference,
    p.amount,
    p.status,
    p.provider,
    p.paid_at,
    p.created_at,
    b.reference as booking_reference,
    b.customer_email,
    b.status as booking_status,
    s.name as service_name
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
LEFT JOIN services s ON b.service_id = s.id
ORDER BY p.created_at DESC
LIMIT 3;
