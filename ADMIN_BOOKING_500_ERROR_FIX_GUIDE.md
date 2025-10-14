# URGENT ADMIN BOOKING FIX - 500 Error Resolution

## Problem Summary
The admin dashboard is experiencing 500 server errors when:
1. Assigning cleaners to bookings
2. Updating booking statuses

## Root Cause
The issue is caused by Row Level Security (RLS) policies on the `bookings` table that are preventing admin users from updating bookings, even though they should have full access.

## Solution Files Created

### 1. URGENT_ADMIN_BOOKING_FIX.sql
This is the main fix that needs to be applied to your Supabase database. It:
- Creates/updates the `is_admin()` function
- Removes all conflicting RLS policies
- Creates comprehensive new policies that allow admins to manage all bookings
- Ensures proper admin user setup

### 2. test_admin_booking_fix.sql
This test script verifies that the fix works correctly.

## How to Apply the Fix

### Step 1: Apply the Main Fix
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `URGENT_ADMIN_BOOKING_FIX.sql`
4. Run the script

### Step 2: Verify the Fix
1. Copy and paste the contents of `test_admin_booking_fix.sql`
2. Run the test script
3. All tests should show "PASS" status

### Step 3: Test in Your Application
1. Refresh your admin dashboard
2. Try assigning a cleaner to a booking
3. Try updating a booking status
4. Both operations should now work without 500 errors

## What the Fix Does

### RLS Policies Created:
1. **users_view_own_bookings** - Users can view their own bookings
2. **users_create_own_bookings** - Users can create their own bookings  
3. **users_update_own_bookings** - Users can update their own bookings
4. **users_delete_own_bookings** - Users can delete their own bookings
5. **admins_view_all_bookings** - Admins can view ALL bookings
6. **admins_create_all_bookings** - Admins can create bookings for any user
7. **admins_update_all_bookings** - **CRITICAL** - Admins can update ALL bookings (fixes cleaner assignment)
8. **admins_delete_all_bookings** - Admins can delete ALL bookings

### Key Features:
- Uses `SECURITY DEFINER` for the `is_admin()` function for better security
- Handles both `profiles.role` and `user_roles.role` tables
- Includes proper error handling and conflict resolution
- Creates profiles for users that don't have them

## Expected Results
After applying this fix:
- ✅ Admin users can assign cleaners to bookings
- ✅ Admin users can update booking statuses  
- ✅ Regular users can still manage their own bookings
- ✅ No more 500 server errors
- ✅ Cleaner assignment dropdown works properly
- ✅ Status update dropdown works properly

## Troubleshooting
If you still experience issues after applying the fix:

1. **Check Admin Role**: Verify your user has `role = 'admin'` in either the `profiles` or `user_roles` table
2. **Check Policies**: Run the test script to verify all policies are working
3. **Check Function**: Verify the `is_admin()` function returns `true` for your user
4. **Clear Cache**: Refresh your browser and clear any cached data

## Files Modified
- `URGENT_ADMIN_BOOKING_FIX.sql` - Main database fix
- `test_admin_booking_fix.sql` - Verification script

## Next Steps
1. Apply the SQL fix to your Supabase database
2. Test the admin functionality
3. Verify that cleaner assignment and status updates work
4. Monitor for any remaining issues

This fix addresses the core RLS permission issue that was causing the 500 errors in your admin dashboard.
