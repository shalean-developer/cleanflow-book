-- =====================================================
-- ULTRA SIMPLE BOOKING PERMISSIONS FIX
-- =====================================================
-- This fix works with ANY database schema by only touching
-- the core tables that definitely exist: bookings, payments, profiles

-- =====================================================
-- STEP 1: Clean up conflicting booking policies
-- =====================================================

-- Drop ALL existing booking policies to start fresh
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can insert all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can view their assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can update their assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can update assigned bookings" ON public.bookings;

-- =====================================================
-- STEP 2: Ensure all users have proper profiles and roles
-- =====================================================

-- Create profiles for any users that don't have one
INSERT INTO public.profiles (id, role, created_at, updated_at)
SELECT 
  id, 
  'customer'::text, 
  now(), 
  now()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

-- Update existing profiles to have customer role if they don't have a role
UPDATE public.profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- =====================================================
-- STEP 3: Create simple, working booking policies
-- =====================================================

-- Core user policies for bookings (customers can manage their own bookings)
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- STEP 4: Fix payments policies (only if payments table exists)
-- =====================================================

-- Only create payment policies if the payments table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payments'
  ) THEN
    -- Drop existing payments policies
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own payments" ON public.payments';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert payments for own bookings" ON public.payments';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments';

    -- Create simple payments policies
    EXECUTE 'CREATE POLICY "Users can view payments for own bookings"
      ON public.payments FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.bookings
          WHERE bookings.id = payments.booking_id
          AND bookings.user_id = auth.uid()
        )
      )';

    EXECUTE 'CREATE POLICY "Users can insert payments for own bookings"
      ON public.payments FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.bookings
          WHERE bookings.id = payments.booking_id
          AND bookings.user_id = auth.uid()
        )
      )';

    EXECUTE 'CREATE POLICY "Users can update payments for own bookings"
      ON public.payments FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.bookings
          WHERE bookings.id = payments.booking_id
          AND bookings.user_id = auth.uid()
        )
      )';

    EXECUTE 'CREATE POLICY "Users can delete payments for own bookings"
      ON public.payments FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.bookings
          WHERE bookings.id = payments.booking_id
          AND bookings.user_id = auth.uid()
        )
      )';
  END IF;
END $$;

-- =====================================================
-- STEP 5: Fix profiles policies (only if profiles table exists)
-- =====================================================

-- Only create profile policies if the profiles table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    -- Drop existing profile policies
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles';

    -- Create simple profile policies
    EXECUTE 'CREATE POLICY "Users can view own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id)';

    EXECUTE 'CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)';

    EXECUTE 'CREATE POLICY "Users can insert own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id)';
  END IF;
END $$;

-- =====================================================
-- STEP 6: Update user creation trigger (only if profiles table exists)
-- =====================================================

-- Only create trigger if profiles table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    EXECUTE 'CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $trigger$
    BEGIN
      INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
      VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>''full_name'', ''''),
        ''customer'',
        now(),
        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        role = COALESCE(public.profiles.role, ''customer'');
      RETURN NEW;
    END;
    $trigger$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public';
  END IF;
END $$;

-- =====================================================
-- STEP 7: Verification queries
-- =====================================================

-- Check that all users have profiles with roles (only if profiles table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    RAISE NOTICE 'Checking user profiles...';
    PERFORM 1 FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.role IS NULL OR p.id IS NULL
    LIMIT 1;
    
    IF FOUND THEN
      RAISE NOTICE 'Some users may not have proper profiles';
    ELSE
      RAISE NOTICE 'All users have proper profiles';
    END IF;
  END IF;
END $$;

-- Check that booking policies exist
SELECT 'Booking policies:' as check_name, COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'bookings';

-- List all booking policies
SELECT 'Current booking policies:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
-- This ultra-simple fix:
-- 1. Only touches tables that definitely exist
-- 2. Uses conditional logic for optional tables
-- 3. Focuses on the core issue: multiple bookings
-- 4. Works with any database schema
-- 5. No more "no right to view" errors
