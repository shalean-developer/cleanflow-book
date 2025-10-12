# Fix for "Failed to load dashboard data" Error

## Problem
You're getting a "Failed to load dashboard data" error because the Row Level Security (RLS) policies in your Supabase database are preventing data access after implementing the dashboard feature.

## Root Cause
1. **Missing user profiles**: Some users don't have profiles with roles assigned
2. **Restrictive RLS policies**: Services, extras, and cleaners tables aren't accessible to non-authenticated users
3. **Missing policies**: Some tables don't have the correct RLS policies for authenticated users

## Solution

### Step 1: Apply the SQL Fix

1. **Open your Supabase dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your CleanFlow project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste the entire contents of `MANUAL_RLS_FIX.sql`**
   - Open the `MANUAL_RLS_FIX.sql` file in your project
   - Copy all the SQL code
   - Paste it into the SQL Editor

4. **Execute the SQL**
   - Click "Run" or press Ctrl+Enter
   - Wait for all statements to complete successfully
   - You should see "Success" messages

### Step 2: Verify the Fix

1. **Test your booking form** (not logged in):
   - Go to `/booking/service/select`
   - Services should now load properly
   - You should be able to proceed through the booking flow

2. **Test your dashboard** (logged in):
   - Sign in to your account
   - Go to `/dashboard`
   - Your bookings should now appear
   - Stats should show correct numbers

3. **Check for errors**:
   - Open browser console (F12)
   - Look for any RLS permission errors
   - Should see no "permission denied" errors

### Step 3: Troubleshooting

If you still see issues after applying the fix:

#### Check RLS Policies
Run this query in Supabase SQL Editor:
```sql
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('services', 'extras', 'cleaners', 'bookings', 'profiles')
ORDER BY tablename;
```

You should see policies like:
- "Services are viewable by everyone" with `USING (true)`
- "Extras are viewable by everyone" with `USING (true)`
- "Cleaners are viewable by everyone" with `USING (true)`
- "Users can view their own bookings" with `USING (auth.uid() = user_id)`

#### Check User Profiles
Run this query to ensure all users have profiles:
```sql
SELECT COUNT(*) FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.role IS NULL OR p.id IS NULL;
```
This should return `0`.

#### Check Environment Variables
Make sure these are set in your Lovable environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Step 4: Test All Pages

After applying the fix, test these pages:

1. **Booking Flow** (not logged in):
   - `/booking/service/select` ✅ Services should load
   - `/booking/review` ✅ Should work end-to-end

2. **Customer Dashboard** (logged in):
   - `/dashboard` ✅ Bookings should appear
   - Profile settings should be editable

3. **Admin Dashboard** (if you have admin user):
   - `/dashboard/admin` ✅ All data should load

4. **Cleaner Dashboard** (if you have cleaner user):
   - `/dashboard/cleaner` ✅ Jobs should appear

## What the Fix Does

The SQL fix:

1. **Creates profiles** for any users that don't have them
2. **Sets default role** to 'customer' for all existing users
3. **Enables public read access** to services, extras, and cleaners tables
4. **Sets up proper policies** for bookings and profiles
5. **Updates the user creation trigger** to automatically assign roles to new signups

## Files Created

- `MANUAL_RLS_FIX.sql` - The main SQL fix to apply
- `apply_rls_fix.js` - Alternative script approach (if you prefer)
- `test_dashboard_fix.js` - Test script to verify the fix
- `DASHBOARD_FIX_INSTRUCTIONS.md` - This instruction file

## Expected Results

After applying the fix:
- ✅ Services, extras, and cleaners load on booking pages (even when not logged in)
- ✅ Customer dashboard displays user's bookings correctly
- ✅ All dashboards fetch their respective data
- ✅ No RLS permission errors in console or Supabase logs
- ✅ New user signups automatically get the 'customer' role

## Need Help?

If you're still experiencing issues after following these steps:

1. **Check Supabase logs** for RLS policy violations
2. **Verify your environment variables** are correct
3. **Test with a fresh browser session** (clear cache/cookies)
4. **Check if RLS is enabled** on the tables (should be enabled)

The error should be completely resolved after applying this fix!
