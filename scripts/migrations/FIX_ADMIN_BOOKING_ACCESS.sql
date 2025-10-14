-- =====================================================
-- FIX ADMIN BOOKING ACCESS ISSUE
-- =====================================================
-- This script fixes the issue where admin users cannot see bookings
-- in the dashboard even though they have admin privileges.

-- Problem: RLS policies only check profiles.role but the auth system
-- also checks user_roles table, causing mismatch.

-- Solution: Update RLS policies to check both tables and ensure
-- admin users have proper roles in both places.

-- =====================================================
-- STEP 1: Ensure admin users have roles in both tables
-- =====================================================

-- First, let's see what we're working with
SELECT 'Current admin users in profiles:' as info;
SELECT id, role, full_name FROM public.profiles WHERE role = 'admin';

SELECT 'Current admin users in user_roles:' as info;
SELECT user_id, role FROM public.user_roles WHERE role = 'admin';

-- =====================================================
-- STEP 2: Sync roles between profiles and user_roles tables
-- =====================================================

-- Update profiles table with admin roles from user_roles
UPDATE public.profiles 
SET role = 'admin'
WHERE id IN (
  SELECT user_id FROM public.user_roles 
  WHERE role = 'admin'
);

-- Update user_roles table with admin roles from profiles (if user_roles exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles'
  ) THEN
    -- Insert missing admin roles into user_roles
    INSERT INTO public.user_roles (user_id, role, created_at)
    SELECT id, 'admin', now()
    FROM public.profiles 
    WHERE role = 'admin'
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = profiles.id
    )
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    RAISE NOTICE 'Updated user_roles table with admin roles from profiles';
  ELSE
    RAISE NOTICE 'user_roles table does not exist, skipping user_roles updates';
  END IF;
END $$;

-- =====================================================
-- STEP 3: Update RLS policies to check both tables
-- =====================================================

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete all bookings" ON public.bookings;

-- Create updated admin policies that check both tables (with conditional user_roles check)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles'
  ) THEN
    -- Create policies that check both profiles and user_roles
    EXECUTE 'CREATE POLICY "Admins can view all bookings"
      ON public.bookings FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can create bookings"
      ON public.bookings FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can update all bookings"
      ON public.bookings FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can delete all bookings"
      ON public.bookings FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';
  ELSE
    -- Create policies that only check profiles table
    EXECUTE 'CREATE POLICY "Admins can view all bookings"
      ON public.bookings FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can create bookings"
      ON public.bookings FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can update all bookings"
      ON public.bookings FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can delete all bookings"
      ON public.bookings FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
      )';
  END IF;
END $$;

-- =====================================================
-- STEP 4: Update cleaner policies to check both tables
-- =====================================================

-- Drop existing cleaner policies
DROP POLICY IF EXISTS "Cleaners can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can update assigned bookings" ON public.bookings;

