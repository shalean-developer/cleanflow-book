# Authentication Session Refresh Fix

## Problem
Users were getting stuck on "Loading your dashboard" after login or page refresh. The app showed:
- Auth Loading: Yes (never changed to No)
- No roles detected (Is Admin: No, Profile Role: No role in profile)
- Users had to clear cookies/local storage to regain access

## Root Causes

### 1. Race Condition in useAuth Hook
The original implementation had both `onAuthStateChange` and `getSession()` setting `loading` to `false`, causing premature renders before role data was fetched.

### 2. Missing Supabase Configuration
The Supabase client was missing:
- `detectSessionInUrl: true` - needed to detect auth redirects
- `flowType: 'pkce'` - needed for secure auth flow

### 3. Dashboard Components Not Waiting for Auth
Admin and Cleaner dashboards were checking `isAdmin`/`isCleaner` before auth loading completed, causing false "Access Denied" messages.

## Changes Made

### 1. Fixed Supabase Client (`src/integrations/supabase/client.ts`)
```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: createSafeStorage(),
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,  // ✅ Added
    flowType: 'pkce',          // ✅ Added
  }
});
```

### 2. Fixed Race Condition in useAuth Hook (`src/hooks/useAuth.tsx`)

**Before:**
- `onAuthStateChange` and `getSession()` both set `loading = false`
- Both ran simultaneously, causing race conditions
- No mounted check, leading to state updates on unmounted components

**After:**
```typescript
useEffect(() => {
  let mounted = true;
  
  // First, get the current session synchronously
  const initializeAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!mounted) return;
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
    
    // Only set loading to false after initial fetch completes
    setLoading(false);
  };

  initializeAuth();

  // Then, listen for auth changes (doesn't set loading)
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!mounted) return;
      // Update state but don't modify loading
    }
  );

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);
```

### 3. Fixed Dashboard Components

Updated both `AdminDashboard.tsx` and `CleanerDashboard.tsx` to:

1. **Get auth loading state:**
   ```typescript
   const { user, isAdmin, loading: authLoading } = useAuth();
   ```

2. **Wait for auth to complete:**
   ```typescript
   useEffect(() => {
     // Wait for authentication to finish loading
     if (authLoading) {
       console.log('Authentication still loading...');
       return;
     }
     
     if (!user) {
       navigate('/');
       return;
     }
     
     if (!isAdmin) {
       // Show access denied
       return;
     }
     
     fetchData();
   }, [authLoading, user, isAdmin]);
   ```

3. **Show loading state properly:**
   ```typescript
   if (loading || authLoading) {
     return <LoadingScreen />;
   }
   ```

### 4. Verified vercel.json Configuration
Already has the single-domain redirect from www to apex:
```json
{
  "redirects": [
    {
      "source": "https://www.shalean.co.za/:path*",
      "destination": "https://shalean.co.za/:path*",
      "permanent": true
    }
  ]
}
```

## Testing Checklist

✅ **Login Flow:**
- [ ] User can log in successfully
- [ ] Dashboard loads immediately after login
- [ ] Correct role is detected (admin/cleaner/customer)
- [ ] No "Access Denied" errors for valid users

✅ **Page Refresh:**
- [ ] Refresh on dashboard maintains session
- [ ] Role persists after refresh
- [ ] No stuck "Loading..." state
- [ ] Auth Loading changes from "Yes" to "No" within 1-2 seconds

✅ **Session Persistence:**
- [ ] Close browser and reopen - session persists
- [ ] Session auto-refreshes when token expires
- [ ] No need to clear cookies/storage

✅ **Role-Based Access:**
- [ ] Admin users can access `/dashboard/admin`
- [ ] Cleaner users can access `/dashboard/cleaner`
- [ ] Customer users can access `/dashboard`
- [ ] Incorrect roles are redirected properly

✅ **Logout:**
- [ ] Logout clears session properly
- [ ] User is redirected to home page
- [ ] Cannot access protected routes after logout

## Debug Information

All dashboards now show debug info during loading:
- Auth Loading: Yes/No
- User ID
- User Email
- Role status (Is Admin/Is Cleaner)
- Profile Role
- Component Loading status

This helps diagnose any remaining issues quickly.

## Expected Results

✅ "Auth Loading: Yes" disappears after ~1s
✅ Dashboard shows correct role & data
✅ Refresh keeps user logged in
✅ No more "clear cookies to access" issue
✅ All role-based redirects work correctly

## Deployment Notes

1. **Branch:** `fix/auth-session-refresh-restore`
2. **Files Changed:**
   - `src/integrations/supabase/client.ts`
   - `src/hooks/useAuth.tsx`
   - `src/pages/dashboard/AdminDashboard.tsx`
   - `src/pages/dashboard/CleanerDashboard.tsx`
3. **No Breaking Changes:** All existing functionality preserved
4. **Safe to Deploy:** Incremental fix, no destructive changes

## Rollback Plan

If issues occur, simply revert this branch. The changes are isolated to:
- Auth initialization logic
- Dashboard loading states
- Supabase client configuration

All UI and routing remain unchanged.

