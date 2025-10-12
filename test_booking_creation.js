// Test script to verify booking creation works
// Run this in browser console after completing a payment

async function testBookingCreation() {
  console.log('Testing booking creation...');
  
  // Get current booking data from the store (if available)
  const bookingData = window.bookingStore?.getState?.()?.booking;
  console.log('Booking data:', bookingData);
  
  // Test direct database insertion
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test booking creation
  const testBooking = {
    reference: `TEST-${Date.now()}`,
    user_id: 'test-user-id',
    service_id: bookingData?.serviceId || 'test-service-id',
    bedrooms: bookingData?.bedrooms || 2,
    bathrooms: bookingData?.bathrooms || 1,
    extras: bookingData?.extras || [],
    date: bookingData?.date || '2025-01-15',
    time: bookingData?.time || '09:00',
    frequency: bookingData?.frequency || 'once-off',
    location: bookingData?.location || 'Test Location',
    special_instructions: bookingData?.specialInstructions || 'Test booking',
    cleaner_id: null,
    phone_number: '1234567890',
    pricing: bookingData?.pricing || { total: 100 },
    customer_email: 'test@example.com',
    status: 'confirmed',
    payment_reference: `TEST-PAY-${Date.now()}`,
  };
  
  console.log('Attempting to create test booking:', testBooking);
  
  const { data, error } = await supabase
    .from('bookings')
    .insert(testBooking)
    .select()
    .single();
    
  if (error) {
    console.error('Booking creation failed:', error);
  } else {
    console.log('Booking created successfully:', data);
  }
}

// Instructions:
// 1. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with actual values
// 2. Run this in browser console after completing a payment
// 3. Check console for results

console.log('Booking creation test script loaded. Run testBookingCreation() to test.');
