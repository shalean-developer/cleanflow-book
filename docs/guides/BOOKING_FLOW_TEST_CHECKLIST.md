# Booking Flow Testing Checklist

## Pre-Test Setup

### 1. Apply the SQL Fix
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Run the `FIX_BOOKING_FLOW_RLS.sql` script
- [ ] Verify the script completed without errors
- [ ] Check that verification queries return data

### 2. Restart Development Server
```bash
npm run dev
# or
yarn dev
```

## Test Scenarios

### Test 1: Anonymous User (Not Logged In)
**Purpose:** Verify that booking flow works for users who haven't signed in yet

#### Steps:
1. [ ] Open browser in incognito/private mode
2. [ ] Navigate to the booking page
3. [ ] Select a service (e.g., Standard Cleaning)
4. [ ] Verify service card displays with correct pricing
5. [ ] Click "Book Now" or similar button
6. [ ] Navigate to Details page
7. [ ] Verify extras are loaded and displayed
8. [ ] Select bedrooms and bathrooms
9. [ ] Select some extras
10. [ ] Verify booking summary updates with correct pricing
11. [ ] Continue to schedule page
12. [ ] Verify no console errors

**Expected Result:** ✅ All data loads correctly, no 403 errors in network tab

### Test 2: Authenticated User
**Purpose:** Verify booking flow works for logged-in users

#### Steps:
1. [ ] Log in to the application
2. [ ] Navigate to booking flow
3. [ ] Complete the booking process
4. [ ] Verify all data loads correctly
5. [ ] Check that user info is pre-filled where applicable

**Expected Result:** ✅ Booking flow works seamlessly

### Test 3: Quote Page
**Purpose:** Verify the Quote page data fetching works

#### Steps:
1. [ ] Navigate to `/quote` or quote page
2. [ ] Check browser console for errors
3. [ ] Verify extras are loaded
4. [ ] Select some extras
5. [ ] Verify extras display correctly
6. [ ] Fill out the form
7. [ ] Submit the quote request

**Expected Result:** ✅ No import errors, extras load correctly

### Test 4: Review Page
**Purpose:** Verify order summary displays correctly

#### Steps:
1. [ ] Complete booking flow up to review page
2. [ ] Verify service information displays
3. [ ] Verify extras information displays
4. [ ] Verify pricing breakdown is correct
5. [ ] Check that all booking details are shown

**Expected Result:** ✅ All data displays correctly

### Test 5: Sticky Summary
**Purpose:** Verify the sticky summary component updates

#### Steps:
1. [ ] Start a booking flow
2. [ ] Watch the sticky summary on the right side
3. [ ] Change bedrooms/bathrooms
4. [ ] Add/remove extras
5. [ ] Verify summary updates in real-time
6. [ ] Check pricing calculations

**Expected Result:** ✅ Summary updates dynamically with accurate pricing

## Browser Console Checks

Open browser console (F12) and check for:

### Red Flags (Should NOT see these):
- [ ] ❌ "Failed to fetch"
- [ ] ❌ 403 Forbidden errors in Network tab
- [ ] ❌ "useQuery is not defined"
- [ ] ❌ "LucideIcons is not defined"
- [ ] ❌ RLS policy errors
- [ ] ❌ "Cannot read property 'base_price'"

### Green Flags (SHOULD see these):
- [ ] ✅ Successful API calls to Supabase in Network tab
- [ ] ✅ Services data loaded
- [ ] ✅ Extras data loaded
- [ ] ✅ No TypeScript/import errors

## Network Tab Checks

### 1. Open Network Tab (F12 → Network)
- [ ] Filter by "Fetch/XHR"
- [ ] Look for Supabase API calls

### 2. Check Services Request
- [ ] Request to `...supabase.co/rest/v1/services...`
- [ ] Status: 200 OK
- [ ] Response contains services array

### 3. Check Extras Request
- [ ] Request to `...supabase.co/rest/v1/extras...`
- [ ] Status: 200 OK
- [ ] Response contains extras array

### 4. Check Cleaners Request (if applicable)
- [ ] Request to `...supabase.co/rest/v1/cleaners...`
- [ ] Status: 200 OK
- [ ] Response contains cleaners array

## Database Verification

### Via Supabase Dashboard
1. [ ] Go to Supabase Dashboard → Table Editor
2. [ ] Check `services` table has data
3. [ ] Check `extras` table has data
4. [ ] Check `cleaners` table has data

### Via SQL
Run these queries in Supabase SQL Editor:

```sql
-- Count services
SELECT COUNT(*) as service_count FROM public.services WHERE active = true;

-- Count extras
SELECT COUNT(*) as extras_count FROM public.extras WHERE active = true;

-- Count cleaners
SELECT COUNT(*) as cleaners_count FROM public.cleaners WHERE active = true;

-- Check sample data
SELECT id, name, base_price FROM public.services LIMIT 3;
SELECT id, name, base_price FROM public.extras LIMIT 3;
```

Expected:
- [ ] At least 1 service exists
- [ ] At least 1 extra exists
- [ ] Sample data returns results

## RLS Policy Verification

Run in Supabase SQL Editor:

```sql
-- Check services policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'services'
ORDER BY policyname;

-- Check extras policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'extras'
ORDER BY policyname;
```

Expected:
- [ ] "Everyone can view all services" policy exists
- [ ] "Everyone can view all extras" policy exists
- [ ] Admin policies exist for UPDATE/INSERT/DELETE

## Common Issues & Solutions

### Issue: "useQuery is not defined"
**Solution:** Already fixed in Quote.tsx. Restart dev server.

### Issue: Data not loading (403 errors)
**Solution:** Run `FIX_BOOKING_FLOW_RLS.sql` in Supabase

### Issue: "Cannot read property 'base_price' of undefined"
**Solution:** Ensure services/extras have base_price field populated

### Issue: Pricing shows NaN
**Solution:** Check that base_price values are valid numbers, not null

### Issue: Components render but data is empty
**Solution:** 
1. Check Network tab for failed requests
2. Verify RLS policies are correct
3. Check that tables have data

## Performance Checks

- [ ] Pages load within 2-3 seconds
- [ ] No infinite re-renders
- [ ] React Query caching works (subsequent visits are faster)
- [ ] No memory leaks in console

## Success Criteria

### All Tests Pass ✅
- [ ] Anonymous users can browse booking flow
- [ ] All data fetches successfully
- [ ] No console errors
- [ ] No network errors (403, 404, 500)
- [ ] Pricing calculations are correct
- [ ] UI updates in real-time
- [ ] Forms submit successfully

## If Tests Fail

1. **Check Console First**
   - Look for specific error messages
   - Note which component is failing

2. **Check Network Tab**
   - Identify which API calls are failing
   - Check response status codes

3. **Verify RLS Policies**
   - Run verification queries from checklist
   - Ensure policies allow public SELECT

4. **Check Data**
   - Verify tables have data
   - Ensure fields are not null

5. **Contact Support**
   - Include console errors
   - Include network tab screenshots
   - Note which test step failed

## Final Verification

After all tests pass:
- [ ] Clear browser cache
- [ ] Test in different browser
- [ ] Test on mobile device (if applicable)
- [ ] Test with slow network (throttling)
- [ ] Document any remaining issues

