-- Fix RLS policies to allow public access to services and related data

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Service areas are viewable by everyone" ON public.service_areas;
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
DROP POLICY IF EXISTS "Cleaner availability is viewable by everyone" ON public.cleaner_availability;
DROP POLICY IF EXISTS "Cleaner service areas are viewable by everyone" ON public.cleaner_service_areas;
DROP POLICY IF EXISTS "Pricing config is viewable by everyone" ON public.pricing_config;

-- Create new policies that explicitly allow both authenticated and anonymous users

-- Services: Allow everyone (authenticated and anon) to view active services
CREATE POLICY "Public can view active services"
ON public.services
FOR SELECT
TO public
USING (active = true);

-- Service Areas: Allow everyone to view active areas
CREATE POLICY "Public can view active service areas"
ON public.service_areas
FOR SELECT
TO public
USING (active = true);

-- Extras: Allow everyone to view active extras
CREATE POLICY "Public can view active extras"
ON public.extras
FOR SELECT
TO public
USING (active = true);

-- Cleaners: Allow everyone to view active cleaners
CREATE POLICY "Public can view active cleaners"
ON public.cleaners
FOR SELECT
TO public
USING (active = true);

-- Cleaner Availability: Allow everyone to view
CREATE POLICY "Public can view cleaner availability"
ON public.cleaner_availability
FOR SELECT
TO public
USING (true);

-- Cleaner Service Areas: Allow everyone to view
CREATE POLICY "Public can view cleaner service areas"
ON public.cleaner_service_areas
FOR SELECT
TO public
USING (true);

-- Pricing Config: Allow everyone to view active pricing
CREATE POLICY "Public can view active pricing"
ON public.pricing_config
FOR SELECT
TO public
USING (active = true);