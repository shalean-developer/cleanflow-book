-- ============================================
-- FIX EXTRAS AND QUOTES RLS POLICIES
-- ============================================
-- This migration ensures:
-- 1. Extras can be fetched by everyone (including anonymous users)
-- 2. Quotes can be submitted and viewed properly
-- ============================================

-- PART 1: Fix Extras Table RLS
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing conflicting policies
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
DROP POLICY IF EXISTS "Public can view active extras" ON public.extras;
DROP POLICY IF EXISTS "Everyone can view all extras" ON public.extras;
DROP POLICY IF EXISTS "Admins can manage extras" ON public.extras;
DROP POLICY IF EXISTS "Admins can update extras" ON public.extras;
DROP POLICY IF EXISTS "Admins can insert extras" ON public.extras;
DROP POLICY IF EXISTS "Admins can delete extras" ON public.extras;

-- Create ONE clear public read policy
CREATE POLICY "Enable read access for all users"
ON public.extras
FOR SELECT
TO public
USING (true);

-- Admin policies for managing extras (if profiles table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    -- Admin can update extras
    EXECUTE 'CREATE POLICY "Admins can update extras"
    ON public.extras
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = ''admin''
      )
    )';

    -- Admin can insert extras
    EXECUTE 'CREATE POLICY "Admins can insert extras"
    ON public.extras
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = ''admin''
      )
    )';

    -- Admin can delete extras
    EXECUTE 'CREATE POLICY "Admins can delete extras"
    ON public.extras
    FOR DELETE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = ''admin''
      )
    )';
  END IF;
END $$;

-- ============================================
-- PART 2: Ensure Services and Cleaners RLS
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

-- Clean up services policies
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
DROP POLICY IF EXISTS "Everyone can view all services" ON public.services;

-- Create services read policy
CREATE POLICY "Enable read access for all users"
ON public.services
FOR SELECT
TO public
USING (true);

-- Clean up cleaners policies
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
DROP POLICY IF EXISTS "Public can view active cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Everyone can view all cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Anyone can view cleaners" ON public.cleaners;

-- Create cleaners read policy
CREATE POLICY "Enable read access for all users"
ON public.cleaners
FOR SELECT
TO public
USING (true);

-- ============================================
-- PART 3: Verify Quotes Table Policies
-- ============================================

-- Drop and recreate quotes policies if table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') THEN
    -- Ensure RLS is enabled
    EXECUTE 'ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY';
    
    -- Drop existing policies
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can submit quotes" ON public.quotes';
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their quotes" ON public.quotes';
    EXECUTE 'DROP POLICY IF EXISTS "Enable insert for all users" ON public.quotes';
    
    -- Anyone can submit quotes
    EXECUTE 'CREATE POLICY "Enable insert for all users"
    ON public.quotes
    FOR INSERT
    TO public
    WITH CHECK (true)';
    
    -- Users can view their own quotes by email (both authenticated and anonymous)
    EXECUTE 'CREATE POLICY "Enable select for users based on email"
    ON public.quotes
    FOR SELECT
    TO public
    USING (
      email = current_setting(''request.jwt.claims'', true)::json->>''email''
      OR
      (auth.jwt() IS NOT NULL AND email = auth.jwt()->>''email'')
    )';
  END IF;
END $$;

-- ============================================
-- Verification
-- ============================================

-- Show current policies for extras
SELECT 
  'EXTRAS POLICIES' as table_name,
  policyname,
  cmd as operation,
  roles,
  qual as using_expression
FROM pg_policies
WHERE tablename = 'extras';

-- Show current policies for quotes (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quotes') THEN
    PERFORM 1; -- Placeholder
  END IF;
END $$;

SELECT 'Migration completed successfully!' as status;

