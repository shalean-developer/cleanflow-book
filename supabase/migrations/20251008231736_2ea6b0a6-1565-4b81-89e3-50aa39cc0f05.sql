-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Services table
CREATE TABLE public.services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Extras table
CREATE TABLE public.extras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    icon text,
    description text,
    base_price decimal(10, 2) DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Service areas table
CREATE TABLE public.service_areas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Cleaners table
CREATE TABLE public.cleaners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    photo_url text,
    rating decimal(2, 1) DEFAULT 5.0,
    bio text,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Cleaner service areas (many-to-many)
CREATE TABLE public.cleaner_service_areas (
    cleaner_id uuid REFERENCES public.cleaners(id) ON DELETE CASCADE,
    service_area_id uuid REFERENCES public.service_areas(id) ON DELETE CASCADE,
    PRIMARY KEY (cleaner_id, service_area_id)
);

-- Cleaner availability
CREATE TABLE public.cleaner_availability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cleaner_id uuid REFERENCES public.cleaners(id) ON DELETE CASCADE,
    weekday integer NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
    start_time time NOT NULL,
    end_time time NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE public.bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    service_id uuid REFERENCES public.services(id),
    bedrooms integer DEFAULT 2,
    bathrooms integer DEFAULT 1,
    house_details text,
    special_instructions text,
    date date NOT NULL,
    time time NOT NULL,
    frequency text DEFAULT 'once-off',
    area_id uuid REFERENCES public.service_areas(id),
    cleaner_id uuid REFERENCES public.cleaners(id),
    status text DEFAULT 'draft',
    total_amount decimal(10, 2),
    currency text DEFAULT 'ZAR',
    created_at timestamptz DEFAULT now()
);

-- Booking extras (many-to-many)
CREATE TABLE public.booking_extras (
    booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
    extra_id uuid REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    PRIMARY KEY (booking_id, extra_id)
);

-- Payments table
CREATE TABLE public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
    provider text DEFAULT 'paystack',
    reference text UNIQUE,
    status text DEFAULT 'pending',
    amount decimal(10, 2) NOT NULL,
    currency text DEFAULT 'ZAR',
    paid_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (active = true);
CREATE POLICY "Extras are viewable by everyone" ON public.extras FOR SELECT USING (active = true);
CREATE POLICY "Service areas are viewable by everyone" ON public.service_areas FOR SELECT USING (active = true);
CREATE POLICY "Cleaners are viewable by everyone" ON public.cleaners FOR SELECT USING (active = true);
CREATE POLICY "Cleaner service areas are viewable by everyone" ON public.cleaner_service_areas FOR SELECT USING (true);
CREATE POLICY "Cleaner availability is viewable by everyone" ON public.cleaner_availability FOR SELECT USING (true);

-- RLS Policies for bookings (users can only access their own bookings)
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (true);

-- RLS Policies for booking extras
CREATE POLICY "Users can view booking extras" ON public.booking_extras FOR SELECT USING (true);
CREATE POLICY "Users can insert booking extras" ON public.booking_extras FOR INSERT WITH CHECK (true);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Users can insert payments" ON public.payments FOR INSERT WITH CHECK (true);

-- Seed services
INSERT INTO public.services (name, description) VALUES
('Standard Cleaning', 'Regular cleaning service for maintaining your home''s cleanliness'),
('Deep Cleaning', 'Thorough cleaning service covering all areas in detail'),
('Move In/Out Cleaning', 'Complete cleaning for moving in or out of a property'),
('Airbnb Cleaning', 'Specialized cleaning service for short-term rental properties');

-- Seed extras
INSERT INTO public.extras (name, icon, description, base_price) VALUES
('Inside Fridge', 'Refrigerator', 'Deep clean inside refrigerator', 150.00),
('Inside Oven', 'ChefHat', 'Deep clean inside oven', 150.00),
('Inside Cabinets', 'Package', 'Clean inside kitchen cabinets', 200.00),
('Interior Windows', 'Home', 'Clean interior windows', 100.00),
('Interior Walls', 'Paintbrush', 'Spot clean interior walls', 250.00),
('Ironing', 'Shirt', 'Ironing service', 120.00),
('Laundry', 'ShowerHead', 'Laundry service', 180.00);

-- Seed service areas
INSERT INTO public.service_areas (name) VALUES
('Cape Town CBD'),
('Sea Point'),
('Camps Bay'),
('Claremont'),
('Constantia');

-- Seed cleaners
INSERT INTO public.cleaners (full_name, bio, rating) VALUES
('Thandi Mkhize', 'Professional cleaner with 8 years of experience. Specializes in deep cleaning and attention to detail.', 4.9),
('James van der Merwe', 'Reliable and thorough cleaner. Expert in move-in/out cleaning services.', 4.8),
('Precious Nkosi', 'Friendly and efficient cleaner with 5 years experience in luxury home cleaning.', 5.0),
('Sarah Botha', 'Specialized in Airbnb turnaround cleaning. Fast, efficient, and reliable.', 4.7),
('Linda Dlamini', 'Experienced in all types of cleaning services with excellent customer reviews.', 4.9);

-- Link cleaners to service areas (all cleaners serve all areas for now)
INSERT INTO public.cleaner_service_areas (cleaner_id, service_area_id)
SELECT c.id, sa.id FROM public.cleaners c CROSS JOIN public.service_areas sa;

-- Seed cleaner availability (Mon-Sun, 7:00-17:00 for all cleaners)
INSERT INTO public.cleaner_availability (cleaner_id, weekday, start_time, end_time)
SELECT 
    c.id,
    d.day,
    '07:00'::time,
    '17:00'::time
FROM public.cleaners c
CROSS JOIN (
    SELECT generate_series(0, 6) as day
) d;