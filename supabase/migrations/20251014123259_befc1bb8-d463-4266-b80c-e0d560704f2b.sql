-- Force types regeneration by adding a helpful comment
COMMENT ON TABLE public.cleaners IS 'Cleaners available for bookings - stores cleaner profiles and availability';
COMMENT ON TABLE public.extras IS 'Additional cleaning services and their pricing';
COMMENT ON TABLE public.services IS 'Core cleaning services offered';
COMMENT ON TABLE public.bookings IS 'Customer booking records with service details';
COMMENT ON TABLE public.payments IS 'Payment records linked to bookings';
COMMENT ON TABLE public.profiles IS 'User profile information';
COMMENT ON TABLE public.user_roles IS 'User role assignments for access control';
COMMENT ON TABLE public.cleaner_applications IS 'Applications from prospective cleaners';
COMMENT ON TABLE public.promo_claims IS 'Promotional code claims by users';
COMMENT ON TABLE public.promo_redemptions IS 'Redemption records for promotional codes';