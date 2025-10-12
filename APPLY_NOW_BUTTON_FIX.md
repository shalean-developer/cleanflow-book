# Fix for "new row violates row-level security policy" Error

## Problem
When users click the "Apply Now" button and submit a job application, they get an error:
```
new row violates row-level security policy for table "cleaner_applications"
```

## Root Cause
The `cleaner_applications` table has Row-Level Security (RLS) enabled, but the INSERT policy that allows anonymous users (people without accounts) to submit applications is missing or misconfigured.

## Solution

### Option 1: Run the Fix via Supabase Dashboard (Recommended)

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: **cleanflow-book**

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Fix SQL**
   - Copy the entire contents of `FIX_CLEANER_APPLICATIONS_RLS.sql`
   - Paste it into the SQL editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify the Fix**
   - The verification query at the end of the script will show you the policies
   - You should see: `"Allow anyone to submit cleaner applications"` with `cmd: INSERT`

5. **Test the Application**
   - Go to your application's "Apply Now" page
   - Fill out and submit a test application
   - It should now work without errors!

### Option 2: Apply via Supabase CLI

If you have your Supabase project linked locally:

```bash
# Link your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
supabase db push
```

The migration file `supabase/migrations/20251012160000_fix_cleaner_applications_insert_policy.sql` will be applied.

## What This Fix Does

1. **Removes conflicting policies**: Drops any old or duplicate INSERT policies
2. **Creates the correct INSERT policy**: Allows anyone (including anonymous users) to insert applications
3. **Fixes storage policies**: Ensures file uploads work for application documents
4. **Verifies bucket configuration**: Ensures the 'applications' storage bucket exists and is properly configured

## Why This Policy Is Safe

The policy allows public INSERT operations because:
- Job applicants don't have user accounts when they apply
- The data submitted is validated on the frontend with Zod schema
- The table still has RLS enabled for SELECT, UPDATE, and DELETE operations
- Only admins can view, update, or delete applications (controlled by separate policies)

## Technical Details

The key policy being created:
```sql
CREATE POLICY "Allow anyone to submit cleaner applications"
ON public.cleaner_applications
FOR INSERT
TO public
WITH CHECK (true);
```

This policy:
- Applies to INSERT operations only
- Applies to the `public` role (unauthenticated users)
- Has no restrictions (`WITH CHECK (true)`)
- Does NOT allow reading, updating, or deleting applications

## Verification

After applying the fix, you can verify it worked by running this query in your SQL editor:

```sql
SELECT 
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies 
WHERE tablename = 'cleaner_applications' 
AND cmd = 'INSERT';
```

You should see the policy with:
- **policyname**: "Allow anyone to submit cleaner applications"
- **cmd**: INSERT
- **roles**: {public}
- **with_check**: true

## Troubleshooting

### If you still get RLS errors after applying the fix:

1. **Clear your browser cache** - Old API responses might be cached
2. **Check for conflicting policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'cleaner_applications';
   ```
3. **Verify RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'cleaner_applications';
   ```
   Should show `rowsecurity: true`

4. **Check storage bucket permissions**:
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'applications';
   ```
   Should show `public: true`

### If file uploads fail:

Run this additional query:
```sql
-- Ensure storage policies exist
SELECT * FROM storage.policies WHERE bucket_id = 'applications';
```

You should see policies for INSERT and SELECT operations.

## Files Created/Modified

- ✅ `FIX_CLEANER_APPLICATIONS_RLS.sql` - Standalone SQL fix (run in dashboard)
- ✅ `supabase/migrations/20251012160000_fix_cleaner_applications_insert_policy.sql` - Migration file (for CLI)
- 📝 This guide - `APPLY_NOW_BUTTON_FIX.md`

## Next Steps

1. Apply the fix using Option 1 or Option 2 above
2. Test the "Apply Now" functionality
3. If it works, you're done! ✨
4. If not, check the Troubleshooting section

## Questions?

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Check the Supabase logs in your dashboard
3. Verify all policies are in place as described above

