# Lovable to Supabase Migration - Complete Guide

## Overview
This migration removes Lovable Cloud dependencies and makes Supabase the single source of truth for authentication and database operations.

## What Changed

### 1. Auth Loading Fix (Critical)
**File:** `src/hooks/useAuth.tsx`

**Problem:** Profile fetching was blocking the auth loading state, causing infinite loading loops on page refresh.

**Solution:** Made profile fetching non-blocking by removing `await` on line 102. The auth loading state now ends immediately when the session is restored, while profile data loads in the background.

```tsx
// Before: Blocking
if (currentSession?.user) {
  await fetchProfile(currentSession.user.id);
}

// After: Non-blocking
if (currentSession?.user) {
  // Fire-and-forget: don't block auth loading on profile fetch
  fetchProfile(currentSession.user.id);
}
```

### 2. New Files Created

#### `src/lib/supabase.ts`
Re-exports the Supabase client for consistency across the codebase.

#### `src/lib/api.ts`
Authenticated API wrapper with automatic token refresh on 401 errors. Use this for external API calls that require authentication:

```typescript
import { apiFetch } from '@/lib/api';

const response = await apiFetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

#### `supabase/migrations/20241014000000_profiles_with_rls.sql`
Database migration that:
- Creates `profiles` table with RLS policies
- Sets up automatic profile creation trigger for new users
- Backfills profiles for existing users
- Ensures every user defaults to 'customer' role

### 3. Existing Files (Already Properly Configured)

#### `src/integrations/supabase/client.ts`
- Already configured with PKCE flow
- Session persistence enabled
- Auto-refresh enabled
- Custom storage wrapper for error handling

#### `src/hooks/useAuth.tsx`
- AuthProvider with proper session restoration
- 2-second failsafe timeout to prevent infinite loading
- Role-based access control (isAdmin, isCleaner, isCustomer)

#### `src/components/ProtectedRoute.tsx`
- Respects auth loading state
- Redirects unauthenticated users
- Role-based access control (requireAdmin, requireCleaner)

#### `src/hooks/useProfile.ts`
- Non-blocking profile loader
- Falls back to default profile if none exists
- Prevents UI blocking

#### `vercel.json`
- Already redirects www to apex domain
- SPA routing configured

## Database Setup

### Apply the Migration

1. **Via Supabase Dashboard:**
   - Go to SQL Editor
   - Paste the contents of `supabase/migrations/20241014000000_profiles_with_rls.sql`
   - Click "Run"

2. **Via Supabase CLI:**
   ```bash
   supabase db push
   ```

### Verify the Migration

Run this query in the SQL Editor:

```sql
-- Check if profiles table exists and has RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- Check if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check if all users have profiles
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM public.profiles;
-- These counts should match
```

## Environment Variables

Ensure these are set in your `.env` file and Vercel environment:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: The client uses `VITE_SUPABASE_PUBLISHABLE_KEY` which should be set to the same value as `VITE_SUPABASE_ANON_KEY`.

## Testing Checklist

### 1. Basic Auth Flow
- [ ] Login with email/password works
- [ ] Signup with email/password works
- [ ] Magic link login works
- [ ] Logout works

### 2. Session Persistence
- [ ] Login → Close tab → Reopen → Still logged in
- [ ] Login → Refresh page → Still logged in (no loading loop)
- [ ] Profile data loads without blocking UI
- [ ] Role is correctly assigned and persists

### 3. Protected Routes
- [ ] `/dashboard` accessible when logged in
- [ ] `/dashboard` redirects to home when not logged in
- [ ] `/dashboard/admin` only accessible to admin users
- [ ] `/dashboard/cleaner` only accessible to cleaner users
- [ ] Access denied message shows for wrong role

### 4. Paystack Integration
- [ ] After payment, session persists
- [ ] Redirected back to dashboard after payment
- [ ] No need to clear cookies after payment

### 5. Cross-Domain (if applicable)
- [ ] www.shalean.co.za redirects to shalean.co.za
- [ ] No duplicate sessions between domains
- [ ] Auth works consistently on apex domain

## Deployment

### 1. Deploy Database Migration
```bash
# Apply migration to production
supabase db push --db-url "postgresql://..."
```

### 2. Deploy Frontend
```bash
git add .
git commit -m "feat: migrate from Lovable to Supabase auth"
git push origin migrate/lovable-to-supabase-auth

