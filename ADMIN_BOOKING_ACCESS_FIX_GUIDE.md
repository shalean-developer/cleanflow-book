# Admin Dashboard Booking Access Fix Guide

## Problem Description

The admin dashboard shows "No bookings found" even though there are bookings in the database. This happens because:

1. **Role System Mismatch**: The authentication system checks both `profiles.role` and `user_roles.role` tables, but RLS policies only check `profiles.role`
2. **Missing Admin Policies**: Admin users may not have proper RLS policies to view all bookings
3. **Inconsistent Role Storage**: Admin roles might be stored in one table but not the other

## Root Cause Analysis

Looking at the code:

### Authentication Hook (`src/hooks/useAuth.tsx`)
```typescript
// Checks user_roles table first, then falls back to profiles.role
const { data: roleData } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId)
  .single();

if (!roleData && profileData?.role) {
  setUserRole(profileData.role as UserRole);
}
```

### RLS Policies (Current)
```sql
-- Only checks profiles.role
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### Admin Dashboard Query (`src/pages/dashboard/AdminDashboard.tsx`)
```typescript
// This query should work for admin users but fails due to RLS
const { data: bookingsData, error: bookingsError } = await supabase
  .from('bookings')
  .select(`*, services(*), cleaners(*)`)
  .order('created_at', { ascending: false });
```

## Solution

### Step 1: Apply the RLS Fix

Run the SQL script `FIX_ADMIN_BOOKING_ACCESS.sql` in your Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `FIX_ADMIN_BOOKING_ACCESS.sql`
4. Execute the script

This script will:
- Sync roles between `profiles` and `user_roles` tables
- Update all RLS policies to check both tables
- Ensure admin users have proper access to all data

### Step 2: Verify Admin User Roles

Check if your admin user has the correct role in both tables:

```sql
-- Check profiles table
SELECT id, role, full_name FROM public.profiles WHERE role = 'admin';

-- Check user_roles table (if it exists)
SELECT user_id, role FROM public.user_roles WHERE role = 'admin';
```

If no admin users are found, manually set the admin role:

```sql
-- Replace 'your-user-id' with your actual user ID
UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-id';

-- Also update user_roles if it exists
INSERT INTO public.user_roles (user_id, role, created_at)
VALUES ('your-user-id', 'admin', now())
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Step 3: Test the Fix

Run the test script to verify everything is working:

```bash
node test_admin_booking_access.js
```

### Step 4: Verify in Browser

1. Log in as an admin user
2. Navigate to the admin dashboard
3. Check the Bookings tab
4. Bookings should now be visible

## Alternative Quick Fix

If you need a quick temporary fix while the proper solution is applied, you can temporarily disable RLS on the bookings table:

```sql
-- TEMPORARY: Disable RLS on bookings table
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Remember to re-enable it after applying the proper fix
-- ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
```

**⚠️ Warning**: Only use this as a temporary measure. Always re-enable RLS and apply proper policies for security.

## Verification Checklist

- [ ] Admin user has `role = 'admin'` in `profiles` table
- [ ] Admin user has `role = 'admin'` in `user_roles` table (if exists)
- [ ] RLS policies check both `profiles.role` and `user_roles.role`
- [ ] Admin dashboard shows bookings
- [ ] No RLS errors in browser console
- [ ] Test script shows bookings are accessible

## Common Issues

### Issue 1: "No admin users found"
**Solution**: Manually set admin role using the SQL commands above.

### Issue 2: "Bookings exist but still not showing"
**Solution**: Check browser console for RLS errors and ensure the fix script was applied correctly.

### Issue 3: "user_roles table doesn't exist"
**Solution**: This is fine. The fix script handles this case and will only use the `profiles` table.

### Issue 4: "Still getting permission denied errors"
**Solution**: Clear browser cache and re-login, or check if the RLS policies were created correctly.

## Files Modified

- `FIX_ADMIN_BOOKING_ACCESS.sql` - Main fix script
- `test_admin_booking_access.js` - Test script to verify fix
- `ADMIN_BOOKING_ACCESS_FIX_GUIDE.md` - This guide

## Testing

After applying the fix, test these scenarios:

1. **Admin Dashboard**: Should show all bookings
2. **Customer Dashboard**: Should only show user's own bookings
3. **Cleaner Dashboard**: Should show assigned bookings only
4. **Booking Creation**: Should work for all user types
5. **Multiple Bookings**: Users should be able to make multiple bookings

## Support

If you continue to have issues after applying this fix:

1. Check the browser console for error messages
2. Verify your user ID is correct in both role tables
3. Ensure the RLS policies were created successfully
4. Test with a fresh browser session (clear cache/cookies)
