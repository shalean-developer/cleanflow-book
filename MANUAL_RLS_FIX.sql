-- =====================================================
-- MANUAL RLS POLICY FIX FOR CLEANFLOW DASHBOARD
-- =====================================================
-- Copy and paste this entire SQL script into your Supabase SQL Editor
-- Execute it to fix the "Failed to load dashboard data" error

-- Step 1: Ensure all users have profiles with default role
-- =====================================================
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

-- Step 2: Update existing profiles to have customer role
-- =====================================================
UPDATE public.profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- Step 3: Fix Services table policies (allow public read)
-- =====================================================
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

-- Step 4: Fix Extras table policies (allow public read)
-- =====================================================
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
CREATE POLICY "Extras are viewable by everyone"
  ON public.extras FOR SELECT
  USING (true);

-- Step 5: Fix Cleaners table policies (allow public read)
-- =====================================================
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
CREATE POLICY "Cleaners are viewable by everyone"
  ON public.cleaners FOR SELECT
  USING (true);

-- Step 6: Fix Bookings table policies (user-specific access)
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 7: Fix Profiles table policies
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 8: Update user creation trigger
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

-- Step 9: Fix Suburbs table if it exists
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'suburbs') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Suburbs are viewable by everyone" ON public.suburbs';
    EXECUTE 'CREATE POLICY "Suburbs are viewable by everyone" ON public.suburbs FOR SELECT USING (true)';
  END IF;
END $$;

-- Step 10: Verification queries (run these after the above)
-- =====================================================
-- Check that all users have profiles with roles:
-- SELECT COUNT(*) FROM auth.users u
-- LEFT JOIN public.profiles p ON u.id = p.id
-- WHERE p.role IS NULL OR p.id IS NULL;
-- (Should return 0)

-- Check that policies exist:
-- SELECT tablename, policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('services', 'extras', 'cleaners', 'bookings', 'profiles')
-- ORDER BY tablename;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
