// Debug script to test payment callback manually
// Run this in browser console after completing a payment

async function debugPaymentCallback() {
  console.log('=== DEBUGGING PAYMENT CALLBACK ===');
  
  // Get the most recent booking
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('1. User session:', session ? 'authenticated' : 'not authenticated');
  if (sessionError) console.error('Session error:', sessionError);
  
  // Get most recent booking
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (bookingsError) {
    console.error('2. Bookings fetch error:', bookingsError);
    return;
  }
  
  if (!bookings || bookings.length === 0) {
    console.log('2. No bookings found');
    return;
  }
  
  const booking = bookings[0];
  console.log('2. Most recent booking:', booking);
  
  // Test payment record creation
  console.log('3. Testing payment record creation...');
  
  const paymentData = {
    booking_id: booking.id,
    provider: 'paystack',
    reference: booking.payment_reference,
    status: 'success',
    amount: booking.pricing?.total || 100.00,
    currency: 'ZAR',
    paid_at: booking.created_at,
  };
  
  console.log('4. Payment data to insert:', paymentData);
  
  const { data: newPayment, error: createError } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single();
    
  if (createError) {
    console.error('5. Payment creation failed:', createError);
    console.error('Error details:', {
      message: createError.message,
      details: createError.details,
      hint: createError.hint,
      code: createError.code
    });
  } else {
    console.log('5. Payment created successfully:', newPayment);
  }
  
  // Check if callback function exists
  console.log('6. Checking if verifyPaymentAndCreateBooking function exists...');
  if (typeof window.verifyPaymentAndCreateBooking === 'function') {
    console.log('✓ Function exists');
  } else {
    console.log('✗ Function does not exist - this might be the issue!');
  }
}

// Also test the Edge Function approach
async function testEdgeFunction() {
  console.log('=== TESTING EDGE FUNCTION ===');
  
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test Edge Function
  const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
    body: { reference: 'TEST-REFERENCE-123' },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });
  
  console.log('Edge Function test result:', { data, error });
}

// Instructions:
// 1. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with actual values
// 2. Run debugPaymentCallback() after completing a payment
// 3. Check console for detailed error messages

console.log('Payment callback debug script loaded.');
console.log('Run debugPaymentCallback() to test payment creation manually.');
console.log('Run testEdgeFunction() to test the Edge Function.');
