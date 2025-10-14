-- =====================================================
-- FIX MULTIPLE BOOKING PERMISSIONS ISSUE
-- =====================================================
-- This script fixes the "no right to view" error that occurs 
-- after making the first booking, preventing users from making additional bookings.

-- Problem: Conflicting RLS policies from multiple migrations
-- Solution: Clean up all conflicting policies and create consistent ones

-- =====================================================
-- STEP 1: Clean up all conflicting booking policies
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
-- STEP 3: Create clean, consistent booking policies
-- =====================================================

-- User policies for bookings (customers can manage their own bookings)
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

-- Admin policies for bookings (admins can manage all bookings)
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all bookings"
  ON public.bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Cleaner policies for bookings (cleaners can view/update their assigned bookings)
-- Note: These policies only work if cleaners.user_id column exists
-- If you get an error about cleaners.user_id not existing, skip these policies
DO $$
BEGIN
  -- Check if cleaners.user_id column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cleaners' 
    AND column_name = 'user_id'
  ) THEN
    -- Create cleaner policies only if user_id column exists
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
END $$;

-- =====================================================
-- STEP 4: Fix booking_extras policies
-- =====================================================

-- Drop existing booking_extras policies
DROP POLICY IF EXISTS "Users can view booking extras" ON public.booking_extras;
DROP POLICY IF EXISTS "Users can insert booking extras" ON public.booking_extras;
DROP POLICY IF EXISTS "Users can update booking extras" ON public.booking_extras;
DROP POLICY IF EXISTS "Users can delete booking extras" ON public.booking_extras;
DROP POLICY IF EXISTS "Users can delete own booking extras" ON public.booking_extras;

-- Create consistent booking_extras policies
CREATE POLICY "Users can view booking extras for own bookings"
  ON public.booking_extras FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert booking extras for own bookings"
  ON public.booking_extras FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update booking extras for own bookings"
  ON public.booking_extras FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete booking extras for own bookings"
  ON public.booking_extras FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Admin policies for booking_extras
CREATE POLICY "Admins can manage all booking extras"
  ON public.booking_extras FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- STEP 5: Fix payments policies
-- =====================================================

-- Drop existing payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert payments for own bookings" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments;

-- Create consistent payments policies
CREATE POLICY "Users can view payments for own bookings"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert payments for own bookings"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update payments for own bookings"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete payments for own bookings"
  ON public.payments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Admin policies for payments
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all payments"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- STEP 6: Ensure profiles policies are correct
-- =====================================================

-- Drop existing profile policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

-- Create consistent profile policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- =====================================================
-- STEP 7: Update user creation trigger
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = COALESCE(public.profiles.role, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- STEP 8: Verification queries
-- =====================================================

-- Check that all users have profiles with roles
SELECT 'Users without profiles or roles:' as check_name, COUNT(*) as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.role IS NULL OR p.id IS NULL;

-- Check that booking policies exist
SELECT 'Booking policies:' as check_name, COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'bookings';

-- Check that profile policies exist
SELECT 'Profile policies:' as check_name, COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'profiles';

-- List all booking policies
SELECT 'Current booking policies:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;

-- Test user booking access (replace with actual user ID)
-- SELECT 'Test booking access for user:' as test, COUNT(*) as booking_count
-- FROM public.bookings 
-- WHERE user_id = auth.uid();

-- =====================================================
-- END OF SCRIPT
-- =====================================================
-- After running this script:
-- 1. Users should be able to make multiple bookings
-- 2. Each user can only see their own bookings
-- 3. Admins can see all bookings
-- 4. Cleaners can see bookings assigned to them
-- 5. No more "no right to view" errors after first booking
