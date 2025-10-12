-- Migration: Add room pricing columns to services table
-- This allows each service to have its own pricing for bedrooms, bathrooms, and service fees

-- Add room pricing columns to services table
ALTER TABLE public.services 
ADD COLUMN bedroom_price decimal(10, 2) DEFAULT 50.00,
ADD COLUMN bathroom_price decimal(10, 2) DEFAULT 40.00,
ADD COLUMN service_fee_rate decimal(5, 4) DEFAULT 0.10;

-- Update existing services with current pricing
UPDATE public.services 
SET 
  bedroom_price = 50.00,
  bathroom_price = 40.00,
  service_fee_rate = 0.10;

-- Make columns NOT NULL after setting defaults
ALTER TABLE public.services 
ALTER COLUMN bedroom_price SET NOT NULL,
ALTER COLUMN bathroom_price SET NOT NULL,
ALTER COLUMN service_fee_rate SET NOT NULL;

-- Add check constraints
ALTER TABLE public.services 
ADD CONSTRAINT bedroom_price_positive CHECK (bedroom_price >= 0),
ADD CONSTRAINT bathroom_price_positive CHECK (bathroom_price >= 0),
ADD CONSTRAINT service_fee_rate_valid CHECK (service_fee_rate >= 0 AND service_fee_rate <= 1);

-- Add helpful comments
COMMENT ON COLUMN public.services.bedroom_price IS 'Price per bedroom in ZAR';
COMMENT ON COLUMN public.services.bathroom_price IS 'Price per bathroom in ZAR';
COMMENT ON COLUMN public.services.service_fee_rate IS 'Service fee as decimal (0.10 = 10%)';

