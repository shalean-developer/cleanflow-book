-- Enable admin management of pricing (services and extras tables)
-- This migration re-enables RLS with proper policies for admin updates

-- =============================================
-- PART 1: Services Table - Enable RLS and Admin Policies
-- =============================================

-- Re-enable RLS on services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;

-- Create public read policy (everyone can view all services)
CREATE POLICY "Services are viewable by everyone"
ON public.services
FOR SELECT
TO public
USING (true);

-- Create admin update policy
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

-- Create admin insert policy
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

-- Create admin delete policy
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

-- =============================================
-- PART 2: Extras Table - Enable RLS and Admin Policies
-- =============================================

-- Re-enable RLS on extras table
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
DROP POLICY IF EXISTS "Public can view active extras" ON public.extras;
DROP POLICY IF EXISTS "Admins can manage extras" ON public.extras;
DROP POLICY IF EXISTS "Admins can update extras" ON public.extras;
DROP POLICY IF EXISTS "Admins can insert extras" ON public.extras;
DROP POLICY IF EXISTS "Admins can delete extras" ON public.extras;

-- Create public read policy (everyone can view all extras)
CREATE POLICY "Extras are viewable by everyone"
ON public.extras
FOR SELECT
TO public
USING (true);

-- Create admin update policy
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

-- Create admin insert policy
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

-- Create admin delete policy
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

-- =============================================
-- Verification
-- =============================================
-- This migration ensures:
-- 1. Public users can still view all services and extras (SELECT)
-- 2. Only admin users can modify services and extras (INSERT, UPDATE, DELETE)
-- 3. RLS is properly enabled to enforce these policies

