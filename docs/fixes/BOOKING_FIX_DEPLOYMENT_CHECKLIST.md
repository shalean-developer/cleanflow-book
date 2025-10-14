# Booking Fix Deployment Checklist

## Pre-Deployment Checks

### 1. Code Changes Verified
- [x] `src/pages/booking/Review.tsx` - Payment callback updated
- [x] `src/pages/booking/Confirmation.tsx` - Query logic improved
- [x] `src/lib/paystack.ts` - TypeScript types updated
- [x] No linter errors in modified files

### 2. Edge Functions Check
- [ ] `verify-paystack-payment` function exists in `supabase/functions/`
- [ ] Function has proper CORS headers
- [ ] Function handles authentication correctly
- [ ] Function creates bookings with all required fields

### 3. Environment Variables (Supabase Dashboard)
Check these are set in Supabase > Edge Functions > Settings:
- [ ] `PAYSTACK_SECRET_KEY` - Your Paystack secret key
- [ ] `SUPABASE_URL` - Your Supabase project URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key (bypasses RLS)

### 4. Database Schema
Verify these columns exist in `bookings` table:
- [ ] `reference` (TEXT UNIQUE)
- [ ] `user_id` (UUID)
- [ ] `service_id` (UUID)
- [ ] `payment_reference` (TEXT UNIQUE)
- [ ] `phone_number` (TEXT)
- [ ] `pricing` (JSONB)
- [ ] `customer_email` (TEXT)
- [ ] `status` (TEXT)
- [ ] All other booking fields (bedrooms, bathrooms, date, time, etc.)

### 5. RLS Policies
Verify these policies exist:
- [ ] "Users can create their own bookings" (INSERT)
- [ ] "Users can view their own bookings" (SELECT)
- [ ] "Admins can view all bookings" (SELECT)

## Deployment Steps

### Step 1: Deploy Edge Function
```bash
cd supabase
supabase functions deploy verify-paystack-payment
```

**Expected output:**
```
Deploying verify-paystack-payment (project ref: ...)
✓ Function deployed successfully
```

### Step 2: Test Edge Function Directly
```bash
curl -X POST "https://your-project.supabase.co/functions/v1/verify-paystack-payment" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"reference": "test-reference"}'
```

**Expected:** Error about invalid reference (function is working)

### Step 3: Deploy Frontend
```bash
npm run build
# or
npm run deploy
```

### Step 4: Clear Browser Cache
- Clear cache for your site
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Or use incognito/private window for testing

## Post-Deployment Testing

### Test 1: Complete Booking Flow (Test Mode)
1. [ ] Go to booking page
2. [ ] Select a service
3. [ ] Choose date/time/location
4. [ ] Add phone number
5. [ ] Click "Continue to Payment"
6. [ ] Use Paystack test card: `4084 0840 8408 4081` (CVV: any, Expiry: any future date)
7. [ ] Complete payment
8. [ ] Verify success toast appears
9. [ ] Wait for redirect to confirmation page
10. [ ] Verify booking details display correctly

### Test 2: Database Verification
After completing test booking:

