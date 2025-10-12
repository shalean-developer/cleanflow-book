-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'cleaner'));

-- Add admin policy for profiles (admins can view all profiles)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add admin policies for bookings (admins can view and update all bookings)
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add cleaner_id to cleaners table to link with auth users
ALTER TABLE public.cleaners ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add policy for cleaners to view their assigned bookings
CREATE POLICY "Cleaners can view assigned bookings" ON public.bookings
  FOR SELECT USING (
    cleaner_id IN (
      SELECT id FROM public.cleaners
      WHERE cleaners.user_id = auth.uid()
    )
  );

CREATE POLICY "Cleaners can update assigned bookings" ON public.bookings
  FOR UPDATE USING (
    cleaner_id IN (
      SELECT id FROM public.cleaners
      WHERE cleaners.user_id = auth.uid()
    )
  );

-- Add admin policies for cleaner_applications
CREATE POLICY "Admins can view all applications" ON public.cleaner_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all applications" ON public.cleaner_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add admin policies for cleaners table
CREATE POLICY "Admins can view all cleaners" ON public.cleaners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert cleaners" ON public.cleaners
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update cleaners" ON public.cleaners
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Allow cleaners to view their own profile
CREATE POLICY "Cleaners can view own cleaner profile" ON public.cleaners
  FOR SELECT USING (user_id = auth.uid());

