-- Fix cleaner_applications table schema
-- Run this in your Supabase Dashboard → SQL Editor

-- First, let's see what columns actually exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'cleaner_applications' 
ORDER BY ordinal_position;

-- If the table doesn't exist or is incomplete, create/update it
CREATE TABLE IF NOT EXISTS public.cleaner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Basic required fields
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL
);

-- Add missing columns one by one (safe approach)
DO $$ 
BEGIN
  -- Add columns that might be missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'id_number_or_passport') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN id_number_or_passport TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'date_of_birth') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN date_of_birth DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'has_work_permit') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN has_work_permit BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'address_line1') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN address_line1 TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'suburb_city') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN suburb_city TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'postal_code') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN postal_code TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'years_experience') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN years_experience INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'skills') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN skills TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'start_time') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN start_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'frequency') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN frequency TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'ref1_name') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN ref1_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'ref1_phone') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN ref1_phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'cv_url') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN cv_url TEXT DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'id_doc_url') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN id_doc_url TEXT DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'proof_of_address_url') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN proof_of_address_url TEXT DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaner_applications' AND column_name = 'status') THEN
    ALTER TABLE public.cleaner_applications ADD COLUMN status TEXT DEFAULT 'new';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.cleaner_applications ENABLE ROW LEVEL SECURITY;

-- Fix the INSERT policy
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.cleaner_applications;
DROP POLICY IF EXISTS "Allow anyone to submit cleaner applications" ON public.cleaner_applications;

CREATE POLICY "Allow anyone to submit cleaner applications"
ON public.cleaner_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Check the final schema
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'cleaner_applications' 
ORDER BY ordinal_position;

-- Create storage bucket for application files if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'applications',
  'applications',
  true,
  5242880, -- 5MB limit
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

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'applications';
