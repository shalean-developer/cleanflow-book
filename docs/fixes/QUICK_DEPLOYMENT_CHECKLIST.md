# Quick Deployment Checklist

## Pre-Deployment

- [x] Git branch created: `migrate/lovable-to-supabase-auth`
- [x] Auth loading made non-blocking
- [x] API wrapper with 401 refresh created
- [x] Database migration prepared
- [x] Documentation written

## Deploy Steps (5 minutes)

### 1. Apply Database Migration (2 min)
```bash
# Option A: Via Supabase Dashboard
# 1. Open Supabase Dashboard → SQL Editor
# 2. Paste contents of: supabase/migrations/20241014000000_profiles_with_rls.sql
# 3. Click "Run"

# Option B: Via CLI
supabase db push
```

Verify:
```sql
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM public.profiles;
-- Counts should match
```

### 2. Deploy Code (2 min)
```bash
# Review changes
git status
git diff src/hooks/useAuth.tsx

# Stage and commit
git add .
git commit -m "fix: make profile loading non-blocking to prevent auth loops

- Remove await from fetchProfile call in onAuthStateChange
- Profile now loads in background without blocking auth state
- Add API wrapper with automatic token refresh on 401
- Add profiles migration with RLS and auto-creation trigger
- Add comprehensive migration documentation

Fixes: Auth loading loop after page refresh"

# Push to remote
git push origin migrate/lovable-to-supabase-auth
```

### 3. Create Pull Request (1 min)
- Go to GitHub/GitLab
- Create PR from `migrate/lovable-to-supabase-auth` to `main`
- Title: "Fix: Make Supabase single source of truth for auth"
- Link to: `LOVABLE_TO_SUPABASE_MIGRATION.md`
- Request review

### 4. Merge & Deploy
- Once approved, merge to main
- Vercel auto-deploys
- Monitor deployment logs

## Post-Deployment Testing (5 minutes)

### Test in Production

1. **Clear Cache** (important!)
   ```
   Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   → Clear cookies and cache
   → Close browser
   → Reopen
   ```

2. **Test Login Flow**
   - [ ] Go to shalean.co.za
   - [ ] Click Login
   - [ ] Sign in with test account
   - [ ] Verify dashboard loads immediately
   - [ ] No "Auth Loading" stuck state

3. **Test Page Refresh**
   - [ ] While logged in, press F5 to refresh
   - [ ] Dashboard should load immediately
   - [ ] No infinite loading spinner
   - [ ] Profile/role loads within 1 second

4. **Test Protected Routes**
   - [ ] Access `/dashboard` → Should work when logged in
   - [ ] Access `/dashboard/admin` → Should check role
   - [ ] Logout → Try accessing `/dashboard` → Should redirect

5. **Test Paystack Flow**
   - [ ] Create a booking
   - [ ] Go through payment
   - [ ] After payment callback → Should stay logged in
   - [ ] Dashboard should load without clearing cookies

## Rollback (if needed)

If critical issues arise:

```bash
# Revert code changes
git revert HEAD
git push origin main

# Database stays as-is (migration is additive, safe to keep)
```

## Success Criteria

✅ No more "Auth Loading: Yes / No role in profile" loops
✅ Page refresh maintains logged-in state
✅ Profile/role loads without blocking UI
✅ Protected routes work correctly
✅ Paystack callbacks don't break sessions

## Monitoring

Watch for these in production:
- Supabase Dashboard → Auth Logs
- Vercel Dashboard → Function Logs  
- Browser Console → No auth errors
- User reports → No login complaints

## Support

If issues occur:
1. Check `LOVABLE_TO_SUPABASE_MIGRATION.md` troubleshooting section
2. Review Supabase auth logs
3. Check browser console for errors
4. Verify environment variables are set
5. Test in incognito mode

## Files Changed

- `src/hooks/useAuth.tsx` - Made profile loading non-blocking
- `src/lib/supabase.ts` - NEW: Supabase client export
- `src/lib/api.ts` - NEW: API wrapper with 401 refresh
- `supabase/migrations/20241014000000_profiles_with_rls.sql` - NEW: Profiles migration
- `LOVABLE_TO_SUPABASE_MIGRATION.md` - NEW: Full documentation
- `QUICK_DEPLOYMENT_CHECKLIST.md` - NEW: This file

## Timeline

- Pre-deployment prep: ✅ Done
- Database migration: ⏱️ 2 minutes
- Code deployment: ⏱️ 3 minutes
- Testing: ⏱️ 5 minutes
- **Total: ~10 minutes**

Good luck! 🚀

