-- Fix extras pricing data issues
-- This migration ensures all extras have proper base_price values

-- First, check if the base_price column exists, if not add it
DO $$ 
BEGIN
    -- Check if base_price column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'extras' 
        AND column_name = 'base_price'
        AND table_schema = 'public'
    ) THEN
        -- Add base_price column if it doesn't exist
        ALTER TABLE public.extras ADD COLUMN base_price DECIMAL(10,2) DEFAULT 0;
        
        -- Copy price values to base_price if price column exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'extras' 
            AND column_name = 'price'
            AND table_schema = 'public'
        ) THEN
            UPDATE public.extras SET base_price = COALESCE(price, 0) WHERE base_price = 0;
        END IF;
    END IF;
END $$;

-- Ensure base_price is NOT NULL
ALTER TABLE public.extras ALTER COLUMN base_price SET NOT NULL;

-- Update any NULL or zero base_price values with reasonable defaults
UPDATE public.extras 
SET base_price = CASE 
    WHEN name ILIKE '%fridge%' THEN 150.00
    WHEN name ILIKE '%oven%' THEN 150.00
    WHEN name ILIKE '%cabinet%' THEN 200.00
    WHEN name ILIKE '%window%' THEN 100.00
    WHEN name ILIKE '%wall%' THEN 250.00
    WHEN name ILIKE '%iron%' THEN 120.00
    WHEN name ILIKE '%laundry%' THEN 180.00
    ELSE 150.00  -- Default price
END
WHERE base_price IS NULL OR base_price = 0;

-- Add description and active columns if they don't exist
DO $$ 
BEGIN
    -- Add description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'extras' 
        AND column_name = 'description'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.extras ADD COLUMN description TEXT;
    END IF;
    
    -- Add active column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'extras' 
        AND column_name = 'active'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.extras ADD COLUMN active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Update descriptions for existing extras
UPDATE public.extras SET description = CASE 
    WHEN name ILIKE '%fridge%' THEN 'Deep clean inside your refrigerator'
    WHEN name ILIKE '%oven%' THEN 'Deep clean inside your oven'
    WHEN name ILIKE '%cabinet%' THEN 'Clean inside kitchen cabinets'
    WHEN name ILIKE '%window%' THEN 'Clean interior windows'
    WHEN name ILIKE '%wall%' THEN 'Spot clean interior walls'
    WHEN name ILIKE '%iron%' THEN 'Ironing service for your clothes'
    WHEN name ILIKE '%laundry%' THEN 'Laundry washing and drying service'
    ELSE 'Additional cleaning service'
END
WHERE description IS NULL OR description = '';

-- Update icons for existing extras
UPDATE public.extras SET icon = CASE 
    WHEN name ILIKE '%fridge%' THEN 'Snowflake'
    WHEN name ILIKE '%oven%' THEN 'Flame'
    WHEN name ILIKE '%cabinet%' THEN 'Cabinet'
    WHEN name ILIKE '%window%' THEN 'Window'
    WHEN name ILIKE '%wall%' THEN 'Paintbrush'
    WHEN name ILIKE '%iron%' THEN 'Iron'
    WHEN name ILIKE '%laundry%' THEN 'Shirt'
    ELSE 'Sparkles'
END
WHERE icon IS NULL OR icon = '';

-- Ensure all extras are active
UPDATE public.extras SET active = true WHERE active IS NULL;

-- Add check constraint to ensure positive prices
ALTER TABLE public.extras ADD CONSTRAINT extras_base_price_positive CHECK (base_price >= 0);

-- Verify the data
SELECT 
    name,
    description,
    base_price,
    icon,
    active,
    created_at
FROM public.extras 
ORDER BY name;

-- Show a summary
SELECT 
    COUNT(*) as total_extras,
    COUNT(CASE WHEN base_price > 0 THEN 1 END) as extras_with_price,
    COUNT(CASE WHEN active = true THEN 1 END) as active_extras,
    AVG(base_price) as average_price
FROM public.extras;
