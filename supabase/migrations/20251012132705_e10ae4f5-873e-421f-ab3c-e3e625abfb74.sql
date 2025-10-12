-- Drop the incorrect policy
DROP POLICY IF EXISTS "Cleaners can view their assigned bookings" ON public.bookings;

-- Create the correct policy
CREATE POLICY "Cleaners can view their assigned bookings"
ON public.bookings
FOR SELECT
USING (
  has_role(auth.uid(), 'cleaner'::app_role) 
  AND cleaner_id IN (
    SELECT id FROM cleaners WHERE user_id = auth.uid()
  )
);