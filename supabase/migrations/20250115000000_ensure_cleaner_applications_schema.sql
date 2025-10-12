-- Ensure cleaner_applications table has the correct schema
-- This migration ensures all required columns exist

-- First, check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS public.cleaner_applications (
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

-- Add any missing columns if the table already exists
DO $$ 
BEGIN
  -- Add address_line1 if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'address_line1') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN address_line1 TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add address_line2 if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'address_line2') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN address_line2 TEXT;
  END IF;
  
  -- Add suburb_city if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'suburb_city') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN suburb_city TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add postal_code if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'postal_code') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN postal_code TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add has_own_transport if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'has_own_transport') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN has_own_transport BOOLEAN NOT NULL DEFAULT false;
  END IF;
  
  -- Add years_experience if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'years_experience') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN years_experience INTEGER NOT NULL DEFAULT 0;
  END IF;
  
  -- Add skills if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'skills') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN skills TEXT[] NOT NULL DEFAULT '{}';
  END IF;
  
  -- Add comfortable_with_pets if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'comfortable_with_pets') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN comfortable_with_pets BOOLEAN NOT NULL DEFAULT false;
  END IF;
  
  -- Add languages if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'languages') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN languages TEXT[] NOT NULL DEFAULT '{}';
  END IF;
  
  -- Add available_days if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'available_days') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN available_days TEXT[] NOT NULL DEFAULT '{}';
  END IF;
  
  -- Add start_time if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'start_time') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN start_time TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add frequency if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'frequency') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN frequency TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add earliest_start_date if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'earliest_start_date') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN earliest_start_date DATE NOT NULL DEFAULT CURRENT_DATE;
  END IF;
  
  -- Add areas if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'areas') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN areas TEXT[] NOT NULL DEFAULT '{}';
  END IF;
  
  -- Add ref1_name if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'ref1_name') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN ref1_name TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add ref1_phone if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'ref1_phone') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN ref1_phone TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add ref1_relationship if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'ref1_relationship') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN ref1_relationship TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add ref2_name if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'ref2_name') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN ref2_name TEXT;
  END IF;
  
  -- Add ref2_phone if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'ref2_phone') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN ref2_phone TEXT;
  END IF;
  
  -- Add ref2_relationship if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'ref2_relationship') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN ref2_relationship TEXT;
  END IF;
  
  -- Add cv_url if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'cv_url') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN cv_url TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add id_doc_url if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'id_doc_url') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN id_doc_url TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add proof_of_address_url if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'proof_of_address_url') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN proof_of_address_url TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add certificate_url if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'certificate_url') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN certificate_url TEXT;
  END IF;
  
  -- Add status if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'status') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN status TEXT NOT NULL DEFAULT 'new';
  END IF;
  
  -- Add created_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'created_at') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
  END IF;
  
  -- Add updated_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'cleaner_applications' 
                 AND column_name = 'updated_at') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.cleaner_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Allow anyone to submit cleaner applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.cleaner_applications;

-- Create policy for anyone to insert their application
CREATE POLICY "Allow anyone to submit cleaner applications"
ON public.cleaner_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for users to view their own applications (if they have accounts)
CREATE POLICY "Users can view their own applications"
ON public.cleaner_applications
FOR SELECT
TO public
USING (email = COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), ''));

-- Create storage bucket for application files if it doesn't exist
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
DROP POLICY IF EXISTS "Anyone can upload application files" ON storage.objects;
DROP POLICY IF EXISTS "Application files are publicly accessible" ON storage.objects;

CREATE POLICY "Anyone can upload application files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'applications');

CREATE POLICY "Application files are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'applications');

-- Add helpful comments
COMMENT ON TABLE public.cleaner_applications IS 'Stores job applications for cleaner positions';
COMMENT ON COLUMN public.cleaner_applications.status IS 'Application status: new, reviewing, shortlisted, interviewed, hired, rejected';
