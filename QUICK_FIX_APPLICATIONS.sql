-- ============================================================================
-- QUICK FIX: Applications Not Showing in Admin Dashboard
-- ============================================================================
-- 1. Copy this entire file
-- 2. Open Supabase Dashboard > SQL Editor
-- 3. Paste and run
-- 4. Replace 'your-email@example.com' with YOUR actual email address
-- 5. Refresh your admin dashboard
-- ============================================================================

-- First, let's see what we have
SELECT 'Step 1: Checking applications in database' as status;
SELECT COUNT(*) as total_applications FROM cleaner_applications;

-- Check your current user and role
SELECT 'Step 2: Checking your user profile' as status;
SELECT 
    p.id,
    u.email,
    p.role,
    'profiles table' as source
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.id = auth.uid()
UNION ALL
SELECT 
    ur.user_id as id,
    u.email,
    ur.role::text,
    'user_roles table' as source
FROM user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.user_id = auth.uid();

-- Fix RLS policies
SELECT 'Step 3: Fixing RLS policies' as status;

DROP POLICY IF EXISTS "Authenticated users can read applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Anyone can view applications" ON public.cleaner_applications;

CREATE POLICY "Allow authenticated users to view applications"
ON public.cleaner_applications
FOR SELECT
USING (auth.role() = 'authenticated');

-- Update your user to be admin
SELECT 'Step 4: Making you an admin' as status;

-- ⚠️ CHANGE THIS EMAIL TO YOUR EMAIL! ⚠️
DO $$
DECLARE
    user_email TEXT := 'your-email@example.com';  -- ⚠️ CHANGE THIS! ⚠️
    user_uuid UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User not found with email: %', user_email;
        RAISE EXCEPTION 'Please update the email address in this script to your actual email!';
    END IF;
    
    -- Update profiles table
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = user_uuid;
    
    -- Add to user_roles table (if it exists and doesn't already have the role)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_uuid AND role = 'admin'::text) THEN
            INSERT INTO public.user_roles (user_id, role)
            VALUES (user_uuid, 'admin'::text);
        END IF;
    END IF;
    
    RAISE NOTICE 'Successfully made % an admin!', user_email;
END $$;

-- Verify the fix
SELECT 'Step 5: Verification' as status;
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ SUCCESS: You can now see ' || COUNT(*) || ' applications!'
        ELSE '❌ PROBLEM: No applications visible. Check if applications exist in database.'
    END as result
FROM cleaner_applications;

-- Show your admin status
SELECT 
    CASE 
        WHEN p.role = 'admin' THEN '✅ You are an ADMIN (email: ' || u.email || ')'
        ELSE '❌ You are NOT an admin (role: ' || COALESCE(p.role, 'none') || ', email: ' || u.email || ')'
    END as admin_status
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.id = auth.uid();

-- ============================================================================
-- 🎉 ALL DONE! 
-- Now refresh your admin dashboard in the browser
-- You should see all applications in the Applications tab
-- ============================================================================

