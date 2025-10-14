#!/usr/bin/env node

/**
 * Test script to verify that the RLS fix worked
 * Run this after applying the manual SQL fix
 */

const { createClient } = require('@supabase/supabase-js');

// Use your public Supabase URL and anon key (not service key)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'YOUR_ANON_KEY';

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL' || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'YOUR_ANON_KEY') {
  console.error('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables');
  process.exit(1);
}

// Create Supabase client with anon key (like the frontend would use)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testPublicAccess() {
  console.log('🧪 Testing public data access (no authentication required)...');
  
  const tests = [
    {
      name: 'Services',
      test: () => supabase.from('services').select('*').limit(1)
    },
    {
      name: 'Extras',
      test: () => supabase.from('extras').select('*').limit(1)
    },
    {
      name: 'Cleaners',
      test: () => supabase.from('cleaners').select('*').limit(1)
    }
  ];
  
  for (const { name, test } of tests) {
    try {
      const { data, error } = await test();
      if (error) {
        console.log(`❌ ${name}: ${error.message}`);
      } else {
        console.log(`✅ ${name}: Accessible (${data?.length || 0} records)`);
      }
    } catch (err) {
      console.log(`❌ ${name}: ${err.message}`);
    }
  }
}

async function testAuthenticatedAccess() {
  console.log('\n🔐 Testing authenticated access...');
  console.log('Note: This requires a valid user session. If no user is logged in, these will fail.');
  
  // This would need to be run with a valid user session
  // For now, we'll just show what should work
  console.log('To test authenticated access:');
  console.log('1. Sign in to your app');
  console.log('2. Go to /dashboard');
  console.log('3. Check if bookings load');
  console.log('4. Check browser console for any RLS errors');
}

async function runTests() {
  console.log('🔧 CleanFlow Dashboard Fix Verification');
  console.log('=====================================\n');
  
  await testPublicAccess();
  await testAuthenticatedAccess();
  
  console.log('\n📋 Next Steps:');
  console.log('1. If public access tests pass, your booking form should work');
  console.log('2. Sign in and test the dashboard');
  console.log('3. Check browser console for any remaining errors');
  console.log('4. If issues persist, check Supabase logs for RLS policy violations');
}

if (require.main === module) {
  runTests();
}
