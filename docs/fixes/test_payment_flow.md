# Payment Flow Debugging Steps

## 🔍 **Debug Steps to Follow**

### Step 1: Test a Complete Payment
1. Go to the booking page
2. Complete a payment with Paystack test card: `4084 0840 8408 4081`
3. **Keep browser console open** (F12 → Console tab)

### Step 2: Check Console Logs
Look for these messages in order:
```
🎉 Paystack payment successful, reference: BK-...
📞 Calling verifyPaymentAndCreateBooking function...
✅ verifyPaymentAndCreateBooking called successfully
🚀 verifyPaymentAndCreateBooking function called with reference: BK-...
Starting payment verification for reference: BK-...
```

### Step 3: Identify Where It Fails
If you see:
- **No console logs at all** → Paystack callback not triggering
- **Stops after "Paystack payment successful"** → Function call failing
- **Stops after "verifyPaymentAndCreateBooking called"** → Function execution failing
- **Stops after "Starting payment verification"** → Edge Function or database issue

### Step 4: Check Database
After payment, run:
```sql
SELECT 
  b.reference as booking_ref,
  b.payment_reference,
  p.reference as payment_ref,
  p.amount,
  p.status
FROM bookings b
LEFT JOIN payments p ON b.payment_reference = p.reference
ORDER BY b.created_at DESC
LIMIT 3;
```

## 🧪 **Manual Test Script**

If the automatic flow isn't working, run this in browser console:

```javascript
// Test the function manually
async function testPaymentFunction() {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
  
  // Get most recent booking
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (bookings && bookings.length > 0) {
    const booking = bookings[0];
    console.log('Testing with booking:', booking);
    
    // Test payment creation
    const { data, error } = await supabase
      .from('payments')
      .insert({
        booking_id: booking.id,
        provider: 'paystack',
        reference: booking.payment_reference,
        status: 'success',
        amount: booking.pricing?.total || 100,
        currency: 'ZAR',
      })
      .select()
      .single();
      
    console.log('Payment creation result:', { data, error });
  }
}

testPaymentFunction();
```

## 🎯 **Expected Results**

**If working correctly:**
- Console shows all debug messages
- Database has both booking and payment records
- No error messages in console

**If failing:**
- Console stops at a specific message
- Database has only booking record
- Error messages in console

## 🚨 **Common Issues**

1. **Paystack callback not triggering**
   - Check if Paystack library is loaded
   - Verify payment actually completed

2. **Function call failing**
   - Check if `verifyPaymentAndCreateBooking` exists
   - Verify no JavaScript errors

3. **Database insertion failing**
   - Check RLS policies
   - Verify user authentication
   - Check for foreign key constraints

Run through these steps and let me know what console messages you see!
