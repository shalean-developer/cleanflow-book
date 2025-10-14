-- ============================================================================
-- SIMPLE FIX: Make yourself an admin to see applications
-- ============================================================================
-- 1. Change 'your-email@example.com' below to YOUR email
-- 2. Copy and paste this entire file into Supabase SQL Editor
-- 3. Click RUN
-- 4. Refresh your admin dashboard
-- ============================================================================

-- ⚠️ CHANGE THIS EMAIL TO YOURS! ⚠️
DO $$
DECLARE
    v_user_email TEXT := 'your-email@example.com';  -- ⚠️ CHANGE THIS! ⚠️
    v_user_id UUID;
BEGIN
    -- Get user ID from email
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;
    
    -- Check if user exists
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found with email: %. Please change the email address!', v_user_email;
    END IF;
    
    -- Make user admin in profiles table
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = v_user_id;
    
    -- Add to user_roles table (if table exists and doesn't already have the role)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'admin'::text) THEN
            INSERT INTO public.user_roles (user_id, role)
            VALUES (v_user_id, 'admin'::text);
        END IF;
    END IF;
    
    RAISE NOTICE '✅ Success! User % is now an admin. Refresh your dashboard!', v_user_email;
END $$;

-- Fix RLS policy
DROP POLICY IF EXISTS "Authenticated users can read applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.cleaner_applications;

CREATE POLICY "Allow authenticated users to view applications"
ON public.cleaner_applications
FOR SELECT
USING (auth.role() = 'authenticated');

-- Verify (should show your applications count)
SELECT COUNT(*) as applications_count FROM cleaner_applications;

-- ============================================================================
-- DONE! Now refresh your admin dashboard (Ctrl+Shift+R)
-- ============================================================================

