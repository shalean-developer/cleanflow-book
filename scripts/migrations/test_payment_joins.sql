-- Test payment joins to verify data structure
-- This will help us understand why the admin dashboard shows N/A values

-- 1. Check if payments exist and their structure
SELECT 
    p.id,
    p.reference,
    p.amount,
    p.status,
    p.booking_id,
    p.created_at
FROM payments p
ORDER BY p.created_at DESC
LIMIT 5;

-- 2. Check payments with booking joins
SELECT 
    p.id as payment_id,
    p.reference as payment_reference,
    p.amount,
    p.status as payment_status,
    p.booking_id,
    b.reference as booking_reference,
    b.customer_email,
    b.status as booking_status
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
ORDER BY p.created_at DESC
LIMIT 5;

-- 3. Check payments with full joins (what the admin dashboard should see)
SELECT 
    p.id as payment_id,
    p.reference as payment_reference,
    p.amount,
    p.status as payment_status,
    p.provider,
    p.paid_at,
    p.created_at as payment_created,
    b.reference as booking_reference,
    b.customer_email,
    b.status as booking_status,
    b.date as booking_date,
    b.time as booking_time,
    s.name as service_name
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
LEFT JOIN services s ON b.service_id = s.id
ORDER BY p.created_at DESC
LIMIT 5;

-- 4. Check if there are any payments without booking_id
SELECT 
    COUNT(*) as payments_without_booking
FROM payments p
WHERE p.booking_id IS NULL;

-- 5. Check if there are any bookings without payments
SELECT 
    COUNT(*) as bookings_without_payments
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id
WHERE p.id IS NULL;

-- 6. Test the exact query that the admin dashboard uses
-- (This simulates what the frontend should be doing)
SELECT 
    p.*,
    json_build_object(
        'id', b.id,
        'reference', b.reference,
        'customer_email', b.customer_email,
        'status', b.status,
        'date', b.date,
        'time', b.time,
        'services', json_build_object(
            'id', s.id,
            'name', s.name,
            'description', s.description
        )
    ) as bookings
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
LEFT JOIN services s ON b.service_id = s.id
ORDER BY p.created_at DESC
LIMIT 5;
