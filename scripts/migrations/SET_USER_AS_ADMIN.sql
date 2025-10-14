-- =====================================================
-- SET CURRENT USER AS ADMIN
-- =====================================================
-- This script will help you set your user account as an admin
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: Check current user and admin status
-- =====================================================

-- First, let's see all users and their current roles
SELECT 'Current users and their roles:' as info;
SELECT 
  p.id,
  p.full_name,
  p.role as profile_role,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;

-- Check if any users are already admin
SELECT 'Existing admin users:' as info;
SELECT id, full_name, role FROM public.profiles WHERE role = 'admin';

-- =====================================================
-- STEP 2: Find your user ID
-- =====================================================

-- Get the most recent user (likely you)
SELECT 'Most recent user (likely you):' as info;
SELECT 
  p.id as user_id,
  p.full_name,
  p.role,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC
LIMIT 1;

-- =====================================================
-- STEP 3: Set the most recent user as admin
-- =====================================================

-- Update the most recent user to be admin
UPDATE public.profiles 
SET role = 'admin'
WHERE id = (
  SELECT id FROM public.profiles 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- =====================================================
-- STEP 4: Verify the change
-- =====================================================

-- Check that the user is now admin
SELECT 'Updated admin status:' as info;
SELECT 
  p.id,
  p.full_name,
  p.role,
  'Updated to admin' as status
FROM public.profiles p
WHERE p.role = 'admin'
ORDER BY p.created_at DESC;

-- =====================================================
-- ALTERNATIVE: Manual Admin Assignment
-- =====================================================

-- If the above doesn't work, you can manually set a specific user as admin
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from the query above
/*
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'YOUR_USER_ID_HERE';
*/

-- =====================================================
-- STEP 5: Check if user_roles table exists and update it too
-- =====================================================

-- If user_roles table exists, update it as well
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles'
  ) THEN
    -- Update user_roles table for the most recent user
    INSERT INTO public.user_roles (user_id, role, created_at)
    SELECT id, 'admin', now()
    FROM public.profiles 
    WHERE role = 'admin'
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = profiles.id
    )
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    
    RAISE NOTICE 'Also updated user_roles table with admin role';
  ELSE
    RAISE NOTICE 'user_roles table does not exist, only updated profiles table';
  END IF;
END $$;

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================

-- Final check: Show all admin users
SELECT 'Final admin users check:' as info;
SELECT 
  p.id,
  p.full_name,
  p.role,
  p.created_at
FROM public.profiles p
WHERE p.role = 'admin';

-- =====================================================
-- INSTRUCTIONS
-- =====================================================
/*
After running this script:

1. Log out of your application completely
2. Clear your browser cache/cookies (or use incognito mode)
3. Log back in
4. Try accessing the admin dashboard again

If you still get "Access Denied", check:
- Your user ID in the results above
- Make sure you're logging in with the correct email
- Check browser console for any authentication errors
*/
