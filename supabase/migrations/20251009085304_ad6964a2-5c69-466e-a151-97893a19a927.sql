-- Add address column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS address TEXT;