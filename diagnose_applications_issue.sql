-- ============================================================================
-- DIAGNOSTIC SCRIPT: Check why applications aren't showing in admin dashboard
-- ============================================================================
-- Run this in Supabase SQL Editor to diagnose the issue
-- ============================================================================

-- 1. Check if applications exist in the database
SELECT 
    'Total Applications' as check_name,
    COUNT(*) as count,
    jsonb_agg(
        jsonb_build_object(
            'id', id,
            'name', first_name || ' ' || last_name,
            'email', email,
            'status', status,
            'created_at', created_at
        )
    ) as details
FROM cleaner_applications;

-- 2. Check current user's profile and role
SELECT 
    'Current User Profile' as check_name,
    p.id,
    p.full_name,
    u.email,
    p.role,
    p.created_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.id = auth.uid();

-- 2b. Check user_roles table (newer role system)
SELECT 
    'User Roles Table' as check_name,
    user_id,
    role,
    created_at
FROM user_roles
WHERE user_id = auth.uid();

-- 3. Check if current user is marked as admin
SELECT 
    'Is Current User Admin?' as check_name,
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    ) as is_admin;

-- 4. List all RLS policies on cleaner_applications table
SELECT 
    'RLS Policies on cleaner_applications' as check_name,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'cleaner_applications'
ORDER BY cmd, policyname;

-- 5. Check if RLS is enabled
SELECT 
    'RLS Status' as check_name,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'cleaner_applications';

-- 6. Test if admin policy would work
SELECT 
    'Admin Policy Test' as check_name,
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    ) as admin_policy_passes;

-- 7. Check auth role (different from user role in profiles)
SELECT 
    'Auth Role' as check_name,
    auth.role() as auth_role,
    auth.uid() as user_id;

-- ============================================================================
-- RESULTS INTERPRETATION:
-- - If "Total Applications" shows 0, applications don't exist
-- - If "Is Current User Admin?" is FALSE, your user isn't marked as admin
-- - Check "RLS Policies" to see what policies are active
-- - If "Admin Policy Test" is FALSE, the admin policy won't let you see data
-- ============================================================================

