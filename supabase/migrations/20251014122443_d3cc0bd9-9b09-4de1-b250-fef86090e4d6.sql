-- Refresh database types by adding a comment
-- This migration forces the types file to regenerate with the current schema

COMMENT ON TABLE public.services IS 'Services offered by the cleaning company';
COMMENT ON TABLE public.cleaners IS 'Cleaners available for bookings';
COMMENT ON TABLE public.extras IS 'Additional services that can be added to bookings';