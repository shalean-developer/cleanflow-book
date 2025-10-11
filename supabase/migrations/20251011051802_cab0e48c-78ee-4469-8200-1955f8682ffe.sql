-- Add phone_number column to bookings table
ALTER TABLE public.bookings
ADD COLUMN phone_number text;

-- Add a comment to the column
COMMENT ON COLUMN public.bookings.phone_number IS 'Customer phone number for booking contact';