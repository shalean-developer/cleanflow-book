-- Disable RLS on public-facing tables to allow unrestricted access
-- These tables contain public information that should be viewable by everyone

-- Disable RLS on services table
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- Disable RLS on extras table  
ALTER TABLE public.extras DISABLE ROW LEVEL SECURITY;

-- Disable RLS on cleaners table
ALTER TABLE public.cleaners DISABLE ROW LEVEL SECURITY;

-- Note: RLS remains enabled on sensitive tables:
-- - public.bookings (user-specific data)
-- - public.profiles (user personal information)
-- - public.user_roles (security-critical)
-- - public.cleaner_applications (contains PII)