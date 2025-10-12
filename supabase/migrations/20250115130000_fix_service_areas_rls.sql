-- Ensure service_areas table exists and has proper RLS policies
-- This migration fixes access to service areas for the cleaner management feature

-- Create table if it doesn't exist (in case it was dropped)
CREATE TABLE IF NOT EXISTS public.service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Service areas are viewable by everyone" ON public.service_areas;
DROP POLICY IF EXISTS "Anyone can view service areas" ON public.service_areas;
DROP POLICY IF EXISTS "Public can view active service areas" ON public.service_areas;

-- Create new policy: Anyone can view active service areas (public read access)
CREATE POLICY "Anyone can view active service areas"
ON public.service_areas
FOR SELECT
TO public
USING (active = true);

-- Drop admin policies if they exist
DROP POLICY IF EXISTS "Admins can manage service areas" ON public.service_areas;
DROP POLICY IF EXISTS "Admins can insert service areas" ON public.service_areas;
DROP POLICY IF EXISTS "Admins can update service areas" ON public.service_areas;
DROP POLICY IF EXISTS "Admins can delete service areas" ON public.service_areas;

-- Create admin policies for managing service areas
CREATE POLICY "Admins can insert service areas"
ON public.service_areas
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update service areas"
ON public.service_areas
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete service areas"
ON public.service_areas
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_service_areas_active ON public.service_areas(active);
CREATE INDEX IF NOT EXISTS idx_service_areas_name ON public.service_areas(name);

-- Insert Cape Town service areas if table is empty
INSERT INTO public.service_areas (name, active) VALUES
-- City Bowl
('City Centre', true),
('Gardens', true),
('Tamboerskloof', true),
('Oranjezicht', true),
('Vredehoek', true),
('Higgovale', true),
('Bo-Kaap', true),
('Woodstock', true),
('Salt River', true),
('Observatory', true),
('Mowbray', true),
('Rondebosch', true),
('Newlands', true),
('Claremont', true),
('Wynberg', true),
('Kenilworth', true),
('Plumstead', true),
('Constantia', true),
('Bishopscourt', true),

-- Atlantic Seaboard
('Green Point', true),
('Sea Point', true),
('Bantry Bay', true),
('Clifton', true),
('Camps Bay', true),
('Bakoven', true),
('Llandudno', true),
('Hout Bay', true),
('Fresnaye', true),
('Mouille Point', true),
('Three Anchor Bay', true),

-- Southern Suburbs
('Bergvliet', true),
('Tokai', true),
('Steenberg', true),
('Retreat', true),
('Muizenberg', true),
('St James', true),
('Kalk Bay', true),
('Fish Hoek', true),
('Glencairn', true),
('Simons Town', true),
('Lakeside', true),
('Marina Da Gama', true),
('Pinelands', true),

-- Northern Suburbs
('Goodwood', true),
('Parow', true),
('Bellville', true),
('Durbanville', true),
('Brackenfell', true),
('Kuils River', true),
('Blue Downs', true),
('Kraaifontein', true),
('Bothasig', true),
('Edgemead', true),
('Panorama', true),
('Monte Vista', true),
('Kensington', true),
('Thornton', true),
('Welgemoed', true),

-- West Coast
('Bloubergstrand', true),
('Table View', true),
('Milnerton', true),
('Parklands', true),
('Sunset Beach', true),
('Big Bay', true),
('Sandown', true),
('Sunningdale', true),
('Melkbosstrand', true),
('Atlantis', true),
('West Beach', true),

-- False Bay & Southern Peninsula
('Kommetjie', true),
('Scarborough', true),
('Noordhoek', true),
('Sunnydale', true),
('Ocean View', true),
('Masiphumelele', true),
('Clovelly', true),

-- Helderberg
('Somerset West', true),
('Strand', true),
('Gordons Bay', true),

-- Cape Flats
('Mitchells Plain', true),
('Khayelitsha', true),
('Gugulethu', true),
('Nyanga', true),
('Athlone', true),
('Manenberg', true),
('Hanover Park', true),

-- Other areas
('De Waterkant', true),
('Zonnebloem', true)

ON CONFLICT (name) DO NOTHING;

-- Add helpful comment
COMMENT ON TABLE public.service_areas IS 'Service areas where cleaning services are available. Used for cleaner assignments and service area management.';

