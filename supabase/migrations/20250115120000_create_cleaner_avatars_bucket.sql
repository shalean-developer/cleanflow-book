-- Create storage bucket for cleaner avatar images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cleaner-avatars',
  'cleaner-avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Admins can upload cleaner avatars
DROP POLICY IF EXISTS "Admins can upload cleaner avatars" ON storage.objects;
CREATE POLICY "Admins can upload cleaner avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cleaner-avatars' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Storage policy: Admins can update cleaner avatars
DROP POLICY IF EXISTS "Admins can update cleaner avatars" ON storage.objects;
CREATE POLICY "Admins can update cleaner avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cleaner-avatars' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Storage policy: Admins can delete cleaner avatars
DROP POLICY IF EXISTS "Admins can delete cleaner avatars" ON storage.objects;
CREATE POLICY "Admins can delete cleaner avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cleaner-avatars' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Storage policy: Cleaner avatars are publicly accessible (for viewing on website)
DROP POLICY IF EXISTS "Cleaner avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Cleaner avatars are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'cleaner-avatars');

-- Add helpful comment
COMMENT ON POLICY "Admins can upload cleaner avatars" ON storage.objects IS 
'Allows administrators to upload avatar images for cleaners to the cleaner-avatars bucket';

