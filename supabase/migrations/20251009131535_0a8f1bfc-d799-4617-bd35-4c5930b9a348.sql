-- Add user_id column to cleaners table to link auth users to cleaner profiles
ALTER TABLE public.cleaners ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_cleaners_user_id ON public.cleaners(user_id);

-- Update RLS policies for cleaners
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can insert cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can update cleaners" ON public.cleaners;
DROP POLICY IF EXISTS "Admins can delete cleaners" ON public.cleaners;

-- New RLS policies
CREATE POLICY "Cleaners are viewable by everyone"
ON public.cleaners
FOR SELECT
USING (active = true);

CREATE POLICY "Cleaners can view own profile"
ON public.cleaners
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Cleaners can update own profile"
ON public.cleaners
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert cleaners"
ON public.cleaners
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update cleaners"
ON public.cleaners
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cleaners"
ON public.cleaners
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Update RLS policies for bookings so cleaners can see their assignments
CREATE POLICY "Cleaners can view assigned bookings"
ON public.bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.cleaners
    WHERE cleaners.id = bookings.cleaner_id
    AND cleaners.user_id = auth.uid()
  )
);

CREATE POLICY "Cleaners can update assigned bookings"
ON public.bookings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.cleaners
    WHERE cleaners.id = bookings.cleaner_id
    AND cleaners.user_id = auth.uid()
  )
);