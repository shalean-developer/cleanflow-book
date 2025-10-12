# Short Prompt for Lovable (Concise Version)

## Copy this if you prefer a shorter prompt:

---

**Issue:** After implementing role-based dashboards, data is not loading from the database:
- Booking form can't fetch services/extras/cleaners on `/booking/service/select`
- Customer dashboard at `/dashboard` shows no bookings (even though they exist)
- RLS policies are blocking data access because users don't have roles assigned

**Fix Ready:** I have a migration file `supabase/migrations/20251012150000_fix_rls_policies.sql` that:
1. Backfills all user profiles with 'customer' role
2. Fixes RLS policies to allow public read access for services/extras/cleaners
3. Ensures users can access their own bookings

**What I Need:**

1. **Apply this migration to Supabase database** - Use the most appropriate method (CLI, dashboard, or guide me)

2. **Verify it worked:**
   - Test that services load on `/booking/service/select` (not logged in)
   - Test that bookings load on `/dashboard` (logged in)
   - Check browser console for any RLS permission errors

3. **Troubleshoot if still failing:**
   - Check Supabase logs for RLS policy violations
   - Verify all users have profiles with roles: 
     ```sql
     SELECT COUNT(*) FROM auth.users u
     LEFT JOIN profiles p ON u.id = p.id  
     WHERE p.role IS NULL;
     ```
     Should return 0
   - Check that public read policies exist for services, extras, cleaners tables

4. **Report status** - Let me know if data loads correctly or share any remaining errors

**Key files:**
- Migration: `supabase/migrations/20251012150000_fix_rls_policies.sql`
- Frontend: `src/pages/booking/ServiceSelect.tsx`, `src/pages/dashboard/CustomerDashboard.tsx`
- Related docs: `DASHBOARD_RLS_FIX.md`, `QUICK_FIX_STEPS.md`

**Expected outcome:** All pages fetch data correctly, no RLS permission errors.

---

