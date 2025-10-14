// Test script to verify payment record creation
// Run this in browser console after completing a payment

async function testPaymentCreation() {
  console.log('Testing payment record creation...');
  
  // Get the booking that was just created
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Find the most recent booking
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
    return;
  }
  
  if (!bookings || bookings.length === 0) {
    console.log('No bookings found');
    return;
  }
  
  const booking = bookings[0];
  console.log('Found booking:', booking);
  
  // Check if payment record exists
  const { data: existingPayment, error: paymentError } = await supabase
    .from('payments')
    .select('*')
    .eq('reference', booking.payment_reference)
    .maybeSingle();
    
  if (paymentError) {
    console.error('Error checking payment:', paymentError);
    return;
  }
  
  if (existingPayment) {
    console.log('Payment record already exists:', existingPayment);
    return;
  }
  
  // Try to create payment record
  console.log('Attempting to create payment record...');
  
  const paymentData = {
    booking_id: booking.id,
    provider: 'paystack',
    reference: booking.payment_reference,
    status: 'success',
    amount: booking.pricing?.total || 435.60,
    currency: 'ZAR',
    paid_at: booking.created_at,
  };
  
  console.log('Payment data:', paymentData);
  
  const { data: newPayment, error: createError } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single();
    
  if (createError) {
    console.error('Payment creation failed:', createError);
    console.error('Error details:', {
      message: createError.message,
      details: createError.details,
      hint: createError.hint,
      code: createError.code
    });
    
    // Try with minimal data
    console.log('Trying with minimal data...');
    const { data: simplePayment, error: simpleError } = await supabase
      .from('payments')
      .insert({
        booking_id: booking.id,
        provider: 'paystack',
        reference: booking.payment_reference,
        status: 'success',
        amount: 1.00,
        currency: 'ZAR',
      })
      .select()
      .single();
      
    if (simpleError) {
      console.error('Even simple payment creation failed:', simpleError);
    } else {
      console.log('Simple payment created:', simplePayment);
    }
  } else {
    console.log('Payment record created successfully:', newPayment);
  }
}

// Instructions:
// 1. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with actual values
// 2. Run this in browser console after completing a payment
// 3. Check console for results

console.log('Payment creation test script loaded. Run testPaymentCreation() to test.');
