-- Verification script for Admin Payments Feature
-- Run these queries to verify the payments data is accessible and properly structured

-- 1. Check if payments table exists and view its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- 2. View recent payments with joined booking and service data
-- (This is what the admin dashboard fetches)
SELECT 
    p.id as payment_id,
    p.reference as payment_reference,
    p.amount,
    p.currency,
    p.status as payment_status,
    p.provider,
    p.paid_at,
    p.created_at as payment_created,
    b.reference as booking_reference,
    b.customer_email,
    b.status as booking_status,
    b.date as booking_date,
    b.time as booking_time,
    s.name as service_name,
    s.description as service_description
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
LEFT JOIN services s ON b.service_id = s.id
ORDER BY p.created_at DESC
LIMIT 10;

-- 3. Check payment statistics (what appears in the summary cards)
SELECT 
    COUNT(*) as total_payments,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
    SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as total_revenue
FROM payments;

-- 4. Check payments by provider
SELECT 
    provider,
    COUNT(*) as payment_count,
    SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as successful_revenue
FROM payments
GROUP BY provider
ORDER BY payment_count DESC;

-- 5. Check RLS policies for payments table
-- (Ensure admins have proper access)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'payments'
ORDER BY policyname;

-- 6. Check payments without associated bookings (data integrity check)
SELECT 
    p.id,
    p.reference,
    p.booking_id,
    p.status,
    p.created_at
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
WHERE b.id IS NULL;

-- 7. Check recent payment activity (last 7 days)
SELECT 
    DATE(created_at) as payment_date,
    COUNT(*) as payment_count,
    SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as daily_revenue
FROM payments
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY payment_date DESC;

-- 8. Check which bookings have payments
SELECT 
    b.reference as booking_ref,
    b.status as booking_status,
    b.created_at as booking_created,
    CASE 
        WHEN p.id IS NOT NULL THEN 'Has Payment'
        ELSE 'No Payment'
    END as payment_exists,
    p.status as payment_status,
    p.amount as payment_amount
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id
ORDER BY b.created_at DESC
LIMIT 20;

-- 9. Check payment status distribution
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM payments), 2) as percentage,
    SUM(amount) as total_amount
FROM payments
GROUP BY status
ORDER BY count DESC;

-- 10. Check if admin user can access payments (test query)
-- Replace 'YOUR_ADMIN_USER_ID' with actual admin user ID
-- SELECT 
--     p.*,
--     b.reference as booking_ref,
--     b.customer_email
-- FROM payments p
-- LEFT JOIN bookings b ON p.booking_id = b.id
-- WHERE EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = 'YOUR_ADMIN_USER_ID'
--     AND profiles.role = 'admin'
-- )
-- LIMIT 5;

