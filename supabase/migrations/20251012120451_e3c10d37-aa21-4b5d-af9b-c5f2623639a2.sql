-- Remove orphaned RLS policies from tables where RLS is now disabled
-- These policies are no longer functional since RLS was disabled on these tables

-- Drop policies from services table
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;

-- Drop policies from extras table
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;

-- Drop policies from cleaners table
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;

-- Note: Tables (services, extras, cleaners) now have RLS disabled
-- and are fully accessible without authentication