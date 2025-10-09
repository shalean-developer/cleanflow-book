-- Phase 1: Clean up orphaned bookings
DELETE FROM booking_extras WHERE booking_id IN (SELECT id FROM bookings WHERE user_id IS NULL);
DELETE FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE user_id IS NULL);
DELETE FROM bookings WHERE user_id IS NULL;

-- Make user_id NOT NULL to prevent future orphaned records
ALTER TABLE bookings ALTER COLUMN user_id SET NOT NULL;

-- Phase 2: Add DELETE policies for user data control
CREATE POLICY "Users can delete own bookings" 
ON public.bookings 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own booking extras" 
ON public.booking_extras 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = booking_extras.booking_id
    AND bookings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own payments" 
ON public.payments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = payments.booking_id
    AND bookings.user_id = auth.uid()
  )
);

-- Phase 3: Create pricing configuration table
CREATE TABLE public.pricing_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_price numeric NOT NULL DEFAULT 300,
  bedroom_price numeric NOT NULL DEFAULT 100,
  bathroom_price numeric NOT NULL DEFAULT 80,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on pricing_config
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;

-- Pricing config is viewable by everyone (needed for price calculation)
CREATE POLICY "Pricing config is viewable by everyone" 
ON public.pricing_config 
FOR SELECT 
USING (active = true);

-- Insert default pricing configuration
INSERT INTO public.pricing_config (base_price, bedroom_price, bathroom_price, active) 
VALUES (300, 100, 80, true);

-- Create server-side price calculation function
CREATE OR REPLACE FUNCTION public.calculate_booking_price(
  p_bedrooms integer,
  p_bathrooms integer,
  p_extra_ids uuid[]
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_base_price numeric;
  v_bedroom_price numeric;
  v_bathroom_price numeric;
  v_extras_total numeric := 0;
  v_total numeric;
BEGIN
  -- Get active pricing configuration
  SELECT base_price, bedroom_price, bathroom_price
  INTO v_base_price, v_bedroom_price, v_bathroom_price
  FROM pricing_config
  WHERE active = true
  LIMIT 1;
  
  -- If no config found, use defaults
  IF v_base_price IS NULL THEN
    v_base_price := 300;
    v_bedroom_price := 100;
    v_bathroom_price := 80;
  END IF;
  
  -- Calculate base + rooms
  v_total := v_base_price + (p_bedrooms * v_bedroom_price) + (p_bathrooms * v_bathroom_price);
  
  -- Add extras if provided
  IF p_extra_ids IS NOT NULL AND array_length(p_extra_ids, 1) > 0 THEN
    SELECT COALESCE(SUM(base_price), 0)
    INTO v_extras_total
    FROM extras
    WHERE id = ANY(p_extra_ids) AND active = true;
    
    v_total := v_total + v_extras_total;
  END IF;
  
  RETURN v_total;
END;
$$;