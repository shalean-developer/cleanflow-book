-- Add admin policies for cleaner_applications
CREATE POLICY "Admins can view all applications"
ON public.cleaner_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all applications"
ON public.cleaner_applications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete applications"
ON public.cleaner_applications
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));