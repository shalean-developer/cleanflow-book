-- Fix admin booking permissions to resolve 500 errors
-- This migration ensures admins can update bookings and assign cleaners

-- =====================================================
-- STEP 1: Ensure admin function exists and works
-- =====================================================

-- Create or replace the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = uid AND ur.role = 'admin'
  );
$$;

-- =====================================================
-- STEP 2: Drop all existing booking policies to avoid conflicts
-- =====================================================

-- Drop all existing booking policies (with error handling)
DO $$
BEGIN
  -- Drop all possible booking policy variations
  DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admins can delete all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admins can insert all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Cleaners can view their assigned bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Cleaners can view assigned bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Cleaners can update their assigned bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Cleaners can update assigned bookings" ON public.bookings;
  DROP POLICY IF EXISTS "bookings admin or owner can read" ON public.bookings;
  DROP POLICY IF EXISTS "bookings_admin_read" ON public.bookings;
  DROP POLICY IF EXISTS "admin_bookings_access" ON public.bookings;
  DROP POLICY IF EXISTS "bookings admin read all" ON public.bookings;
EXCEPTION
  WHEN OTHERS THEN
    -- Continue even if some policies don't exist
    NULL;
END $$;

-- =====================================================
-- STEP 3: Create clean, working booking policies
-- =====================================================

-- User policies for bookings (customers can manage their own bookings)
DO $$
BEGIN
  CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can create their own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can delete their own bookings"
    ON public.bookings FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Admin policies for bookings (admins can manage all bookings)
DO $$
BEGIN
  CREATE POLICY "Admins can view all bookings"
    ON public.bookings FOR SELECT
    USING (public.is_admin(auth.uid()));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Admins can create all bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Admins can update all bookings"
    ON public.bookings FOR UPDATE
    USING (public.is_admin(auth.uid()));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Admins can delete all bookings"
    ON public.bookings FOR DELETE
    USING (public.is_admin(auth.uid()));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- STEP 4: Create cleaner policies (if cleaners table exists)
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cleaners') THEN
    -- Cleaner policies for bookings (cleaners can view their assigned bookings)
    BEGIN
      EXECUTE 'CREATE POLICY "Cleaners can view assigned bookings"
        ON public.bookings FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.cleaners c
            WHERE c.user_id = auth.uid()
            AND c.id = bookings.cleaner_id
          )
        )';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
      
    BEGIN
      EXECUTE 'CREATE POLICY "Cleaners can update assigned bookings"
        ON public.bookings FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.cleaners c
            WHERE c.user_id = auth.uid()
            AND c.id = bookings.cleaner_id
          )
        )';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- =====================================================
-- STEP 5: Ensure profiles table has admin users
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
-- STEP 6: Add helpful comments
-- =====================================================

COMMENT ON FUNCTION public.is_admin(uuid) IS 'Check if a user has admin role in profiles or user_roles table';
