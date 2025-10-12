-- Create cleaner_applications table
CREATE TABLE public.cleaner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Personal Details
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_number_or_passport TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  has_work_permit BOOLEAN NOT NULL DEFAULT false,
  
  -- Address
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  suburb_city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  has_own_transport BOOLEAN NOT NULL DEFAULT false,
  
  -- Experience & Skills
  years_experience INTEGER NOT NULL DEFAULT 0,
  skills TEXT[] NOT NULL DEFAULT '{}',
  comfortable_with_pets BOOLEAN NOT NULL DEFAULT false,
  languages TEXT[] NOT NULL DEFAULT '{}',
  
  -- Availability
  available_days TEXT[] NOT NULL DEFAULT '{}',
  start_time TEXT NOT NULL,
  frequency TEXT NOT NULL,
  earliest_start_date DATE NOT NULL,
  
  -- Preferred Working Areas
  areas TEXT[] NOT NULL DEFAULT '{}',
  
  -- References
  ref1_name TEXT NOT NULL,
  ref1_phone TEXT NOT NULL,
  ref1_relationship TEXT NOT NULL,
  ref2_name TEXT,
  ref2_phone TEXT,
  ref2_relationship TEXT,
  
  -- Files
  cv_url TEXT NOT NULL DEFAULT '',
  id_doc_url TEXT NOT NULL DEFAULT '',
  proof_of_address_url TEXT NOT NULL DEFAULT '',
  certificate_url TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'new',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cleaner_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert their application
CREATE POLICY "Anyone can submit an application"
ON public.cleaner_applications
FOR INSERT
WITH CHECK (true);

-- Create policy for users to view their own applications
CREATE POLICY "Users can view their own applications"
ON public.cleaner_applications
FOR SELECT
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_cleaner_applications_updated_at
BEFORE UPDATE ON public.cleaner_applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for application files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'applications',
  'applications',
  true,
  5242880,
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for application files
CREATE POLICY "Anyone can upload application files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'applications');

CREATE POLICY "Application files are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'applications');

-- Add helpful comments
COMMENT ON TABLE public.cleaner_applications IS 'Stores job applications for cleaner positions';
COMMENT ON COLUMN public.cleaner_applications.status IS 'Application status: new, reviewing, shortlisted, interviewed, hired, rejected';