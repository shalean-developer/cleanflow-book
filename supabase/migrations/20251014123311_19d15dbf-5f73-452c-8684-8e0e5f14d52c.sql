-- Enable RLS on services and extras tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;

-- Services policies (read-only for everyone, admin-only for modifications)
CREATE POLICY "Anyone can view services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Extras policies (read-only for everyone, admin-only for modifications)
CREATE POLICY "Anyone can view extras"
  ON public.extras FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage extras"
  ON public.extras FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));