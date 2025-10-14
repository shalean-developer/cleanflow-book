const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'YOUR_ANON_KEY';

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL' || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'YOUR_ANON_KEY') {
  console.error('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables');
  console.error('Or edit this script and add your credentials directly');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAdminAccess() {
  console.log('🧪 Testing Admin Booking Access Fix');
  console.log('=====================================\n');

  try {
    // Test 1: Check if we can access bookings without authentication
    console.log('1. Testing public booking access...');
    const { data: publicBookings, error: publicError } = await supabase
      .from('bookings')
      .select('id, reference, status')
      .limit(5);

    if (publicError) {
      console.log('❌ Public access failed:', publicError.message);
      console.log('   This is expected - bookings should be protected by RLS');
    } else {
      console.log('⚠️  Public access succeeded - this might indicate RLS is disabled');
      console.log('   Found bookings:', publicBookings?.length || 0);
    }

    // Test 2: Check admin users in profiles table
    console.log('\n2. Checking admin users in profiles table...');
    const { data: adminProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, full_name')
      .eq('role', 'admin');

    if (profileError) {
      console.log('❌ Could not check profiles:', profileError.message);
    } else {
      console.log(`✅ Found ${adminProfiles?.length || 0} admin users in profiles table`);
      if (adminProfiles && adminProfiles.length > 0) {
        adminProfiles.forEach(profile => {
          console.log(`   - ${profile.full_name || 'No name'} (${profile.id})`);
        });
      }
    }

    // Test 3: Check admin users in user_roles table (if it exists)
    console.log('\n3. Checking admin users in user_roles table...');
    const { data: adminRoles, error: roleError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'admin');

    if (roleError) {
      console.log('⚠️  Could not check user_roles table:', roleError.message);
      console.log('   This table might not exist, which is fine');
    } else {
      console.log(`✅ Found ${adminRoles?.length || 0} admin users in user_roles table`);
      if (adminRoles && adminRoles.length > 0) {
        adminRoles.forEach(role => {
          console.log(`   - User ID: ${role.user_id}`);
        });
      }
    }

    // Test 4: Check total bookings count (this should work for admin users)
    console.log('\n4. Checking total bookings in database...');
    const { data: allBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, reference, status, created_at')
      .limit(10);

    if (bookingsError) {
      console.log('❌ Could not fetch bookings:', bookingsError.message);
      console.log('   This suggests RLS is blocking access even for admin users');
    } else {
      console.log(`✅ Found ${allBookings?.length || 0} bookings in database`);
      if (allBookings && allBookings.length > 0) {
        console.log('   Sample bookings:');
        allBookings.forEach(booking => {
          console.log(`   - ${booking.reference} (${booking.status}) - ${booking.created_at}`);
        });
      }
    }

    // Test 5: Check RLS policies
    console.log('\n5. Checking RLS policies on bookings table...');
    const { data: policies, error: policyError } = await supabase
      .rpc('get_table_policies', { table_name: 'bookings' });

    if (policyError) {
      console.log('⚠️  Could not fetch policies via RPC:', policyError.message);
      console.log('   This RPC function might not exist');
    } else {
      console.log(`✅ Found ${policies?.length || 0} RLS policies on bookings table`);
      if (policies && policies.length > 0) {
        policies.forEach(policy => {
          console.log(`   - ${policy.policyname} (${policy.cmd})`);
        });
      }
    }

    console.log('\n📋 Summary:');
    console.log('============');
    
    if (adminProfiles && adminProfiles.length > 0) {
      console.log('✅ Admin users found in profiles table');
    } else {
      console.log('❌ No admin users found in profiles table');
      console.log('   You may need to set an admin role manually');
    }

    if (allBookings && allBookings.length > 0) {
      console.log('✅ Bookings exist in database');
    } else {
      console.log('⚠️  No bookings found in database');
      console.log('   This might be normal if no bookings have been created yet');
    }

    console.log('\n🔧 Next Steps:');
    console.log('==============');
    console.log('1. If no admin users found, manually set admin role:');
    console.log('   UPDATE public.profiles SET role = \'admin\' WHERE id = \'your-user-id\';');
    console.log('2. If bookings exist but dashboard shows none, the RLS fix should work');
    console.log('3. Test the dashboard with an admin user logged in');
    console.log('4. Check browser console for any remaining RLS errors');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAdminAccess();
