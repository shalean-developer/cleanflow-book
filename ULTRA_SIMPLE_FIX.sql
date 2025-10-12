-- ============================================================================
-- ULTRA SIMPLE FIX: Make yourself admin (No complex logic)
-- ============================================================================
-- 1. Change YOUR EMAIL below (line 8)
-- 2. Copy this entire file
-- 3. Paste into Supabase SQL Editor
-- 4. Click RUN
-- ============================================================================

-- ⚠️ CHANGE THIS EMAIL! ⚠️
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'your-email@example.com'  -- ⚠️ PUT YOUR EMAIL HERE! ⚠️
);

-- Fix RLS policy to allow authenticated users to view applications
DROP POLICY IF EXISTS "Authenticated users can read applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.cleaner_applications;

CREATE POLICY "Allow authenticated users to view applications"
ON public.cleaner_applications
FOR SELECT
USING (auth.role() = 'authenticated');

-- Show result
SELECT 
    'You can now see ' || COUNT(*) || ' applications! Refresh your dashboard.' as result
FROM cleaner_applications;

-- ============================================================================
-- DONE! Now refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
-- ============================================================================

