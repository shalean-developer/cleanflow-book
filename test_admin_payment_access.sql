-- Test admin access to payments and verify the join works
-- This will help us understand if the issue is with RLS or the query structure

-- 1. Check if the is_admin function exists and works
SELECT public.is_admin(auth.uid()) as is_current_user_admin;

-- 2. Check current user's role
SELECT 
    p.id,
    p.role,
    p.full_name
FROM profiles p
WHERE p.id = auth.uid();

-- 3. Test the exact query that the frontend should be using
-- (This should work if the user is admin)
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

-- 4. Check if there are any RLS policy conflicts
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('payments', 'bookings', 'services')
ORDER BY tablename, policyname;

-- 5. Test if we can access payments at all
SELECT COUNT(*) as total_payments FROM payments;

-- 6. Test if we can access bookings at all  
SELECT COUNT(*) as total_bookings FROM bookings;

-- 7. Test if we can access services at all
SELECT COUNT(*) as total_services FROM services;
