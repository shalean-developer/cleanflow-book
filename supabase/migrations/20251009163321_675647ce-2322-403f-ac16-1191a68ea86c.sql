-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create extras table
CREATE TABLE public.extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cleaners table
CREATE TABLE public.cleaners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  service_areas TEXT[] NOT NULL,
  availability JSONB NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 2,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  extras TEXT[] DEFAULT '{}',
  date DATE NOT NULL,
  time TEXT NOT NULL,
  frequency TEXT NOT NULL,
  location TEXT NOT NULL,
  special_instructions TEXT,
  cleaner_id UUID REFERENCES public.cleaners(id),
  pricing JSONB NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Services policies (public read)
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

-- Extras policies (public read)
CREATE POLICY "Extras are viewable by everyone"
  ON public.extras FOR SELECT
  USING (true);

-- Cleaners policies (public read)
CREATE POLICY "Cleaners are viewable by everyone"
  ON public.cleaners FOR SELECT
  USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert demo services
INSERT INTO public.services (slug, name, description, base_price) VALUES
  ('standard-cleaning', 'Standard Cleaning', 'Regular cleaning for your home including dusting, vacuuming, and mopping.', 450.00),
  ('deep-cleaning', 'Deep Cleaning', 'Thorough cleaning including hard-to-reach areas and detailed scrubbing.', 750.00),
  ('move-in-out', 'Move In/Out Cleaning', 'Comprehensive cleaning for moving in or out of a property.', 950.00),
  ('airbnb-cleaning', 'Airbnb Cleaning', 'Quick turnaround cleaning for short-term rentals.', 550.00);

-- Insert demo extras
INSERT INTO public.extras (name, price, icon) VALUES
  ('Inside Fridge', 80.00, 'Snowflake'),
  ('Inside Oven', 120.00, 'Flame'),
  ('Inside Cabinets', 100.00, 'Cabinet'),
  ('Interior Windows', 150.00, 'Window'),
  ('Interior Walls', 200.00, 'Paintbrush'),
  ('Ironing', 90.00, 'Iron'),
  ('Laundry', 110.00, 'Shirt');

-- Insert demo cleaners
INSERT INTO public.cleaners (name, rating, service_areas, availability) VALUES
  ('Sarah Johnson', 4.9, ARRAY['Sandton', 'Rosebank', 'Parktown'], 
   '{"0": ["07:00", "08:00", "09:00", "10:00"], "1": ["07:00", "08:00", "09:00", "10:00", "11:00"], "2": ["08:00", "09:00", "10:00"], "3": ["07:00", "08:00", "09:00"], "4": ["07:00", "08:00"], "5": ["09:00", "10:00"], "6": []}'::jsonb),
  ('Michael Williams', 5.0, ARRAY['Sandton', 'Midrand', 'Fourways'], 
   '{"0": [], "1": ["07:00", "08:00", "09:00"], "2": ["07:00", "08:00", "09:00", "10:00", "11:00"], "3": ["08:00", "09:00", "10:00"], "4": ["07:00", "08:00", "09:00"], "5": ["07:00", "08:00"], "6": ["09:00", "10:00"]}'::jsonb),
  ('Jessica Brown', 4.8, ARRAY['Rosebank', 'Parktown', 'Bryanston'], 
   '{"0": ["08:00", "09:00"], "1": ["07:00", "08:00"], "2": ["07:00", "08:00", "09:00"], "3": ["07:00", "08:00", "09:00", "10:00"], "4": ["08:00", "09:00", "10:00", "11:00"], "5": [], "6": ["07:00", "08:00"]}'::jsonb),
  ('David Martinez', 4.7, ARRAY['Fourways', 'Midrand', 'Sandton'], 
   '{"0": ["07:00", "08:00", "09:00"], "1": ["08:00", "09:00", "10:00"], "2": ["07:00", "08:00"], "3": ["07:00", "08:00", "09:00", "10:00", "11:00"], "4": ["07:00", "08:00", "09:00"], "5": ["08:00", "09:00", "10:00"], "6": []}'::jsonb),
  ('Emily Davis', 5.0, ARRAY['Bryanston', 'Parktown', 'Rosebank'], 
   '{"0": ["09:00", "10:00"], "1": ["07:00", "08:00", "09:00"], "2": ["08:00", "09:00", "10:00", "11:00"], "3": ["07:00", "08:00"], "4": ["07:00", "08:00", "09:00", "10:00"], "5": ["07:00", "08:00", "09:00"], "6": ["08:00", "09:00"]}'::jsonb),
  ('Christopher Lee', 4.9, ARRAY['Sandton', 'Fourways', 'Bryanston'], 
   '{"0": ["07:00", "08:00"], "1": ["08:00", "09:00", "10:00", "11:00"], "2": ["07:00", "08:00", "09:00"], "3": ["08:00", "09:00", "10:00"], "4": ["07:00", "08:00"], "5": ["07:00", "08:00", "09:00", "10:00"], "6": ["09:00", "10:00"]}'::jsonb);

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();