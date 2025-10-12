# Apply Pricing Management Fix

## Issue
Admin users were unable to save pricing changes to the database because Row Level Security (RLS) policies were missing for INSERT, UPDATE, and DELETE operations on the `services` and `extras` tables.

## Solution
A new migration has been created to enable proper RLS policies that allow:
- **Public users**: Read (SELECT) access to all services and extras
- **Admin users**: Full management (INSERT, UPDATE, DELETE) access to services and extras

## How to Apply the Fix

### Option 1: Using Supabase CLI (Recommended)

If you have Supabase CLI installed:

```bash
# Navigate to your project directory
cd c:\Users\27825\shaleanpro\cleanflow-book

# Apply the migration
npx supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20250112200000_enable_admin_pricing_management.sql`
5. Click **Run** to execute the migration

### Option 3: Direct SQL Execution

If you have direct database access, you can run the SQL file directly:

```bash
psql -h <your-supabase-host> -U postgres -d postgres -f supabase/migrations/20250112200000_enable_admin_pricing_management.sql
```

## What the Migration Does

### For Services Table:
1. ✅ Re-enables RLS
2. ✅ Allows everyone to view services (SELECT)
3. ✅ Allows admins to UPDATE service pricing
4. ✅ Allows admins to INSERT new services
5. ✅ Allows admins to DELETE services

### For Extras Table:
1. ✅ Re-enables RLS
2. ✅ Allows everyone to view extras (SELECT)
3. ✅ Allows admins to UPDATE extras
4. ✅ Allows admins to INSERT new extras
5. ✅ Allows admins to DELETE extras

## Verification

After applying the migration, verify it works:

1. **Sign in as an admin user**
2. **Navigate to Admin Dashboard → Pricing tab**
3. **Try editing a service price**:
   - Click edit on any service
   - Change a price value
   - Click "Save Changes"
   - You should see "Success" toast notification
4. **Try adding a new extra**:
   - Go to Extras tab
   - Click "Add Extra"
   - Fill in the details
   - Click "Create"
   - You should see the new extra in the list

## Enhanced Error Handling

The pricing management components have been updated with:
- Better error messages showing the actual error from the database
- Console logging for debugging
- Permission-related error hints
- Validation before saving

## Troubleshooting

### "Failed to update service pricing. Please ensure you have admin permissions."

**Cause**: Your user account doesn't have the 'admin' role in the profiles table.

**Solution**: 
1. Check your user role:
```sql
SELECT id, role FROM public.profiles WHERE id = auth.uid();
```

2. If you need to make a user an admin:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = '<your-user-id>';
```

### "row-level security policy violation"

**Cause**: The migration hasn't been applied yet.

**Solution**: Apply the migration using one of the methods above.

### Changes don't persist after refresh

**Cause**: Either:
- Migration not applied
- User doesn't have admin role
- Browser caching issue

**Solution**:
1. Apply the migration
2. Verify admin role
3. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for errors

### "Failed to save extra. It may be in use or you may lack permissions."

For deletes, this could mean:
- Extra is referenced by existing bookings (foreign key constraint)
- User lacks admin permissions

## Testing Checklist

After applying the fix, test:

- [ ] Admin can edit service base price
- [ ] Admin can edit bedroom price
- [ ] Admin can edit bathroom price
- [ ] Admin can edit service fee rate
- [ ] Admin can create new extras
- [ ] Admin can edit existing extras
- [ ] Admin can delete extras (that aren't in use)
- [ ] Admin can toggle extra active status
- [ ] Changes persist after page refresh
- [ ] Non-admin users still cannot modify pricing
- [ ] Public users can still view services and extras

## Files Modified

### New Files:
- `supabase/migrations/20250112200000_enable_admin_pricing_management.sql` - RLS policies migration

### Updated Files:
- `src/components/dashboard/admin/AdminServicesPricing.tsx` - Better error handling
- `src/components/dashboard/admin/AdminExtrasPricing.tsx` - Better error handling

## Support

If you continue to have issues:
1. Check the browser console for errors
2. Check the Supabase logs in your dashboard
3. Verify your user has admin role
4. Ensure the migration was applied successfully

