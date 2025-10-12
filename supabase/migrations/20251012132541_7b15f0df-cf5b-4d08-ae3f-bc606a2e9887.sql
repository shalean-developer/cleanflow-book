-- Add user_id column to cleaners table
ALTER TABLE public.cleaners 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_cleaners_user_id ON public.cleaners(user_id);

-- Enable RLS on cleaners table
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view all cleaners (for booking selection)
CREATE POLICY "Anyone can view cleaners"
ON public.cleaners
FOR SELECT
USING (true);

-- Allow cleaners to view their own profile
CREATE POLICY "Cleaners can view own profile"
ON public.cleaners
FOR SELECT
USING (auth.uid() = user_id);

-- Allow cleaners to update their own profile
CREATE POLICY "Cleaners can update own profile"
ON public.cleaners
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow admins to manage all cleaners
CREATE POLICY "Admins can manage cleaners"
ON public.cleaners
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));