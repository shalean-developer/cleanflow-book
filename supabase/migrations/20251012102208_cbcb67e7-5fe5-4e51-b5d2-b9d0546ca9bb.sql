-- Add pricing columns to services table
-- Step 1: Add columns with defaults (nullable first)
ALTER TABLE public.services
ADD COLUMN bedroom_price DECIMAL(10, 2) DEFAULT 50.00,
ADD COLUMN bathroom_price DECIMAL(10, 2) DEFAULT 40.00,
ADD COLUMN service_fee_rate DECIMAL(5, 4) DEFAULT 0.10;

-- Step 2: Update all existing services with default values
UPDATE public.services
SET 
  bedroom_price = 50.00,
  bathroom_price = 40.00,
  service_fee_rate = 0.10
WHERE bedroom_price IS NULL 
   OR bathroom_price IS NULL 
   OR service_fee_rate IS NULL;

-- Step 3: Make columns NOT NULL
ALTER TABLE public.services
ALTER COLUMN bedroom_price SET NOT NULL,
ALTER COLUMN bathroom_price SET NOT NULL,
ALTER COLUMN service_fee_rate SET NOT NULL;

-- Step 4: Add check constraints
ALTER TABLE public.services
ADD CONSTRAINT bedroom_price_positive CHECK (bedroom_price >= 0),
ADD CONSTRAINT bathroom_price_positive CHECK (bathroom_price >= 0),
ADD CONSTRAINT service_fee_rate_valid CHECK (service_fee_rate >= 0 AND service_fee_rate <= 1);

-- Step 5: Add helpful column comments
COMMENT ON COLUMN public.services.bedroom_price IS 'Price per bedroom in ZAR';
COMMENT ON COLUMN public.services.bathroom_price IS 'Price per bathroom in ZAR';
COMMENT ON COLUMN public.services.service_fee_rate IS 'Service fee as decimal (0.10 = 10%)';