-- Create updated cleaner policies (only if cleaners.user_id column exists)
DO $$
BEGIN
  -- Check if cleaners.user_id column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cleaners' 
    AND column_name = 'user_id'
  ) THEN
    -- Create cleaner policies with user_id dependency
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user_roles'
    ) THEN
      -- Both cleaners.user_id and user_roles exist
      EXECUTE 'CREATE POLICY "Cleaners can view assigned bookings"
        ON public.bookings FOR SELECT
        USING (
          (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE profiles.id = auth.uid()
              AND profiles.role = ''cleaner''
            )
            OR EXISTS (
              SELECT 1 FROM public.user_roles
              WHERE user_roles.user_id = auth.uid()
              AND user_roles.role = ''cleaner''
            )
          )
          AND cleaner_id IN (
            SELECT id FROM public.cleaners
            WHERE cleaners.user_id = auth.uid()
          )
        )';

      EXECUTE 'CREATE POLICY "Cleaners can update assigned bookings"
        ON public.bookings FOR UPDATE
        USING (
          (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE profiles.id = auth.uid()
              AND profiles.role = ''cleaner''
            )
            OR EXISTS (
              SELECT 1 FROM public.user_roles
              WHERE user_roles.user_id = auth.uid()
              AND user_roles.role = ''cleaner''
            )
          )
          AND cleaner_id IN (
            SELECT id FROM public.cleaners
            WHERE cleaners.user_id = auth.uid()
          )
        )';
    ELSE
      -- Only cleaners.user_id exists, no user_roles
      EXECUTE 'CREATE POLICY "Cleaners can view assigned bookings"
        ON public.bookings FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''cleaner''
          )
          AND cleaner_id IN (
            SELECT id FROM public.cleaners
            WHERE cleaners.user_id = auth.uid()
          )
        )';

      EXECUTE 'CREATE POLICY "Cleaners can update assigned bookings"
        ON public.bookings FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''cleaner''
          )
          AND cleaner_id IN (
            SELECT id FROM public.cleaners
            WHERE cleaners.user_id = auth.uid()
          )
        )';
    END IF;
  ELSE
    -- No cleaners.user_id column - create simplified policies
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user_roles'
    ) THEN
      -- Only user_roles exists, no cleaners.user_id
      EXECUTE 'CREATE POLICY "Cleaners can view assigned bookings"
        ON public.bookings FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''cleaner''
          )
          OR EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = ''cleaner''
          )
        )';

      EXECUTE 'CREATE POLICY "Cleaners can update assigned bookings"
        ON public.bookings FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''cleaner''
          )
          OR EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = ''cleaner''
          )
        )';
    ELSE
      -- Neither cleaners.user_id nor user_roles exist
      EXECUTE 'CREATE POLICY "Cleaners can view assigned bookings"
        ON public.bookings FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''cleaner''
          )
        )';

      EXECUTE 'CREATE POLICY "Cleaners can update assigned bookings"
        ON public.bookings FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = ''cleaner''
          )
        )';
    END IF;
  END IF;
END $$;

-- =====================================================
-- STEP 5: Update payments policies to check both tables (only if table exists)
-- =====================================================

-- Only create payments policies if the table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payments'
  ) THEN
    -- Drop existing admin payment policies
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments';

    -- Create updated admin payment policies
    EXECUTE 'CREATE POLICY "Admins can view all payments"
      ON public.payments FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can update all payments"
      ON public.payments FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';
  ELSE
    RAISE NOTICE 'payments table does not exist, skipping payments policies';
  END IF;
END $$;

-- =====================================================
-- STEP 6: Update booking_extras admin policies (only if table exists)
-- =====================================================

-- Only create booking_extras policies if the table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'booking_extras'
  ) THEN
    -- Drop existing admin booking_extras policies
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage all booking extras" ON public.booking_extras';
    
    -- Create updated admin booking_extras policies
    EXECUTE 'CREATE POLICY "Admins can manage all booking extras"
      ON public.booking_extras FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';
  ELSE
    RAISE NOTICE 'booking_extras table does not exist, skipping booking_extras policies';
  END IF;
END $$;

-- =====================================================
-- STEP 7: Update profiles admin policies
-- =====================================================

-- Drop existing admin profile policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create updated admin profile policies (with conditional user_roles check)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles'
  ) THEN
    -- Create policies that check both profiles and user_roles
    EXECUTE 'CREATE POLICY "Admins can view all profiles"
      ON public.profiles FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid()
          AND p.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can update all profiles"
      ON public.profiles FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid()
          AND p.role = ''admin''
        )
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = ''admin''
        )
      )';
  ELSE
    -- Create policies that only check profiles table
    EXECUTE 'CREATE POLICY "Admins can view all profiles"
      ON public.profiles FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid()
          AND p.role = ''admin''
        )
      )';

    EXECUTE 'CREATE POLICY "Admins can update all profiles"
      ON public.profiles FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid()
          AND p.role = ''admin''
        )
      )';
  END IF;
END $$;

-- =====================================================
-- STEP 8: Verification queries
-- =====================================================

-- Check final admin users in both tables
SELECT 'Final admin users in profiles:' as info;
SELECT id, role, full_name FROM public.profiles WHERE role = 'admin';

SELECT 'Final admin users in user_roles:' as info;
SELECT user_id, role FROM public.user_roles WHERE role = 'admin';

-- Check that booking policies exist
SELECT 'Current booking policies:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;

-- Check total bookings count (this should work for admin users now)
SELECT 'Total bookings in database:' as info, COUNT(*) as count
FROM public.bookings;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
-- After running this script:
-- 1. Admin users should be able to see all bookings in dashboard
-- 2. Both profiles.role and user_roles.role are checked for admin access
-- 3. Roles are synchronized between both tables
-- 4. All admin policies now work with the dual-role system
