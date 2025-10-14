# Booking Flow Data Fetching Fix

## Issues Identified and Fixed

### 1. Missing Imports in Quote.tsx ✅
**Problem:** The `Quote.tsx` file was using `useQuery` and `LucideIcons` without importing them.

**Fixed:**
- Added `import { useQuery } from '@tanstack/react-query';`
- Added `import * as LucideIcons from 'lucide-react';`
- Added `Sparkles` to the lucide-react imports

### 2. Row Level Security (RLS) Policies ⚠️
**Problem:** The booking flow couldn't fetch data from the database due to conflicting or missing RLS policies on the `services`, `extras`, and `cleaners` tables.

**Root Cause:**
- Multiple migrations created conflicting policies
- Some migrations disabled RLS entirely
- Some policies only allowed access to authenticated users, blocking anonymous booking flow access

**Solution:** Created a comprehensive SQL fix that:
1. Removes all conflicting policies
2. Re-enables RLS on all necessary tables
3. Creates new policies allowing public read access (including anonymous users)
4. Maintains admin-only write/update/delete permissions

## How to Apply the Fix

### Step 1: Run the SQL Script
Open your Supabase Dashboard → SQL Editor and run the `FIX_BOOKING_FLOW_RLS.sql` script.

Alternatively, if you have the Supabase CLI linked, you can apply the migration:
```bash
cd supabase
npx supabase db push
```

### Step 2: Verify the Fix
After running the SQL script, test the verification queries included at the end of the script to ensure:
- Services can be fetched
- Extras can be fetched
- Cleaners can be fetched

### Step 3: Test the Booking Flow
1. Navigate to your booking flow in the browser
2. Ensure you're not logged in (anonymous user)
3. Try selecting a service
4. Check that extras are loaded
5. Verify that the booking summary displays correctly

## Files Modified

### Code Files
- `src/pages/booking/Quote.tsx` - Added missing imports

### Migration Files
- `supabase/migrations/20250115140000_fix_booking_flow_data_fetching.sql` - New migration with comprehensive RLS fix

### Documentation Files
- `FIX_BOOKING_FLOW_RLS.sql` - Standalone SQL script that can be run directly in Supabase SQL Editor
- `BOOKING_FLOW_FIX_README.md` - This file

## Technical Details

### RLS Policies Created

#### Services Table
- **SELECT**: Everyone (including anonymous users) can view all services
- **UPDATE/INSERT/DELETE**: Only admins can modify services

#### Extras Table
- **SELECT**: Everyone (including anonymous users) can view all extras
- **UPDATE/INSERT/DELETE**: Only admins can modify extras

#### Cleaners Table
- **SELECT**: Everyone (including anonymous users) can view all cleaners
- **UPDATE/INSERT/DELETE**: Only admins can modify cleaners (where applicable)

### Why This Works
By using `TO public` in the policy definition, we explicitly allow both:
- Authenticated users (`authenticated` role)
- Anonymous users (`anon` role)

This is essential for the booking flow, which needs to fetch data before users sign in.

## Testing Checklist

- [x] Code imports fixed
- [ ] SQL migration applied
- [ ] Services data fetches successfully
- [ ] Extras data fetches successfully
- [ ] Cleaners data fetches successfully
- [ ] Booking flow works for anonymous users
- [ ] Admin can still manage pricing (services/extras)

## Next Steps

If you encounter any issues after applying this fix:

1. Check browser console for errors
2. Verify RLS policies are active in Supabase Dashboard
3. Test with an anonymous browser session
4. Check network tab to see if API calls are returning 403 errors

## Support

If the issue persists, check:
- Supabase project settings → API → API URL and Keys
- Browser network tab for specific error messages
- Supabase Dashboard → Database → Policies tab

