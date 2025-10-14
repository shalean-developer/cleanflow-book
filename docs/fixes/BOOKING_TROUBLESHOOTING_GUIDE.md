# Booking Creation Troubleshooting Guide

## Current Issue: Payment Stuck in Loading State

The payment button shows a loading spinner but doesn't redirect to confirmation or create booking.

## Quick Fixes to Try

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors:
- Look for "Paystack payment successful" message
- Check for any red error messages
- Look for "Starting payment verification" log

### 2. Test Payment Flow Step by Step

#### Step 1: Verify Paystack is Working
```javascript
// Run in browser console
console.log('Paystack loaded:', !!window.PaystackPop);
```

#### Step 2: Check User Authentication
```javascript
// Run in browser console
const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
const { data: { session } } = await supabase.auth.getSession();
console.log('User session:', session ? 'authenticated' : 'not authenticated');
```

#### Step 3: Test Direct Booking Creation
```javascript
// Run in browser console after payment
const testBooking = {
  reference: `TEST-${Date.now()}`,
  user_id: 'your-user-id',
  service_id: 'your-service-id',
  bedrooms: 2,
  bathrooms: 1,
  extras: [],
  date: '2025-01-15',
  time: '09:00',
  frequency: 'once-off',
  location: 'Test Location',
  special_instructions: 'Test booking',
  cleaner_id: null,
  phone_number: '1234567890',
  pricing: { total: 100 },
  customer_email: 'test@example.com',
  status: 'confirmed',
  payment_reference: `TEST-PAY-${Date.now()}`,
};

const { data, error } = await supabase
  .from('bookings')
  .insert(testBooking)
  .select()
  .single();

console.log('Booking creation result:', { data, error });
```

## Common Issues and Solutions

### Issue 1: Edge Function Not Deployed
**Symptoms:**
- Console shows "Edge Function failed"
- Payment succeeds but booking not created

**Solution:**
```bash
cd supabase
supabase functions deploy verify-paystack-payment
```

### Issue 2: RLS Policy Blocks Insert
**Symptoms:**
- Console shows "permission denied" error
- Edge Function works but direct insert fails

**Solution:**
Check RLS policies in Supabase Dashboard:
```sql
-- Should exist
SELECT * FROM pg_policies WHERE tablename = 'bookings' AND policyname LIKE '%insert%';
```

### Issue 3: Missing Environment Variables
**Symptoms:**
- Edge Function returns authentication errors
- Console shows "Unauthorized" errors

**Solution:**
Set in Supabase Dashboard > Edge Functions > Settings:
- `PAYSTACK_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Issue 4: Paystack Callback Not Triggered
**Symptoms:**
- Payment completes but no console logs
- Loading state never ends

**Solution:**
Check Paystack configuration:
1. Verify public key is correct
2. Check if Paystack library is loaded
3. Ensure callback function is not async

### Issue 5: Database Schema Mismatch
**Symptoms:**
- "column does not exist" errors
- Booking insert fails

**Solution:**
Verify bookings table schema:
```sql
\d bookings
-- or
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'bookings';
```

## Debug Steps

### 1. Enable Detailed Logging
Add this to your browser console before testing:
```javascript
localStorage.setItem('debug', 'true');
```

### 2. Check Network Requests
1. Open DevTools > Network tab
2. Complete payment
3. Look for:
   - Paystack API calls
   - Supabase Edge Function calls
   - Database insert requests

### 3. Verify Payment Reference
After payment, check if reference exists:
```javascript
// In console after payment
const reference = 'BK-1234567890-abcdef'; // Use actual reference
console.log('Payment reference:', reference);
```

### 4. Test Edge Function Manually
```javascript
const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
  body: { reference: 'test-reference' },
  headers: {
    Authorization: `Bearer ${session?.access_token}`,
  },
});
console.log('Edge Function test:', { data, error });
```

## Emergency Workaround

If nothing works, create a temporary manual booking:

### 1. Get Payment Details
```javascript
// After successful payment, get the reference
const paymentRef = prompt('Enter payment reference from Paystack');
```

### 2. Create Booking Manually
```javascript
const manualBooking = {
  reference: `MANUAL-${Date.now()}`,
  user_id: 'your-user-id', // Get from auth
  service_id: 'your-service-id', // Get from booking form
  bedrooms: 2, // Get from form
  bathrooms: 1, // Get from form
  extras: [], // Get from form
  date: '2025-01-15', // Get from form
  time: '09:00', // Get from form
  frequency: 'once-off', // Get from form
  location: 'Your Address', // Get from form
  special_instructions: '', // Get from form
  cleaner_id: null,
  phone_number: '1234567890', // Get from form
  pricing: { total: 435.60 }, // Get from form
  customer_email: 'your@email.com', // Get from auth
  status: 'confirmed',
  payment_reference: paymentRef,
};

const { data, error } = await supabase
  .from('bookings')
  .insert(manualBooking)
  .select()
  .single();

if (error) {
  console.error('Manual booking failed:', error);
} else {
  console.log('Manual booking created:', data);
  window.location.href = `/booking/confirmation?reference=${data.reference}`;
}
```

## Monitoring Checklist

After fixing, verify:

- [ ] Payment completes successfully
- [ ] Console shows "Paystack payment successful"
- [ ] Console shows "Starting payment verification"
- [ ] Booking is created in database
- [ ] Success toast appears
- [ ] Redirect to confirmation page works
- [ ] Confirmation page shows booking details
- [ ] Loading state is cleared

## Database Verification

Check if booking was created:
```sql
-- Find recent bookings
SELECT id, reference, payment_reference, status, created_at 
FROM bookings 
ORDER BY created_at DESC 
LIMIT 10;

-- Find bookings by payment reference
SELECT * FROM bookings 
WHERE payment_reference = 'BK-1234567890-abcdef';
```

## Support Information

When reporting issues, include:
1. Browser console logs
2. Network request details
3. Payment reference
4. User ID
5. Error messages
6. Steps to reproduce

## Prevention

To avoid future issues:
1. Test payment flow regularly
2. Monitor Edge Function logs
3. Keep environment variables updated
4. Test with different browsers
5. Verify Paystack webhook settings
6. Monitor database for orphaned payments

## Quick Commands

### Check Recent Bookings
```sql
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;
```

### Check Orphaned Payments
```sql
SELECT p.reference, p.status, p.created_at
FROM payments p
LEFT JOIN bookings b ON p.reference = b.payment_reference
WHERE b.payment_reference IS NULL
  AND p.status = 'success'
  AND p.created_at > NOW() - INTERVAL '1 hour';
```

### Test Edge Function
```bash
curl -X POST "https://your-project.supabase.co/functions/v1/verify-paystack-payment" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"reference": "test-reference"}'
```

## Next Steps

1. Try the quick fixes above
2. Check console logs for specific errors
3. Test direct booking creation
4. Verify Edge Function deployment
5. Check database permissions
6. Use emergency workaround if needed

The issue is likely either:
- Edge Function not deployed/configured properly
- RLS policies blocking database inserts
- Paystack callback not triggering
- Missing environment variables

Start with checking console logs and network requests to identify the exact failure point.
