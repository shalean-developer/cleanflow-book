-- Drop all tables
DROP TABLE IF EXISTS public.booking_extras CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.cleaner_availability CASCADE;
DROP TABLE IF EXISTS public.cleaner_service_areas CASCADE;
DROP TABLE IF EXISTS public.cleaners CASCADE;
DROP TABLE IF EXISTS public.extras CASCADE;
DROP TABLE IF EXISTS public.pricing_config CASCADE;
DROP TABLE IF EXISTS public.service_areas CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_booking_price(integer, integer, uuid[]) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_booking_price(integer, integer, uuid[], uuid) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_booking_price(integer, integer, uuid[], uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;

-- Drop all types
DROP TYPE IF EXISTS public.app_role CASCADE;