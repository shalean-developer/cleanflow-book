# Quick Troubleshooting Steps for Booking Flow Issue

## Problem
After adding dashboard and auth features, the booking flow stopped loading data from the database.

## ✅ Fixes Already Applied (Code Changes)

1. **Fixed `src/hooks/useAuth.tsx`** - Removed query to non-existent `user_roles` table
2. **Updated `src/integrations/supabase/types.ts`** - Added missing `role` field to profiles and `user_id` to cleaners

## ⚠️ ACTION REQUIRED: Apply Database Migration

**You must run the RLS policies migration in your Supabase database!**

### Quick Method (Copy & Paste)

1. Open your Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Open `supabase/migrations/20251012150000_fix_rls_policies.sql` in your code editor
4. Copy ALL the SQL content
5. Paste into Supabase SQL Editor
6. Click **Run** ▶️
7. Verify you see "Success" message

### Verify Migration Was Applied

Run this quick check in Supabase SQL Editor:

```sql
-- Quick verification query
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'services' 
      AND policyname = 'Services are viewable by everyone'
    ) THEN '✅ Migration Applied'
    ELSE '❌ Migration NOT Applied - Run it now!'
  END as status;
```

## Test the Fix

### Test 1: Anonymous User (Incognito Window)
```
1. Open incognito/private browser window
2. Go to: http://localhost:5173/booking/service/select
3. Services should load without errors
4. Open browser console (F12) - should see no errors
```

**Expected:** Services cards appear, no console errors

### Test 2: Logged In User
```
1. Log in to your account
2. Go to: /dashboard
3. Your bookings should appear
4. Stats should show correct numbers
```

**Expected:** Dashboard loads bookings, stats update correctly

### Test 3: Create New Booking
```
1. Go to: /booking/service/select
2. Select a service
3. Fill in details
4. Complete booking
5. Check dashboard - booking should appear
```

**Expected:** Booking created successfully and visible in dashboard

## Common Errors & Quick Fixes

### Error: "permission denied for table services"
**Meaning:** RLS migration not applied
**Fix:** Run the migration in Supabase SQL Editor (see above)

### Error: Console shows "user_roles table does not exist"
**Meaning:** Using old code, needs restart
**Fix:** 
```bash
# Stop dev server (Ctrl+C)
# Start again
npm run dev
```

### Error: TypeScript errors for `profile.role`
**Meaning:** TypeScript server cache
**Fix:**
- VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Or restart your code editor

### Error: "Cannot read property 'role' of null"
**Meaning:** User profile not created yet
**Fix:** Log out and log back in (trigger profile creation)

## Browser Console Checks

### Good (No Errors)
```
✅ No red errors in console
✅ Network tab shows 200 responses for /services
✅ Services data loaded in React Query DevTools
```

### Bad (Has Errors)
```
❌ "permission denied for table services"
   → Migration not applied
   
❌ "relation user_roles does not exist"
   → Old code still running, restart dev server
   
❌ "Cannot read property 'role' of undefined"
   → TypeScript types need refresh
```

## Step-by-Step First-Time Setup

If this is your first time running the app after these changes:

```bash
# 1. Make sure code changes are applied (already done)
git status  # Should show modified files

# 2. Stop dev server if running
# Press Ctrl+C in terminal

# 3. Restart dev server
npm run dev

# 4. Apply database migration in Supabase
# (Follow "Quick Method" above)

# 5. Clear browser cache (or use incognito)
# Open DevTools (F12) → Application → Clear Storage → Clear site data

# 6. Test the booking flow
# Go to /booking/service/select
```

## Verification Checklist

After applying migration and restarting, verify:

- [ ] Dev server running without errors
- [ ] Browser console shows no errors on booking pages
- [ ] Services load at `/booking/service/select`
- [ ] Extras load at `/booking/service/:slug/details`
- [ ] Cleaners load at `/booking/cleaner`
- [ ] Dashboard shows bookings at `/dashboard` (when logged in)
- [ ] No TypeScript errors in IDE
- [ ] Can complete a booking end-to-end

## Still Having Issues?

### 1. Check Migration Applied
Run in Supabase SQL Editor:
```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('services', 'extras', 'cleaners', 'bookings')
ORDER BY tablename, policyname;
```

You should see policies like:
- `Services are viewable by everyone`
- `Extras are viewable by everyone`
- `Cleaners are viewable by everyone`
- `Users can view their own bookings`

### 2. Check All Users Have Roles
Run in Supabase SQL Editor:
```sql
SELECT u.email, p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
```

All users should have a role value (not NULL).

### 3. Check Browser Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Load `/booking/service/select`
4. Look for request to `/rest/v1/services`
5. Should return 200 status with service data

If it returns:
- **401/403**: RLS policies not applied
- **404**: Table doesn't exist (database issue)
- **500**: Server error (check Supabase logs)

### 4. Check Supabase Logs
1. Go to Supabase Dashboard
2. Navigate to **Logs** → **Postgres Logs**
3. Look for errors around the time you tested
4. Common issues:
   - "permission denied" → RLS not applied
   - "relation does not exist" → Migration not run

## Quick Command Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database Commands (SQL Editor)

```sql
-- Check if migration applied
SELECT * FROM pg_policies WHERE tablename = 'services';

-- Fix missing roles
UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;

-- Create missing profiles
INSERT INTO public.profiles (id, role, created_at, updated_at)
SELECT id, 'customer', now(), now()
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id)
ON CONFLICT (id) DO NOTHING;

-- Test anonymous read
SELECT COUNT(*) FROM public.services;
```

## Support Files

- **Full Details:** `BOOKING_FLOW_FIX_SUMMARY.md`
- **Database Guide:** `DASHBOARD_RLS_FIX.md`
- **Verification Script:** `verify_database_fix.sql`

## TL;DR (Too Long; Didn't Read)

1. ✅ Code is already fixed
2. ⚠️ **You need to run the SQL migration**
3. Open Supabase → SQL Editor
4. Copy & paste: `supabase/migrations/20251012150000_fix_rls_policies.sql`
5. Click Run
6. Restart your dev server: `npm run dev`
7. Test at: `/booking/service/select`

That's it! 🎉

