# Fix Multiple Booking Permissions Issue

## Problem Description
You're experiencing an issue where after logging in, you can only make one booking. When trying to make a second booking, you get a "no right to view" error.

## Root Cause
This is caused by conflicting Row Level Security (RLS) policies from multiple database migrations. The policies are inconsistent and some use different role-checking methods, causing permission conflicts after the first booking.

## Solution
I've created a comprehensive fix that cleans up all conflicting policies and creates consistent, working permissions.

## Files Created
1. **`SIMPLE_BOOKING_PERMISSIONS_FIX.sql`** - Simplified SQL fix script (RECOMMENDED)
2. **`FIX_MULTIPLE_BOOKING_PERMISSIONS.sql`** - Complete SQL fix script (may have schema issues)
3. **`apply_booking_permissions_fix.js`** - Automated fix script
4. **`BOOKING_PERMISSIONS_FIX_GUIDE.md`** - This guide

## How to Apply the Fix

### Option 1: Manual SQL Execution (Recommended)
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of **`SIMPLE_BOOKING_PERMISSIONS_FIX.sql`** (use this one!)
4. Paste into the SQL Editor
5. Click **Run** to execute

**⚠️ Important**: Use `SIMPLE_BOOKING_PERMISSIONS_FIX.sql` as it's more robust and works with any database schema.

### Option 2: Automated Script
1. Make sure you have the required environment variables:
   - `VITE_SUPABASE_URL` or `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Run the script:
   ```bash
   node apply_booking_permissions_fix.js
   ```

## What the Fix Does

### 1. Cleans Up Conflicting Policies
- Removes all existing, conflicting RLS policies for bookings, booking_extras, payments, and profiles
- Eliminates duplicate policies with different names but same functionality

### 2. Creates Consistent User Permissions
- **Customers**: Can view, create, update, and delete their own bookings
- **Admins**: Can view and manage all bookings
- **Cleaners**: Can view and update bookings assigned to them

### 3. Ensures Proper User Setup
- Creates profiles for any users that don't have one
- Sets default 'customer' role for all users
- Updates the user creation trigger to automatically assign roles

### 4. Fixes Related Tables
- **booking_extras**: Users can manage extras for their own bookings
- **payments**: Users can view payments for their own bookings
- **profiles**: Users can manage their own profiles, admins can manage all

## Verification Steps

After applying the fix, verify it works:

### 1. Check Database Policies
Run this query in Supabase SQL Editor:
```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('bookings', 'booking_extras', 'payments', 'profiles')
ORDER BY tablename, policyname;
```

### 2. Check User Profiles
```sql
SELECT id, role, created_at 
FROM public.profiles 
ORDER BY created_at DESC;
```

### 3. Test User Access
```sql
-- This should return bookings for the authenticated user
SELECT COUNT(*) as booking_count
FROM public.bookings 
WHERE user_id = auth.uid();
```

## Testing the Fix

### Manual Testing Steps
1. **Log in** to your application
2. **Make a booking** - this should work as before
3. **Complete the booking** (payment, confirmation)
4. **Try to make another booking** - this should now work without errors
5. **Check your dashboard** - you should see all your bookings
6. **Try updating a booking** - should work for your own bookings

### What Should Work After Fix
- ✅ Users can make multiple bookings
- ✅ Users can see all their own bookings
- ✅ Users can update/cancel their own bookings
- ✅ Admins can see all bookings
- ✅ Cleaners can see their assigned bookings
- ✅ No more "no right to view" errors

### What Should NOT Work (Security)
- ❌ Users cannot see other users' bookings
- ❌ Users cannot modify other users' bookings
- ❌ Non-admin users cannot see admin-only data

## Troubleshooting

### If the fix doesn't work:

1. **Check for errors in Supabase logs**
   - Go to Supabase Dashboard → Logs
   - Look for any RLS policy errors

2. **Verify policies were created**
   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'bookings';
   ```
   Should show policies like:
   - "Users can view their own bookings"
   - "Users can create their own bookings"
   - "Admins can view all bookings"

3. **Check user profile exists**
   ```sql
   SELECT * FROM public.profiles WHERE id = auth.uid();
   ```
   Should return your user with role = 'customer'

4. **Test with a fresh user**
   - Create a new test account
   - Try making multiple bookings

### If you still get "no right to view":

1. **Clear browser cache and cookies**
2. **Log out and log back in**
3. **Check if you're using the correct Supabase URL**
4. **Verify environment variables are correct**

## Rollback Plan

If something goes wrong, you can temporarily disable RLS:

```sql
-- TEMPORARY - Only for emergency
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_extras DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING**: This removes all security - only use temporarily and re-enable RLS immediately.

## Technical Details

### Policy Structure
The fix creates policies using this pattern:
```sql
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);
```

### Role-Based Access
- **Customer role**: Default for all users, can manage own data
- **Admin role**: Can manage all data
- **Cleaner role**: Can manage assigned bookings

### Security Model
- **Row Level Security (RLS)** remains enabled
- **Policies** control access at the database level
- **No application-level security bypasses** the database policies

## Support

If you continue to have issues:

1. **Check the Supabase documentation**: https://supabase.com/docs/guides/auth/row-level-security
2. **Review your environment variables**
3. **Check for any custom functions** that might interfere
4. **Contact support** with:
   - Your Supabase project URL
   - The exact error message
   - Steps to reproduce the issue

## Summary

This fix resolves the multiple booking permissions issue by:
- ✅ Cleaning up conflicting RLS policies
- ✅ Creating consistent, working permissions
- ✅ Ensuring proper user role setup
- ✅ Fixing related table permissions
- ✅ Maintaining security while enabling functionality

After applying this fix, users should be able to make multiple bookings without any "no right to view" errors.

---

**Last Updated**: January 15, 2025  
**Fix Status**: Ready to Apply ✅
