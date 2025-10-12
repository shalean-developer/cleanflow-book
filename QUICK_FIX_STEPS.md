# Quick Fix for Dashboard Data Fetching Issues

## Problem
- Booking form cannot fetch services/extras/cleaners
- Customer dashboard cannot fetch bookings

## Cause
Row Level Security (RLS) policies are preventing data access because:
1. Existing users don't have roles in their profiles
2. Public read policies may be misconfigured

## Quick Fix Steps

### Step 1: Apply the Migration

**Using Supabase Dashboard (Easiest):**

1. Open your Supabase project at https://supabase.com/dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New query**
4. Open the file: `supabase/migrations/20251012150000_fix_rls_policies.sql`
5. Copy and paste the entire contents into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success" message

### Step 2: Verify the Fix

Open your browser console (F12) and test:

1. **Test Booking Form (not logged in):**
   - Go to `/booking/service/select`
   - You should see services load
   
2. **Test Customer Dashboard (logged in):**
   - Log in to your account
   - Go to `/dashboard`
   - You should see your bookings

### Step 3: If Still Not Working

Run this SQL in Supabase SQL Editor:

```sql
-- Check if users have profiles with roles
SELECT COUNT(*) as users_without_roles 
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.role IS NULL OR p.id IS NULL;
```

If the result is > 0, run:

```sql
-- Manually fix missing profiles
INSERT INTO public.profiles (id, role, created_at, updated_at)
SELECT id, 'customer'::text, now(), now()
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id)
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;
```

## Still Having Issues?

1. Check browser console for errors (F12 → Console tab)
2. Check Supabase logs (Dashboard → Logs)
3. See the full guide: `DASHBOARD_RLS_FIX.md`

## Create Admin User (Optional)

To access the admin dashboard:

```sql
-- Replace 'your-email@example.com' with your email
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

Then navigate to `/dashboard/admin`

