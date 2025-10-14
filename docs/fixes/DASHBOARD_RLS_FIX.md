# Dashboard RLS Policy Fix Guide

## The Problem

After implementing the dashboard with role-based access control, two critical issues emerged:

### Issue 1: Booking Form Cannot Fetch Data
The booking form (service selection, cleaner selection, etc.) is unable to fetch data from the database. This affects:
- Services list
- Extras list
- Cleaners list
- Suburbs data

### Issue 2: Customer Dashboard Cannot Fetch Bookings
The customer dashboard shows no bookings even when the user has made bookings.

## Root Cause Analysis

The issues are caused by **Row Level Security (RLS) policies** that were added in the dashboard implementation migration (`20251012140000_add_user_roles.sql`):

### 1. Missing Profiles for Existing Users
- The migration added a `role` column to the `profiles` table with a default value of `'customer'`
- However, if users signed up before the migration was run, they may not have a role value
- Existing users who don't have profiles at all will fail authentication checks

### 2. Policy Conflicts
- Multiple policies exist for the same tables from different migrations
- Some policies check the `profiles` table for roles, which may fail if the profile doesn't exist or doesn't have a role

### 3. Anonymous Access
- The booking form needs to work for non-logged-in users (browsing services)
- Public read policies may have been inadvertently restricted

## The Solution

A new migration has been created: `20251012150000_fix_rls_policies.sql`

This migration:

### 1. Backfills Missing Data
```sql
-- Ensures all auth users have a profile
INSERT INTO public.profiles (id, role, created_at, updated_at)
SELECT id, 'customer'::text, now(), now()
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id)
ON CONFLICT (id) DO NOTHING;

-- Updates existing profiles to have the customer role
UPDATE public.profiles 
SET role = 'customer' 
WHERE role IS NULL;
```

### 2. Ensures Public Read Access
Recreates policies for public tables that should be readable by everyone:
- `services` - Anyone can view services (even when not logged in)
- `extras` - Anyone can view extras
- `cleaners` - Anyone can view cleaners
- `suburbs` - Anyone can view suburbs (if table exists)

### 3. Ensures User Access to Own Data
Recreates policies for user-specific data:
- Users can view/create/update their own bookings
- Users can view/update their own profiles

### 4. Updates the Profile Creation Trigger
Updates the `handle_new_user()` function to:
- Automatically create profiles with `role = 'customer'` for new signups
- Include the role field in the profile creation
- Handle conflicts gracefully

## How to Apply the Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file: `supabase/migrations/20251012150000_fix_rls_policies.sql`
4. Copy the entire contents
5. Paste into a new SQL query in Supabase
6. Click **Run** to execute the migration
7. Verify there are no errors in the output

### Option 2: Using Supabase CLI

If you have Supabase CLI installed and linked to your project:

```bash
# Navigate to your project directory
cd cleanflow-book

# Apply the migration
supabase db push

# Or apply this specific migration
supabase migration up --file supabase/migrations/20251012150000_fix_rls_policies.sql
```

### Option 3: Manual Application

If migrations are not being automatically tracked, you can manually run the SQL:

```bash
# Connect to your Supabase database
psql postgresql://your-connection-string

# Run the migration
\i supabase/migrations/20251012150000_fix_rls_policies.sql
```

## Verification Steps

After applying the migration, verify everything works:

### 1. Test Public Access (Not Logged In)
1. Open your app in an incognito/private browser window
2. Navigate to the booking page (`/booking/service/select`)
3. Verify that services load properly
4. Check that you can proceed through the booking flow
5. Verify cleaners are visible

### 2. Test Customer Dashboard (Logged In)
1. Log in as a customer who has made bookings
2. Navigate to `/dashboard`
3. Verify that your bookings are displayed
4. Check that the stats show correct numbers
5. Try updating your profile in Settings

### 3. Test Admin Dashboard (If You Have Admin Access)
1. First, create an admin user by running this SQL in Supabase:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE id = 'YOUR_USER_ID';
   ```
2. Log in as admin
3. Navigate to `/dashboard/admin`
4. Verify you can see all bookings, cleaners, and applications

### 4. Test Cleaner Dashboard (If You Have Cleaner Access)
1. Create a cleaner user by:
   - First creating a cleaner in the cleaners table
   - Then linking it to a user:
     ```sql
     UPDATE public.cleaners 
     SET user_id = 'YOUR_USER_ID' 
     WHERE id = 'CLEANER_ID';
     
     UPDATE public.profiles 
     SET role = 'cleaner' 
     WHERE id = 'YOUR_USER_ID';
     ```
2. Log in as cleaner
3. Navigate to `/dashboard/cleaner`
4. Verify you can see your assigned jobs

## Database Console Checks

You can also verify the fix directly in the database:

```sql
-- 1. Check that all users have profiles with roles
SELECT 
  u.id,
  u.email,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Expected: All users should have a role (customer, admin, or cleaner)

-- 2. Check RLS policies on services table
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'services';

-- Expected: Should see "Services are viewable by everyone" with USING (true)

-- 3. Check RLS policies on bookings table
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY policyname;

-- Expected: Should see policies for users, admins, and cleaners

-- 4. Test service query as anonymous user
SELECT COUNT(*) FROM public.services;

-- Expected: Should return the count without errors
```

## Common Issues After Fix

### Issue: "permission denied for table services"
**Cause:** RLS is enabled but policies are not properly set
**Fix:** Re-run the migration or manually run:
```sql
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
```

### Issue: "null value in column role violates not-null constraint"
**Cause:** A user was created after the role column was added but before the trigger was updated
**Fix:** Run:
```sql
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;
```

### Issue: Customer dashboard shows no bookings but bookings exist
**Cause:** The booking's `user_id` might not match the logged-in user
**Fix:** Check the data:
```sql
-- Replace 'user_email@example.com' with actual email
SELECT b.id, b.reference, b.user_id, u.email 
FROM public.bookings b
LEFT JOIN auth.users u ON b.user_id = u.id
WHERE u.email = 'user_email@example.com';
```

## Prevention for Future

To prevent similar issues in the future:

1. **Always backfill data** when adding new required columns
2. **Test policies** with different user roles before deploying
3. **Document policy changes** in migration files
4. **Use DROP POLICY IF EXISTS** before creating policies to avoid conflicts
5. **Test both authenticated and anonymous access** paths

## Rollback Plan

If the fix causes issues, you can rollback by:

1. The original policies are preserved (we only DROP and recreate them)
2. If needed, restore from a database backup taken before applying the migration
3. Alternatively, manually adjust the policies in the Supabase dashboard

## Summary

This fix ensures:
- ✅ All users have profiles with roles
- ✅ Public tables (services, extras, cleaners) are readable by everyone
- ✅ Users can access their own bookings and profiles
- ✅ Admin and cleaner roles have appropriate access
- ✅ New user signups automatically get the customer role
- ✅ The booking form works for both logged-in and anonymous users
- ✅ All dashboards can fetch their respective data

## Need Help?

If you're still experiencing issues after applying this fix:

1. Check the browser console for specific error messages
2. Check the Supabase logs for database errors
3. Verify the migration was applied successfully
4. Review the verification steps above
5. Check if there are any custom policies conflicting with these fixes

