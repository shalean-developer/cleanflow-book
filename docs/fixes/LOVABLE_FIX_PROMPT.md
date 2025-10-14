# Prompt for Lovable: Fix Database Data Loading Issues

## Copy and paste this prompt to Lovable:

---

I need help fixing critical data loading issues in my CleanFlow booking application after implementing role-based dashboards.

## Current Problems:

1. **Booking form cannot fetch data from database:**
   - Services are not loading on `/booking/service/select`
   - Extras are not appearing in the booking flow
   - Cleaners list is not fetching
   - Users see loading spinners indefinitely or error messages

2. **Customer dashboard is not fetching data:**
   - `/dashboard` shows empty state even when bookings exist
   - No bookings are displayed in the dashboard
   - Stats show zero for all metrics

3. **Other dashboards may have similar issues:**
   - Admin dashboard at `/dashboard/admin`
   - Cleaner dashboard at `/dashboard/cleaner`

## Root Cause:

After implementing role-based access control in the dashboard feature, Row Level Security (RLS) policies are preventing data access because:
- Existing users don't have roles assigned in their profiles
- Public read policies for services/extras/cleaners may be misconfigured
- RLS policies are checking for profiles that don't exist or don't have the `role` column populated

## The Fix:

I have a migration file ready: `supabase/migrations/20251012150000_fix_rls_policies.sql`

This migration:
- Backfills all user profiles with the 'customer' role
- Ensures services, extras, and cleaners are publicly readable (even for non-authenticated users)
- Fixes RLS policies for bookings, profiles, and other tables
- Updates the profile creation trigger to include roles for new signups

## What I Need You To Do:

### Step 1: Apply the Migration to Supabase

1. Open the file: `supabase/migrations/20251012150000_fix_rls_policies.sql`
2. Apply this migration to my Supabase database using the appropriate method:
   - If you can execute Supabase CLI commands, run: `supabase db push`
   - If you can access the Supabase dashboard programmatically, execute the SQL
   - Otherwise, provide me with clear instructions on how to apply it manually

### Step 2: Verify the Fix

After applying the migration, please:

1. **Check that the migration was successful:**
   ```sql
   -- Verify all users have profiles with roles
   SELECT COUNT(*) FROM auth.users u
   LEFT JOIN public.profiles p ON u.id = p.id
   WHERE p.role IS NULL OR p.id IS NULL;
   -- Should return 0
   ```

2. **Test the booking form data fetching:**
   - Check if the query in `src/pages/booking/ServiceSelect.tsx` works:
     ```typescript
     const { data: services } = useQuery({
       queryKey: ['services'],
       queryFn: async () => {
         const { data } = await supabase.from('services').select('*').order('base_price');
         return data || [];
       },
     });
     ```
   - This should fetch services without errors

3. **Test the customer dashboard data fetching:**
   - Check if the query in `src/pages/dashboard/CustomerDashboard.tsx` works:
     ```typescript
     const { data, error } = await supabase
       .from('bookings')
       .select(`*, services(*), cleaners(*)`)
       .eq('user_id', user?.id)
       .order('created_at', { ascending: false });
     ```

### Step 3: Troubleshoot Any Remaining Issues

If data is still not loading after applying the migration:

1. **Check for RLS policy errors:**
   - Look for console errors like "permission denied for table"
   - Check Supabase logs for RLS policy violations

2. **Verify environment variables:**
   - Ensure `VITE_SUPABASE_URL` is set correctly
   - Ensure `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) is set correctly

3. **Check if RLS is enabled on tables:**
   ```sql
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('services', 'extras', 'cleaners', 'bookings', 'profiles');
   ```

4. **Verify the public read policies exist:**
   ```sql
   SELECT tablename, policyname, cmd, qual 
   FROM pg_policies 
   WHERE tablename IN ('services', 'extras', 'cleaners')
   ORDER BY tablename;
   ```
   - Should see "viewable by everyone" policies with `USING (true)`

5. **Check for JavaScript errors:**
   - Open browser console (F12)
   - Look for errors when visiting `/booking/service/select` or `/dashboard`
   - Share any error messages you find

### Step 4: Test All Affected Pages

Please test these pages and report any remaining issues:

1. **Booking Flow (not logged in):**
   - `/booking/service/select` - Services should load
   - Should be able to proceed through booking steps

2. **Customer Dashboard (logged in):**
   - `/dashboard` - Bookings should appear
   - Stats should show correct numbers
   - Profile settings should be editable

3. **Admin Dashboard (if admin user exists):**
   - `/dashboard/admin` - All bookings, cleaners, applications should load

### Step 5: Additional Fixes if Needed

If specific tables are still not accessible, you may need to add additional policies. For example:

- If suburbs table exists and is not loading:
  ```sql
  CREATE POLICY "Suburbs are viewable by everyone" ON public.suburbs FOR SELECT USING (true);
  ```

- If promotional codes are not working:
  ```sql
  CREATE POLICY "Promo codes viewable by authenticated users" ON public.promotional_codes FOR SELECT TO authenticated USING (true);
  ```

## Expected Outcome:

After completing these steps:
- ✅ Services, extras, and cleaners load on booking pages (even when not logged in)
- ✅ Customer dashboard displays user's bookings correctly
- ✅ All dashboards (customer, admin, cleaner) fetch their respective data
- ✅ No RLS permission errors in console or Supabase logs
- ✅ New user signups automatically get the 'customer' role

## Files to Focus On:

**Migration:**
- `supabase/migrations/20251012150000_fix_rls_policies.sql` (MAIN FILE TO APPLY)

**Frontend Files to Check:**
- `src/pages/booking/ServiceSelect.tsx`
- `src/pages/booking/Review.tsx`
- `src/pages/dashboard/CustomerDashboard.tsx`
- `src/pages/dashboard/AdminDashboard.tsx`
- `src/pages/dashboard/CleanerDashboard.tsx`
- `src/hooks/useAuth.tsx`
- `src/integrations/supabase/client.ts`

**Database Tables Affected:**
- `public.profiles` (needs role column populated)
- `public.services` (needs public read policy)
- `public.extras` (needs public read policy)
- `public.cleaners` (needs public read policy)
- `public.bookings` (needs user-specific read policy)

## Documentation for Reference:

- `DASHBOARD_RLS_FIX.md` - Comprehensive guide explaining the issue
- `QUICK_FIX_STEPS.md` - Quick reference for manual fixes
- `DASHBOARD_IMPLEMENTATION_SUMMARY.md` - Details about the dashboard implementation

## Important Notes:

- The migration uses `DROP POLICY IF EXISTS` so it's safe to run multiple times
- All existing data is preserved; we're only adding/updating policies and backfilling roles
- The fix maintains the role-based access control while ensuring public data remains accessible
- Anonymous users (not logged in) should be able to browse services, extras, and cleaners

Please apply the migration, run the verification steps, and let me know if any issues remain. If you encounter specific errors, please share:
1. The exact error message (from console or Supabase logs)
2. Which page/component is failing
3. Whether the user is logged in or not when the error occurs

Thank you!

---

## End of Prompt

Copy everything between the "---" lines above and paste it into Lovable.

