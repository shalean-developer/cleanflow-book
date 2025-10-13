// Test script to verify the claim-promo Edge Function works locally
async function testEdgeFunction() {
  console.log('🧪 Testing claim-promo Edge Function locally...');
  
  const testUrl = 'http://localhost:54321/functions/v1/claim-promo';
  
  try {
    // Test 1: OPTIONS request (CORS preflight)
    console.log('\n1. Testing OPTIONS request (CORS preflight)...');
    const optionsResponse = await fetch(testUrl, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization,content-type',
      },
    });
    
    console.log('OPTIONS Status:', optionsResponse.status);
    console.log('OPTIONS Headers:', Object.fromEntries(optionsResponse.headers.entries()));
    
    if (optionsResponse.status === 200) {
      console.log('✅ CORS preflight successful');
    } else {
      console.log('❌ CORS preflight failed');
    }
    
    // Test 2: POST request without auth (should return 401)
    console.log('\n2. Testing POST request without auth...');
    const postResponse = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'TEST',
        serviceSlug: 'standard-cleaning',
        sessionId: 'test-session',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    });
    
    console.log('POST Status:', postResponse.status);
    const postResult = await postResponse.text();
    console.log('POST Response:', postResult);
    
    if (postResponse.status === 401) {
      console.log('✅ Authentication check working');
    } else {
      console.log('❌ Unexpected response for unauthenticated request');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the Edge Function is running locally:');
    console.log('supabase functions serve claim-promo --no-verify-jwt');
  }
}

// Run the test
testEdgeFunction();
