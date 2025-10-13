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

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert quotes (for quote requests)
-- Using TO public ensures both authenticated and anonymous users can insert
CREATE POLICY "Allow public insert"
  ON public.quotes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to select quotes (can be restricted later if needed)
CREATE POLICY "Allow public select"
  ON public.quotes
  FOR SELECT
  TO public
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_quotes_email ON public.quotes(email);
CREATE INDEX idx_quotes_reference ON public.quotes(reference);
CREATE INDEX idx_quotes_created_at ON public.quotes(created_at DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at();

