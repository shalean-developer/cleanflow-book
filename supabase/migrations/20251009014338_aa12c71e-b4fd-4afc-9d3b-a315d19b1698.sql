-- Add payment_reference column to bookings table for Paystack integration
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_reference text UNIQUE;