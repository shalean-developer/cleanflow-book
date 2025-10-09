-- Add service_id column to pricing_config for service-specific pricing
ALTER TABLE pricing_config ADD COLUMN service_id UUID REFERENCES services(id);

-- Create index for better query performance
CREATE INDEX idx_pricing_config_service_id ON pricing_config(service_id);

-- Deactivate the existing global pricing
UPDATE pricing_config SET active = false WHERE service_id IS NULL;

-- Insert service-specific pricing configurations
INSERT INTO pricing_config (base_price, bedroom_price, bathroom_price, service_id, active)
VALUES
  -- Standard Cleaning: Base 250, Bedroom 25, Bathroom 30
  (250, 25, 30, 'dbaa18db-a3b1-4673-b9c8-351bdb754921', true),
  
  -- Deep Cleaning: Base 1200, Bedroom 150, Bathroom 200
  (1200, 150, 200, '18acd5d3-ca5d-42f6-9b31-3b3c44569a08', true),
  
  -- Move In/Out Cleaning: Base 1100, Bedroom 180, Bathroom 200
  (1100, 180, 200, '5b45550d-bc06-43b2-9a6a-37f44d3fb9c3', true),
  
  -- Airbnb Cleaning: Base 230, Bedroom 120, Bathroom 230
  (230, 120, 230, '153d647b-141f-4557-9984-21e978884c96', true);

-- Update calculate_booking_price function to support service-specific pricing
CREATE OR REPLACE FUNCTION public.calculate_booking_price(
  p_bedrooms integer, 
  p_bathrooms integer, 
  p_extra_ids uuid[],
  p_service_id uuid DEFAULT NULL
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_base_price numeric;
  v_bedroom_price numeric;
  v_bathroom_price numeric;
  v_extras_total numeric := 0;
  v_total numeric;
BEGIN
  -- Get pricing configuration (service-specific first, then fallback to global)
  IF p_service_id IS NOT NULL THEN
    SELECT base_price, bedroom_price, bathroom_price
    INTO v_base_price, v_bedroom_price, v_bathroom_price
    FROM pricing_config
    WHERE active = true AND service_id = p_service_id
    LIMIT 1;
  END IF;
  
  -- Fallback to global pricing if no service-specific pricing found
  IF v_base_price IS NULL THEN
    SELECT base_price, bedroom_price, bathroom_price
    INTO v_base_price, v_bedroom_price, v_bathroom_price
    FROM pricing_config
    WHERE active = true AND service_id IS NULL
    LIMIT 1;
  END IF;
  
  -- If still no config found, use defaults
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
$function$;