```sql
-- Find your test booking
SELECT 
  id, 
  reference, 
  payment_reference, 
  status, 
  customer_email,
  phone_number,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:**
- [ ] Booking exists with status 'confirmed'
- [ ] Payment reference matches Paystack reference
- [ ] All fields are populated correctly
- [ ] Phone number is saved
- [ ] Pricing JSON is valid

### Test 3: Error Handling
Test these scenarios:

#### 3a. Network Error Simulation
- [ ] Open browser DevTools > Network
- [ ] Set to "Offline" mode
- [ ] Try to complete payment
- [ ] Verify proper error message appears

#### 3b. Cancelled Payment
- [ ] Start payment process
- [ ] Close Paystack modal without paying
- [ ] Verify "Payment Cancelled" toast appears
- [ ] Verify no booking created in database

#### 3c. Invalid Payment Reference
Try accessing confirmation page with fake reference:
```
/booking/confirmation?reference=INVALID-123
```
- [ ] Verify proper error message
- [ ] Verify "Go Home" button works

### Test 4: User Experience
- [ ] Payment button shows loading state
- [ ] Success toast appears before redirect
- [ ] Confirmation page loads within 2-3 seconds
- [ ] All booking details are accurate
- [ ] User can navigate to dashboard
- [ ] Booking appears in user's bookings list

### Test 5: Admin Verification
Login as admin and verify:
- [ ] Booking appears in admin dashboard
- [ ] All booking details are visible
- [ ] Payment reference is clickable/viewable
- [ ] Status shows as 'confirmed'

### Test 6: Email Confirmation
After successful booking:
- [ ] Check email for confirmation
- [ ] Verify booking details in email
- [ ] Verify email contains booking reference
- [ ] Test any links in email work

## Monitoring (First 24 Hours)

### Metrics to Watch

1. **Booking Success Rate**
   ```sql
   -- Should be close to 100%
   SELECT 
     COUNT(*) as total_bookings,
     SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
     ROUND(100.0 * SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM bookings
   WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

2. **Orphaned Payments** (Should be 0)
   ```sql
   -- Payments without bookings
   SELECT COUNT(*) as orphaned_payments
   FROM payments p
   WHERE p.status = 'success'
     AND p.created_at > NOW() - INTERVAL '24 hours'
     AND NOT EXISTS (
       SELECT 1 FROM bookings b 
       WHERE b.payment_reference = p.reference
     );
   ```

3. **Edge Function Errors**
   - Check Supabase Dashboard > Edge Functions > Logs
   - Look for errors in `verify-paystack-payment`
   - Common issues: auth errors, database errors

4. **User Support Tickets**
   - Monitor for "payment successful but no booking" reports
   - Should be zero after fix

### Alert Conditions

Set up alerts for:
- [ ] Orphaned payments > 0
- [ ] Booking success rate < 95%
- [ ] Edge function error rate > 1%
- [ ] Increased support tickets about bookings

## Rollback Plan

If critical issues occur:

### Emergency Rollback
1. Revert frontend changes:
   ```bash
   git revert HEAD
   npm run build
   # Deploy previous version
   ```

2. Temporarily disable new flow:
   - Comment out verification call in `Review.tsx`
   - Re-enable mock booking in `Confirmation.tsx`
   - Investigate issues in development

### Investigation Steps
1. Check Edge Function logs for errors
2. Verify environment variables are set correctly
3. Test payment verification manually
4. Check database for any schema issues
5. Review Paystack dashboard for payment status

## Success Criteria

✅ **Deployment is successful when:**
1. All test bookings create database records
2. No orphaned payments in first 24 hours
3. Confirmation page displays real bookings
4. Zero support tickets about missing bookings
5. Email confirmations are sent successfully
6. Admin dashboard shows all bookings correctly

## Common Issues & Solutions

### Issue: "Booking not found" after payment
**Solution:** 
- Check Edge Function logs for errors
- Verify environment variables
- Check if booking was actually created in database
- Look for RLS policy issues

### Issue: Payment successful but verification fails
**Solution:**
- Check Paystack API status
- Verify secret key is correct
- Check network connectivity between Supabase and Paystack
- Review Edge Function logs

### Issue: Database insert error
**Solution:**
- Check all required fields are provided
- Verify foreign key constraints (service_id, user_id)
- Check for duplicate payment_reference
- Review database logs

### Issue: User not authenticated
**Solution:**
- Verify session is valid
- Check auth token is being passed correctly
- Ensure user hasn't logged out during payment

## Contact Information

**For deployment issues:**
- Check Supabase Dashboard > Edge Functions > Logs
- Review browser console errors
- Check Paystack dashboard for payment details

**Support escalation:**
- Include payment reference
- Include Edge Function logs
- Include browser console logs
- Include database query results

## Post-Deployment Actions

After successful deployment:
- [ ] Update documentation with deployment date
- [ ] Monitor metrics for 24 hours
- [ ] Notify team of successful deployment
- [ ] Archive old documentation about mock bookings
- [ ] Update user support guides if needed

## Notes

- Test thoroughly in test mode before going live
- Keep Paystack test mode enabled until confident
- Monitor for at least 24 hours after deployment
- Have rollback plan ready but shouldn't need it
- This fix addresses the root cause, not just symptoms

