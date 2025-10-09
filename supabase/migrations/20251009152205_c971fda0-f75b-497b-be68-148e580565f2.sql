-- Ensure RLS is enabled on all public tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
DROP POLICY IF EXISTS "Public can view active service areas" ON public.service_areas;
DROP POLICY IF EXISTS "Public can view active extras" ON public.extras;
DROP POLICY IF EXISTS "Public can view active cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Public can view cleaner availability" ON public.cleaner_availability;
DROP POLICY IF EXISTS "Public can view cleaner service areas" ON public.cleaner_service_areas;
DROP POLICY IF EXISTS "Public can view active pricing" ON public.pricing_config;

-- Create public read policies for anonymous and authenticated users
CREATE POLICY "Public can view active services"
ON public.services FOR SELECT TO public
USING (active = true);

CREATE POLICY "Public can view active service areas"
ON public.service_areas FOR SELECT TO public
USING (active = true);

CREATE POLICY "Public can view active extras"
ON public.extras FOR SELECT TO public
USING (active = true);

CREATE POLICY "Public can view active cleaners"
ON public.cleaners FOR SELECT TO public
USING (active = true);

CREATE POLICY "Public can view cleaner availability"
ON public.cleaner_availability FOR SELECT TO public
USING (true);

CREATE POLICY "Public can view cleaner service areas"
ON public.cleaner_service_areas FOR SELECT TO public
USING (true);

CREATE POLICY "Public can view active pricing"
ON public.pricing_config FOR SELECT TO public
USING (active = true);