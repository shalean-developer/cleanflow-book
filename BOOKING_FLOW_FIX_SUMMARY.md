# Booking Flow Data Loading Fix

## Issues Found and Fixed

After adding dashboard and authentication features, the booking flow stopped loading data from the database. Three critical issues were identified and fixed:

### Issue 1: ❌ Wrong Table Query in useAuth Hook
**Problem:** The `useAuth.tsx` hook was trying to fetch user roles from a non-existent `user_roles` table.

**Location:** `src/hooks/useAuth.tsx` (lines 46-51)

**What was wrong:**
```typescript
// ❌ BEFORE - Querying non-existent table
const { data: roleData, error: roleError } = await supabase
  .from('user_roles')  // This table doesn't exist!
  .select('role')
  .eq('user_id', userId)
  .single();
```

**Fix Applied:** ✅
The role is stored directly in the `profiles` table, not a separate table. Updated the code to:
```typescript
// ✅ AFTER - Getting role from profiles table
const { data: profileData, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

if (!profileError && profileData) {
  setProfile(profileData);
  setUserRole((profileData.role as UserRole) || 'customer');
}
```

---

### Issue 2: ❌ Missing TypeScript Types
**Problem:** The TypeScript type definitions were outdated and missing new database columns added by migrations.

**Location:** `src/integrations/supabase/types.ts`

**Missing fields:**
1. `profiles.role` - The role column for user access control
2. `cleaners.user_id` - Link between cleaners and auth users

**Fix Applied:** ✅
Updated the TypeScript types to include:
- Added `role: string | null` to `profiles` table definition (Row, Insert, Update)
- Added `user_id: string | null` to `cleaners` table definition (Row, Insert, Update)

---

### Issue 3: ⚠️ Database RLS Policies Need Verification
**Problem:** Row Level Security (RLS) policies may not be properly configured for public access to booking data.

**What this affects:**
- Services list not loading for anonymous users
- Extras list not loading
- Cleaners list not loading
- Bookings not visible to customers in dashboard

**Migration file:** `supabase/migrations/20251012150000_fix_rls_policies.sql`

**What the migration does:**
1. ✅ Ensures all auth users have profiles with default `customer` role
2. ✅ Backfills missing roles for existing users
3. ✅ Creates public read policies for `services`, `extras`, and `cleaners` tables
4. ✅ Creates user-specific policies for `bookings` and `profiles` tables
5. ✅ Updates the `handle_new_user()` trigger to set role on signup

---

## How to Apply the Complete Fix

### Step 1: Code Changes (Already Applied ✅)
The code changes have been applied:
- ✅ Fixed `src/hooks/useAuth.tsx`
- ✅ Updated `src/integrations/supabase/types.ts`

### Step 2: Apply Database Migration

You MUST apply the RLS policies migration to your Supabase database. Choose one method:

#### Option A: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20251012150000_fix_rls_policies.sql`
5. Paste into the query editor
6. Click **Run** to execute
7. Verify no errors appear in the output

#### Option B: Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to project directory
cd cleanflow-book

# Apply all pending migrations
supabase db push

# Or apply this specific migration
supabase db remote commit pull
```

---

## Verification Steps

After applying the fixes, verify everything works:

### 1. Test Anonymous Booking Flow (Not Logged In)
```
✅ Open in incognito/private browser
✅ Go to /booking/service/select
✅ Verify services load
✅ Click on a service - should proceed to details page
✅ Verify cleaners are visible in cleaner selection
```

### 2. Test Authenticated Booking
```
✅ Log in or sign up
✅ Complete a booking
✅ Verify booking is created successfully
✅ Go to /dashboard
✅ Verify your booking appears in the dashboard
```

### 3. Database Console Verification

Run these queries in Supabase SQL Editor:

```sql
-- Check all users have profiles with roles
SELECT u.email, p.role, p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
-- Expected: All users should have a role (customer, admin, or cleaner)

-- Check RLS policy on services
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'services';
-- Expected: Should see "Services are viewable by everyone" with USING (true)

-- Test service query as anonymous (should work)
SELECT COUNT(*) FROM public.services;
-- Expected: Should return count without permission errors
```

---

## What Each Fix Solves

| Fix | What It Solves |
|-----|----------------|
| useAuth.tsx update | ✅ Auth context loads correctly<br>✅ User roles are properly fetched<br>✅ No more query errors on login |
| TypeScript types update | ✅ Type safety for role field<br>✅ IDE autocomplete works<br>✅ No TypeScript errors |
| RLS migration | ✅ Services/extras/cleaners load for everyone<br>✅ Bookings visible to users<br>✅ Dashboard shows data correctly |

---

## Common Errors and Solutions

### Error: "permission denied for table services"
**Cause:** RLS policies not applied
**Solution:** Run the migration in Supabase SQL Editor

### Error: "null value in column role violates not-null constraint"
**Cause:** User created after role column added but before trigger updated
**Solution:** Run in SQL Editor:
```sql
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;
```

### Error: Still seeing TypeScript errors for `profile.role`
**Cause:** TypeScript server needs restart
**Solution:** 
1. In VS Code: Press `Ctrl+Shift+P`
2. Type: "TypeScript: Restart TS Server"
3. Press Enter

### Error: Customer dashboard shows no bookings
**Cause:** User ID mismatch or RLS policy issue
**Solution:** Check in SQL Editor:
```sql
-- Replace with your email
SELECT b.id, b.reference, b.user_id, u.email 
FROM public.bookings b
LEFT JOIN auth.users u ON b.user_id = u.id
WHERE u.email = 'your-email@example.com';
```

---

## Testing Checklist

After applying all fixes, test these scenarios:

- [ ] Anonymous user can view services at `/booking/service/select`
- [ ] Anonymous user can view service details
- [ ] Anonymous user can view cleaners
- [ ] Logged-in user can create bookings
- [ ] Customer can view their bookings in `/dashboard`
- [ ] Customer can update their profile in dashboard settings
- [ ] No console errors when loading booking pages
- [ ] No TypeScript errors in IDE

---

## Summary

**Root Cause:** The dashboard implementation added role-based access control but:
1. The auth hook was querying the wrong table for roles
2. TypeScript types were not updated after database migrations
3. RLS policies need to be applied to allow public access to services

**Resolution:** 
1. ✅ Fixed the auth hook to query `profiles` table
2. ✅ Updated TypeScript types for `profiles.role` and `cleaners.user_id`
3. ⚠️ **ACTION REQUIRED:** Apply the RLS migration to Supabase database

**Status:** Code fixes complete. Database migration must be applied by you.

---

## Need Help?

If you're still experiencing issues:

1. Check browser console for specific error messages (F12)
2. Check Supabase logs in the dashboard
3. Verify the migration was applied successfully
4. Run the verification SQL queries above
5. Review the detailed fix guide: `DASHBOARD_RLS_FIX.md`

