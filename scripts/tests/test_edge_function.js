// Test the Edge Function directly to see what's happening
// Run this in browser console

async function testEdgeFunction() {
  console.log('=== TESTING EDGE FUNCTION ===');
  
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('1. User session:', session ? 'authenticated' : 'not authenticated');
  
  if (!session) {
    console.error('No user session - cannot test Edge Function');
    return;
  }
  
  // Test Edge Function with a fake reference
  const testReference = 'TEST-REFERENCE-' + Date.now();
  console.log('2. Testing with reference:', testReference);
  
  try {
    const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
      body: { reference: testReference },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    
    console.log('3. Edge Function response:', { data, error });
    
    if (error) {
      console.error('❌ Edge Function error:', error);
    } else {
      console.log('✅ Edge Function response received:', data);
    }
    
  } catch (err) {
    console.error('❌ Edge Function call failed:', err);
  }
}

// Test if Edge Function is deployed
async function checkEdgeFunctionStatus() {
  console.log('=== CHECKING EDGE FUNCTION STATUS ===');
  
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Try to list functions (this might not work with anon key)
  try {
    const { data, error } = await supabase.functions.list();
    console.log('Available functions:', data);
  } catch (err) {
    console.log('Cannot list functions (expected with anon key):', err.message);
  }
  
  // Test a simple function call
  try {
    const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
      body: { reference: 'test' },
    });
    console.log('Simple function test:', { data, error });
  } catch (err) {
    console.log('Simple function test failed:', err.message);
  }
}

// Instructions:
// 1. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with actual values
// 2. Run testEdgeFunction() to test the Edge Function
// 3. Run checkEdgeFunctionStatus() to check if the function is deployed

console.log('Edge Function test script loaded.');
console.log('Run testEdgeFunction() to test the Edge Function directly.');
console.log('Run checkEdgeFunctionStatus() to check deployment status.');
