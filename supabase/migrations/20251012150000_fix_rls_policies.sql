-- Fix RLS policies for dashboard implementation
-- This migration ensures data can be fetched properly after adding roles

-- 1. Ensure all users have a profile with default role
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

-- 2. Update existing profiles to have customer role if they don't have a role
UPDATE public.profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- 3. Ensure services can be read by everyone (including non-authenticated users)
-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

-- 4. Ensure extras can be read by everyone (including non-authenticated users)
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
CREATE POLICY "Extras are viewable by everyone"
  ON public.extras FOR SELECT
  USING (true);

-- 5. Ensure cleaners can be read by everyone (including non-authenticated users)
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
CREATE POLICY "Cleaners are viewable by everyone"
  ON public.cleaners FOR SELECT
  USING (true);

-- 6. Ensure users can view their own bookings
-- This policy already exists, but we'll ensure it's properly set up
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

-- 7. Ensure users can create their own bookings
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 8. Ensure users can update their own bookings (for cancellations, etc.)
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- 9. Add a policy for profiles to allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 10. Add a policy for profiles to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 11. Add a policy to allow profile creation on signup
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 12. Update the trigger to automatically create profiles with role for new users
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

-- 13. Allow authenticated users to read suburbs (if this table exists)
-- This is a safety check - only runs if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'suburbs') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Suburbs are viewable by everyone" ON public.suburbs';
    EXECUTE 'CREATE POLICY "Suburbs are viewable by everyone" ON public.suburbs FOR SELECT USING (true)';
  END IF;
END $$;

-- 14. Comment explaining the RLS policy structure
COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control. Roles: customer (default), admin, cleaner';
COMMENT ON COLUMN public.profiles.role IS 'User role for access control: customer, admin, or cleaner';

