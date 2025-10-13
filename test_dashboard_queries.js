import { createClient } from '@supabase/supabase-js';

// You'll need to replace these with your actual Supabase credentials
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'YOUR_ANON_KEY';

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL' || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'YOUR_ANON_KEY') {
  console.error('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDashboardQueries() {
  console.log('🧪 Testing Dashboard Data Loading');
  console.log('===================================\n');

  try {
    // Test 1: Check if user is authenticated
    console.log('1. Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Authentication error:', authError.message);
      return;
    }
    
    if (!user) {
      console.log('❌ No authenticated user found');
      console.log('   You need to be logged in to test dashboard queries');
      return;
    }
    
    console.log('✅ User authenticated:', user.email);
    console.log('   User ID:', user.id);

    // Test 2: Check user profile and role
    console.log('\n2. Checking user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('❌ Profile error:', profileError.message);
    } else {
      console.log('✅ Profile found:', profile);
      if (profile.role !== 'admin') {
        console.log('⚠️  User is not an admin. Role:', profile.role);
        console.log('   You may need to set your role to admin');
      } else {
        console.log('✅ User has admin role');
      }
    }

    // Test 3: Test the exact bookings query from AdminDashboard.tsx
    console.log('\n3. Testing admin bookings query...');
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        services(*),
        cleaners(*)
      `)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.log('❌ Bookings query failed:', bookingsError.message);
      console.log('   Error details:', bookingsError);
    } else {
      console.log('✅ Bookings query successful');
      console.log('   Found bookings:', bookingsData?.length || 0);
      if (bookingsData && bookingsData.length > 0) {
        console.log('   Sample booking:', {
          id: bookingsData[0].id,
          reference: bookingsData[0].reference,
          status: bookingsData[0].status,
          hasService: !!bookingsData[0].services,
          hasCleaner: !!bookingsData[0].cleaners
        });
      }
    }

    // Test 4: Test cleaners query
    console.log('\n4. Testing cleaners query...');
    const { data: cleanersData, error: cleanersError } = await supabase
      .from('cleaners')
      .select('*')
      .order('created_at', { ascending: false });

    if (cleanersError) {
      console.log('❌ Cleaners query failed:', cleanersError.message);
    } else {
      console.log('✅ Cleaners query successful');
      console.log('   Found cleaners:', cleanersData?.length || 0);
    }

    // Test 5: Test applications query
    console.log('\n5. Testing applications query...');
    const { data: applicationsData, error: applicationsError } = await supabase
      .from('cleaner_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (applicationsError) {
      console.log('❌ Applications query failed:', applicationsError.message);
      if (applicationsError.code === 'PGRST116') {
        console.log('   This suggests the cleaner_applications table does not exist');
      }
    } else {
      console.log('✅ Applications query successful');
      console.log('   Found applications:', applicationsData?.length || 0);
    }

    // Test 6: Check if RLS is blocking access
    console.log('\n6. Testing RLS access...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);

    if (rlsError) {
      console.log('❌ RLS blocking access:', rlsError.message);
      if (rlsError.message.includes('permission denied') || rlsError.message.includes('RLS')) {
        console.log('   This indicates Row Level Security is blocking your access');
        console.log('   Check that your user has admin role in profiles table');
      }
    } else {
      console.log('✅ RLS allows access to bookings');
    }

    console.log('\n📋 Summary:');
    console.log('============');
    console.log('Authentication:', user ? '✅' : '❌');
    console.log('Profile exists:', profile ? '✅' : '❌');
    console.log('Admin role:', profile?.role === 'admin' ? '✅' : '❌');
    console.log('Bookings accessible:', bookingsData ? '✅' : '❌');
    console.log('Cleaners accessible:', cleanersData ? '✅' : '❌');
    console.log('Applications accessible:', applicationsData ? '✅' : '❌');

    console.log('\n🔧 Next Steps:');
    console.log('==============');
    
    if (!profile || profile.role !== 'admin') {
      console.log('1. Set your user as admin using SET_USER_AS_ADMIN.sql');
    }
    
    if (bookingsError) {
      console.log('2. Check RLS policies - bookings query is failing');
    }
    
    if (cleanersError) {
      console.log('3. Check cleaners table access');
    }
    
    if (applicationsError) {
      console.log('4. Check if cleaner_applications table exists');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testDashboardQueries();
