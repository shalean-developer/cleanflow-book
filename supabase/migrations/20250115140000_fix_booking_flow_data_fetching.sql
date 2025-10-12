-- Fix booking flow data fetching issues
-- This migration ensures that services, extras, and cleaners data can be fetched
-- by all users (including anonymous users) during the booking flow

-- =============================================
-- PART 1: Clean up conflicting policies
-- =============================================

-- Services table policies
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Public can view active services" ON public.services;

-- Extras table policies  
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
DROP POLICY IF EXISTS "Public can view active extras" ON public.extras;

-- Cleaners table policies
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
DROP POLICY IF EXISTS "Public can view active cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Anyone can view cleaners" ON public.cleaners;

-- =============================================
-- PART 2: Re-enable RLS if disabled
-- =============================================

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PART 3: Create comprehensive public read policies
-- =============================================

-- Services: Allow everyone (authenticated, anonymous, and anon) to view all services
-- Using 'TO public' ensures both authenticated and anonymous users can access
CREATE POLICY "Everyone can view all services"
ON public.services
FOR SELECT
TO public
USING (true);

-- Extras: Allow everyone to view all extras
CREATE POLICY "Everyone can view all extras"
ON public.extras
FOR SELECT
TO public
USING (true);

-- Cleaners: Allow everyone to view all cleaners
CREATE POLICY "Everyone can view all cleaners"
ON public.cleaners
FOR SELECT
TO public
USING (true);

-- =============================================
-- PART 4: Maintain admin update policies
-- =============================================

-- Services admin policies
CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Extras admin policies
CREATE POLICY "Admins can update extras"
ON public.extras
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can insert extras"
ON public.extras
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete extras"
ON public.extras
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Cleaners admin policies (only if not already present from other migrations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cleaners' 
    AND policyname = 'Admins can update cleaners'
  ) THEN
    CREATE POLICY "Admins can update cleaners"
    ON public.cleaners
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cleaners' 
    AND policyname = 'Admins can insert cleaners'
  ) THEN
    CREATE POLICY "Admins can insert cleaners"
    ON public.cleaners
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cleaners' 
    AND policyname = 'Admins can delete cleaners'
  ) THEN
    CREATE POLICY "Admins can delete cleaners"
    ON public.cleaners
    FOR DELETE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );
  END IF;
END $$;

-- =============================================
-- Verification
-- =============================================
-- This migration ensures:
-- 1. RLS is enabled on services, extras, and cleaners tables
-- 2. All users (including anonymous) can read services, extras, and cleaners
-- 3. Only admins can modify services, extras, and cleaners
-- 4. Existing admin policies are preserved

