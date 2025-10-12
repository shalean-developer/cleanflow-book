# Fix Service Areas Error

## Error
```
CleanerDialog.tsx:69 Error fetching service areas
```

## Cause
The error occurs when trying to fetch service areas from the database. This can happen due to:
1. Missing or incorrect RLS policies
2. Service areas table not properly initialized
3. Missing data in the service_areas table

## Solution

### Step 1: Apply the RLS Fix Migration

Run the migration to fix the RLS policies and populate service areas:

**Option 1: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20250115130000_fix_service_areas_rls.sql`
5. Paste into the query editor
6. Click **Run** or press `Ctrl+Enter`

**Option 2: Using Supabase CLI**

```bash
supabase db push
```

### Step 2: Verify the Fix

After running the migration, verify it worked:

1. Go to **Supabase Dashboard → Table Editor**
2. Select `service_areas` table
3. Verify it contains 80+ service areas
4. Check that all rows have `active = true`

### Step 3: Check RLS Policies

1. Go to **Supabase Dashboard → Authentication → Policies**
2. Find the `service_areas` table
3. Verify these policies exist:
   - **"Anyone can view active service areas"** (SELECT, TO: public)
   - **"Admins can insert service areas"** (INSERT, TO: authenticated)
   - **"Admins can update service areas"** (UPDATE, TO: authenticated)
   - **"Admins can delete service areas"** (DELETE, TO: authenticated)

### Step 4: Test in Application

1. Log in as admin
2. Navigate to **Admin Dashboard → Cleaners**
3. Click **"Add New Cleaner"**
4. Check the Service Areas field
5. You should see a searchable dropdown with service areas
6. Try typing to search (e.g., "sea")

## What the Migration Does

The migration:
1. ✅ Creates `service_areas` table if it doesn't exist
2. ✅ Enables RLS on the table
3. ✅ Drops any conflicting policies
4. ✅ Creates proper RLS policies for public read and admin write
5. ✅ Adds indexes for better performance
6. ✅ Inserts 80+ Cape Town service areas (if not already present)

## Service Areas Included

The migration populates the database with:
- **City Bowl**: Gardens, Tamboerskloof, Oranjezicht, etc. (19 areas)
- **Atlantic Seaboard**: Sea Point, Camps Bay, Clifton, etc. (11 areas)
- **Southern Suburbs**: Constantia, Claremont, Newlands, etc. (13 areas)
- **Northern Suburbs**: Durbanville, Bellville, Brackenfell, etc. (15 areas)
- **West Coast**: Table View, Bloubergstrand, Milnerton, etc. (11 areas)
- **False Bay**: Muizenberg, Kalk Bay, Fish Hoek, etc. (7 areas)
- **Helderberg**: Somerset West, Strand, Gordon's Bay (3 areas)
- **Cape Flats**: Mitchell's Plain, Khayelitsha, etc. (7 areas)
- **Other**: De Waterkant, Zonnebloem (2 areas)

**Total: 88 service areas**

## Enhanced Error Handling

The CleanerDialog component now includes:
- ✅ More detailed error logging
- ✅ Better error messages for users
- ✅ Warning when no service areas are found
- ✅ Success message showing number of areas loaded

## Troubleshooting

### Error Persists After Migration

If the error continues:

1. **Check browser console** for detailed error message
2. **Verify migration ran successfully**:
   ```sql
   SELECT COUNT(*) FROM public.service_areas WHERE active = true;
   ```
   Should return 88 (or however many areas you have)

3. **Check RLS policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'service_areas';
   ```

4. **Test direct query** in SQL Editor:
   ```sql
   SELECT id, name FROM public.service_areas 
   WHERE active = true 
   ORDER BY name;
   ```

### Still Getting Errors?

1. **Clear browser cache** and refresh
2. **Check network tab** in browser DevTools for the actual error
3. **Verify Supabase connection** in other parts of the app
4. **Check that your Supabase URL and anon key** are correct in `.env` file

### Database Connection Issues

If you can't connect to the database:
1. Check `.env` file has correct Supabase credentials
2. Verify your Supabase project is active
3. Check your internet connection
4. Try accessing Supabase dashboard directly

## Alternative: Manual Data Entry (Temporary)

If you need a quick workaround while troubleshooting:

1. Go to **Supabase Dashboard → Table Editor**
2. Select `service_areas` table (create it if it doesn't exist)
3. Click **Insert row**
4. Add service areas manually:
   - `name`: "Sea Point"
   - `active`: true
   - Click **Save**
5. Repeat for a few key areas

## SQL to Run Manually (If Needed)

If the migration file doesn't work, you can run this SQL directly:

```sql
-- Create table
CREATE TABLE IF NOT EXISTS public.service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;

-- Create public read policy
DROP POLICY IF EXISTS "Anyone can view active service areas" ON public.service_areas;
CREATE POLICY "Anyone can view active service areas"
ON public.service_areas
FOR SELECT
TO public
USING (active = true);

-- Insert test data
INSERT INTO public.service_areas (name, active) VALUES
('Sea Point', true),
('Camps Bay', true),
('Gardens', true),
('Constantia', true),
('Claremont', true)
ON CONFLICT (name) DO NOTHING;
```

Then refresh the page and try again.

## After Fixing

Once the error is fixed:
1. ✅ Service areas should load in the dropdown
2. ✅ You should be able to search and select areas
3. ✅ Selected areas should display as badges
4. ✅ You can add/edit cleaners with service areas

## Need More Help?

Check these files for more information:
- `SERVICE_AREAS_FEATURE_SUMMARY.md` - Feature documentation
- `CLEANER_MANAGEMENT_GUIDE.md` - Complete guide
- `supabase/migrations/20250115130000_fix_service_areas_rls.sql` - Migration file

## Verification Query

After applying the fix, run this query to verify everything is working:

```sql
-- Check table exists
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM public.service_areas) as row_count,
  (SELECT COUNT(*) FROM public.service_areas WHERE active = true) as active_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'service_areas';

-- List all active service areas
SELECT id, name, active, created_at 
FROM public.service_areas 
WHERE active = true 
ORDER BY name 
LIMIT 10;
```

Expected results:
- Table exists
- `row_count`: 88 (or more)
- `active_count`: 88 (or more)
- List shows 10 service areas alphabetically