# Create PR and merge to main
# Vercel will auto-deploy
```

### 3. Post-Deployment Checks
1. Clear browser cache and cookies
2. Test login flow
3. Test page refresh
4. Test protected routes
5. Monitor Supabase logs for any errors

## Troubleshooting

### Issue: Still getting "Auth Loading" loop
**Solution:**
1. Clear browser localStorage: `localStorage.clear()`
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check browser console for errors

### Issue: "No role in profile"
**Solution:**
1. Verify migration was applied: Check profiles table exists
2. Verify trigger is working: Insert a test user in auth.users
3. Manually backfill: Run the backfill query from migration
4. Default role should fall back to 'customer' even if profile doesn't exist

### Issue: 401 errors after login
**Solution:**
1. Verify `VITE_SUPABASE_ANON_KEY` is correct
2. Check Supabase RLS policies are enabled
3. Use `apiFetch` from `src/lib/api.ts` for external API calls

### Issue: Access denied on admin pages
**Solution:**
1. Check user role in database:
   ```sql
   SELECT u.email, p.role 
   FROM auth.users u 
   LEFT JOIN profiles p ON u.id = p.id 
   WHERE u.email = 'your@email.com';
   ```
2. Update role if needed:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'user_id';
   ```

## Rollback Plan

If issues arise, you can rollback:

1. **Git Rollback:**
   ```bash
   git checkout main
   git revert HEAD
   git push
   ```

2. **Database Rollback:**
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   DROP FUNCTION IF EXISTS handle_new_user();
   -- Profiles table can remain as it doesn't break anything
   ```

## Architecture Notes

### Session Restoration Flow
1. App loads → AuthProvider mounts
2. `onAuthStateChange` listener set up
3. `getSession()` called to restore session from localStorage
4. `INITIAL_SESSION` event fires → loading set to false
5. Profile fetched in background (non-blocking)
6. UI renders immediately with session, profile loads shortly after

### Role Loading Flow
1. User logs in → session created
2. Profile query attempts to fetch role from `user_roles` table
3. Falls back to `profiles.role` if `user_roles` doesn't exist
4. Defaults to 'customer' if both fail
5. Role state updated → UI reflects permissions

### Protected Route Flow
1. Component renders
2. ProtectedRoute checks `loading` state
3. If loading → Show spinner
4. If not loading && no user → Redirect to home
5. If user but wrong role → Show access denied
6. If user with correct role → Render children

## Benefits of This Migration

1. **Single Source of Truth:** All auth goes through Supabase
2. **No More Loading Loops:** Profile loading doesn't block auth
3. **Better Performance:** Non-blocking profile fetch
4. **Consistent Sessions:** No more cookie/storage clearing needed
5. **Proper RLS:** Database-level security with Row Level Security
6. **Auto Profile Creation:** Every user gets a profile automatically
7. **Better Error Handling:** Safe storage wrapper prevents corruption
8. **Token Refresh:** Automatic 401 handling with `apiFetch`

## Next Steps

1. Monitor production logs for any auth errors
2. Consider adding refresh token rotation
3. Add password reset functionality
4. Add email change functionality
5. Add multi-factor authentication (MFA)
6. Consider adding OAuth providers (Google, GitHub, etc.)

## Support

For issues or questions:
- Check Supabase logs: Dashboard → Logs → Auth
- Check browser console: F12 → Console
- Review this document's troubleshooting section
- Contact the development team

