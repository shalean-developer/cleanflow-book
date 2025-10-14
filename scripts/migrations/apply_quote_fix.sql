-- ============================================
-- QUOTE SUBMISSION FIX - MANUAL APPLICATION
-- ============================================
-- Run this in Supabase SQL Editor if migration doesn't auto-apply

-- Create quotes table to store quote requests
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_1 TEXT NOT NULL,
  address_2 TEXT,
  city TEXT NOT NULL,
  postal TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  extras TEXT[] DEFAULT '{}',
  special_instructions TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS first to clean up
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can view their quotes" ON public.quotes;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.quotes;
DROP POLICY IF EXISTS "Enable select for users based on email" ON public.quotes;
DROP POLICY IF EXISTS "Public can insert quotes" ON public.quotes;
DROP POLICY IF EXISTS "Public can read quotes" ON public.quotes;
DROP POLICY IF EXISTS "Allow public insert" ON public.quotes;
DROP POLICY IF EXISTS "Allow public select" ON public.quotes;

-- Re-enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create simple INSERT policy (anyone can submit quotes)
CREATE POLICY "Allow public insert"
  ON public.quotes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create simple SELECT policy (anyone can view quotes - can restrict later)
CREATE POLICY "Allow public select"
  ON public.quotes
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_quotes_email ON public.quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_reference ON public.quotes(reference);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS quotes_updated_at ON public.quotes;

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at();

-- Verify the table was created
SELECT 'Quotes table created successfully!' as status;

-- Show table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'quotes'
ORDER BY ordinal_position;

