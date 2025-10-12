-- Create cleaner_applications table
CREATE TABLE IF NOT EXISTS cleaner_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  
  -- Personal Details
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  id_number_or_passport text NOT NULL,
  date_of_birth date NOT NULL,
  has_work_permit boolean NOT NULL DEFAULT false,
  
  -- Address
  address_line1 text NOT NULL,
  address_line2 text,
  suburb_city text NOT NULL,
  postal_code text NOT NULL,
  has_own_transport boolean NOT NULL DEFAULT false,
  
  -- Experience & Skills
  years_experience int NOT NULL,
  skills jsonb NOT NULL,
  comfortable_with_pets boolean NOT NULL DEFAULT false,
  languages jsonb NOT NULL,
  
  -- Availability
  available_days jsonb NOT NULL,
  start_time text NOT NULL,
  frequency text NOT NULL,
  earliest_start_date date NOT NULL,
  
  -- Preferred Working Areas
  areas jsonb NOT NULL,
  
  -- References
  ref1_name text NOT NULL,
  ref1_phone text NOT NULL,
  ref1_relationship text NOT NULL,
  ref2_name text,
  ref2_phone text,
  ref2_relationship text,
  
  -- File URLs
  cv_url text NOT NULL,
  id_doc_url text NOT NULL,
  proof_of_address_url text NOT NULL,
  certificate_url text,
  
  -- Status tracking
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  notes text
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_cleaner_applications_status ON cleaner_applications(status);
CREATE INDEX IF NOT EXISTS idx_cleaner_applications_created_at ON cleaner_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cleaner_applications_email ON cleaner_applications(email);

-- Enable Row Level Security
ALTER TABLE cleaner_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public applications)
CREATE POLICY "Anyone can submit applications"
  ON cleaner_applications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can read (for admin purposes)
CREATE POLICY "Authenticated users can read applications"
  ON cleaner_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create storage bucket for applications
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'applications',
  'applications',
  false,
  5242880, -- 5MB
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can upload
CREATE POLICY "Anyone can upload application files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'applications');

-- Storage policy: Authenticated users can read
CREATE POLICY "Authenticated users can read application files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'applications' AND auth.role() = 'authenticated');

