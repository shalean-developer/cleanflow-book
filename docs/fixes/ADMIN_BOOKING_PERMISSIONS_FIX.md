# 🔧 Admin Booking Permissions Fix

## Problem
Getting 500 server errors when trying to:
- Update booking status in admin dashboard
- Assign cleaners to bookings
- Error: "Failed to load resource: the server responded with a status of 500"

## Root Cause
The RLS (Row Level Security) policies for the bookings table are not properly configured to allow admin users to update bookings.

## Solution
A migration has been created to fix the admin permissions: `supabase/migrations/20250114000000_fix_admin_booking_permissions.sql`

## How to Apply the Fix

### Option 1: Quick Fix (Recommended if you get policy conflicts)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: `utfvbtcszzafuoyytlpf`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Apply the Quick Fix**
   - Copy the entire contents of `quick_admin_fix.sql`
   - Paste into the SQL editor
   - Click "Run" to execute
   - Wait for success message

4. **Test the Fix**
   - Refresh your admin dashboard
   - Try updating a booking status
   - Try assigning a cleaner to a booking

### Option 2: Full Migration (If you want complete policy reset)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: `utfvbtcszzafuoyytlpf`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Apply the Full Migration**
   - Copy the entire contents of `supabase/migrations/20250114000000_fix_admin_booking_permissions.sql`
   - Paste into the SQL editor
   - Click "Run" to execute
   - Wait for success message

4. **Test the Fix**
   - Refresh your admin dashboard
   - Try updating a booking status
   - Try assigning a cleaner to a booking

### Option 3: Using Supabase CLI

```bash
# Navigate to project directory
cd "C:\Users\27825\shaleanpro\cleanflow-book"

# Apply the migration
npx supabase db push

# Or apply specific migration
npx supabase migration up --file supabase/migrations/20250114000000_fix_admin_booking_permissions.sql
```

## What the Fix Does

### ✅ Creates/Updates Admin Function
- Creates `public.is_admin(uid)` function
- Checks both `profiles` and `user_roles` tables for admin role

### ✅ Drops Conflicting Policies
- Removes all existing booking policies that might conflict
- Ensures clean slate for new policies

### ✅ Creates Clean Admin Policies
- **Admins can view all bookings** - SELECT permission
- **Admins can create all bookings** - INSERT permission  
- **Admins can update all bookings** - UPDATE permission
- **Admins can delete all bookings** - DELETE permission

### ✅ Maintains User Access
- Users can still manage their own bookings
- Cleaners can view their assigned bookings

### ✅ Ensures Profile Consistency
- Creates profiles for users without them
- Sets default role to 'customer' for users without roles

## Verification Steps

After applying the migration:

1. **Sign in as admin user**
2. **Go to admin dashboard**
3. **Test booking status updates:**
   - Click on a booking's status dropdown
   - Change status from "Pending" to "Confirmed"
   - Should work without 500 error
4. **Test cleaner assignment:**
   - Click on a booking's cleaner dropdown
   - Assign a cleaner to a booking
   - Should work without 500 error
5. **Check browser console:**
   - No more 500 errors
   - Success messages for updates

## Expected Results

- ✅ No more 500 server errors
- ✅ Admin can update booking status
- ✅ Admin can assign cleaners to bookings
- ✅ Success toast messages appear
- ✅ Changes persist in database
- ✅ Users can still manage their own bookings

## Troubleshooting

If you still get errors after applying the fix:

1. **Check admin role:**
   ```sql
   SELECT id, role, full_name FROM public.profiles WHERE role = 'admin';
   ```

2. **Test is_admin function:**
   ```sql
   SELECT public.is_admin(auth.uid()) as is_admin;
   ```

3. **Check booking policies:**
   ```sql
   SELECT policyname, cmd FROM pg_policies WHERE tablename = 'bookings';
   ```

4. **Verify RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bookings';
   ```

## Files Created

- `supabase/migrations/20250114000000_fix_admin_booking_permissions.sql` - Migration file
- `apply_admin_booking_fix.js` - Helper script
- `ADMIN_BOOKING_PERMISSIONS_FIX.md` - This documentation

## Next Steps

After applying this fix, the admin dashboard should work properly for:
- ✅ Updating booking statuses
- ✅ Assigning cleaners to bookings
- ✅ Viewing all booking details
- ✅ Managing customer bookings

The 500 errors should be completely resolved!
