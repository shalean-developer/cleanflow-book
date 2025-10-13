// Test script to verify promo claiming works
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testPromoClaim() {
  console.log('Testing promo claim functionality...')
  
  try {
    // Test 1: Check if promo_claims table exists and is accessible
    console.log('\n1. Testing table access...')
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('slug, name')
      .eq('slug', 'standard-cleaning')
      .single()
    
    if (servicesError) {
      console.error('❌ Services table error:', servicesError)
      return
    }
    console.log('✅ Services table accessible:', services)
    
    // Test 2: Check if we can query promo_claims (should work for service role)
    console.log('\n2. Testing promo_claims table access...')
    const { data: claims, error: claimsError } = await supabase
      .from('promo_claims')
      .select('*')
      .limit(1)
    
    if (claimsError) {
      console.error('❌ Promo claims table error:', claimsError)
      console.log('This might be an RLS issue')
    } else {
      console.log('✅ Promo claims table accessible')
    }
    
    // Test 3: Test Edge Function call (if authenticated)
    console.log('\n3. Testing Edge Function...')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      console.log('User authenticated, testing claim-promo function...')
      
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)
      
      const { data, error } = await supabase.functions.invoke('claim-promo', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          code: 'NEW20SC',
          serviceSlug: 'standard-cleaning',
          sessionId: `test_session_${Date.now()}`,
          email: session.user.email,
          expiresAt: expiresAt.toISOString(),
        },
      })
      
      if (error) {
        console.error('❌ Edge Function error:', error)
      } else {
        console.log('✅ Edge Function success:', data)
      }
    } else {
      console.log('ℹ️  No authenticated session, skipping Edge Function test')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testPromoClaim()
