-- Update calculate_booking_price function to include frequency discount
CREATE OR REPLACE FUNCTION public.calculate_booking_price(
  p_bedrooms integer, 
  p_bathrooms integer, 
  p_extra_ids uuid[],
  p_service_id uuid DEFAULT NULL,
  p_frequency text DEFAULT 'once-off'
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_base_price numeric;
  v_bedroom_price numeric;
  v_bathroom_price numeric;
  v_extras_total numeric := 0;
  v_total numeric;
  v_discount numeric := 0;
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
  
  -- Apply frequency discount
  IF p_frequency = 'weekly' THEN
    v_discount := v_total * 0.15; -- 15% discount
  ELSIF p_frequency = 'bi-weekly' THEN
    v_discount := v_total * 0.10; -- 10% discount
  ELSIF p_frequency = 'monthly' THEN
    v_discount := v_total * 0.05; -- 5% discount
  END IF;
  
  v_total := v_total - v_discount;
  
  RETURN v_total;
END;
$$;