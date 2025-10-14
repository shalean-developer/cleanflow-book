# Apply Cleaner Avatars Storage Bucket Migration

## Overview
This migration creates a storage bucket for cleaner avatar images with proper RLS policies.

## Migration File
`supabase/migrations/20250115120000_create_cleaner_avatars_bucket.sql`

## What It Does
1. Creates a `cleaner-avatars` storage bucket
2. Sets file size limit to 2MB
3. Allows image types: JPEG, PNG, WebP, GIF
4. Sets up RLS policies:
   - Admins can upload, update, and delete avatars
   - Avatars are publicly accessible for viewing

## How to Apply

### Option 1: Using Supabase CLI (Recommended)

If you have Supabase CLI installed and linked to your project:

```bash
# Make sure you're in the project root
cd c:\Users\27825\shaleanpro\cleanflow-book

# Apply the migration
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20250115120000_create_cleaner_avatars_bucket.sql`
5. Paste into the query editor
6. Click **Run** or press `Ctrl+Enter`

### Option 3: Manual SQL Execution

Connect to your database and run:

```sql
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

-- Storage policy: Cleaner avatars are publicly accessible
DROP POLICY IF EXISTS "Cleaner avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Cleaner avatars are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'cleaner-avatars');
```

## Verification

After applying the migration, verify it worked:

1. Go to Supabase Dashboard → **Storage**
2. You should see a bucket named `cleaner-avatars`
3. Check that the bucket settings show:
   - Public: Yes
   - File size limit: 2 MB
   - Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp, image/gif

## Testing

1. Log in as an admin user
2. Navigate to Admin Dashboard → Cleaners tab
3. Click "Add New Cleaner"
4. Try uploading an image
5. Verify the image uploads successfully and displays in the preview

## Troubleshooting

### Error: Bucket already exists
This is fine - the migration uses `ON CONFLICT DO NOTHING`, so it won't create duplicates.

### Error: Policy already exists
The migration drops existing policies before creating new ones, so this shouldn't happen.

### Upload fails with "permission denied"
1. Check that you're logged in as an admin user
2. Verify the `has_role` function exists in your database
3. Check that your user has the admin role assigned

### Images not displaying
1. Verify the bucket is set to public
2. Check the RLS policies are correct
3. Look for errors in browser console

## Rollback

If you need to remove the bucket and policies:

```sql
-- Remove policies
DROP POLICY IF EXISTS "Admins can upload cleaner avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update cleaner avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete cleaner avatars" ON storage.objects;
DROP POLICY IF EXISTS "Cleaner avatars are publicly accessible" ON storage.objects;

-- Delete bucket (this will fail if there are files in it)
DELETE FROM storage.buckets WHERE id = 'cleaner-avatars';
```

## Next Steps

After applying the migration:
1. Test the image upload functionality
2. Upload avatars for existing cleaners
3. Verify images display correctly on the website
4. Check that old avatars are properly replaced when uploading new ones

