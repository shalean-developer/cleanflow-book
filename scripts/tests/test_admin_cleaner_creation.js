// Test script to verify admin can create cleaner profiles
// Run this after applying the RLS fix

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminCleanerCreation() {
  console.log('🧪 Testing Admin Cleaner Creation...\n');

  try {
    // Step 1: Check current user and role
    console.log('1️⃣ Checking current user and role...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return;
    }

    if (!user) {
      console.error('❌ No authenticated user found. Please log in as admin.');
      return;
    }

    console.log('✅ User authenticated:', user.email);

    // Check profile role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile error:', profileError.message);
    } else {
      console.log('✅ Profile role:', profile?.role);
    }

    // Check user_roles
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError) {
      console.log('ℹ️ User roles table error (may not exist):', roleError.message);
    } else {
      console.log('✅ User role:', userRole?.role);
    }

    // Step 2: Test reading cleaners table (should work)
    console.log('\n2️⃣ Testing read access to cleaners table...');
    const { data: cleaners, error: readError } = await supabase
      .from('cleaners')
      .select('id, name, email, active')
      .limit(5);

    if (readError) {
      console.error('❌ Read error:', readError.message);
    } else {
      console.log('✅ Read access successful. Found', cleaners?.length, 'cleaners');
    }

    // Step 3: Test creating a cleaner profile
    console.log('\n3️⃣ Testing cleaner profile creation...');
    
    const testCleanerData = {
      name: 'Test Cleaner ' + Date.now(),
      email: 'test-cleaner@example.com',
      phone: '+1234567890',
      active: true,
      experience_years: 2,
      hourly_rate: 25.00,
      bio: 'Test cleaner profile for RLS testing',
      service_areas: ['Test Area'],
      user_id: user.id // Link to current admin user for testing
    };

    const { data: newCleaner, error: createError } = await supabase
      .from('cleaners')
      .insert(testCleanerData)
      .select()
      .single();

    if (createError) {
      console.error('❌ Create error:', createError.message);
      console.error('❌ Error details:', createError);
      
      // If creation failed, check if it's an RLS policy issue
      if (createError.message.includes('row-level security policy')) {
        console.log('\n🔧 RLS Policy Issue Detected!');
        console.log('📋 Please run the QUICK_FIX_ADMIN_CLEANER_CREATION.sql script in your Supabase SQL Editor');
      }
    } else {
      console.log('✅ Cleaner profile created successfully!');
      console.log('✅ New cleaner ID:', newCleaner.id);

      // Step 4: Test updating the cleaner profile
      console.log('\n4️⃣ Testing cleaner profile update...');
      const { error: updateError } = await supabase
        .from('cleaners')
        .update({ bio: 'Updated bio for testing' })
        .eq('id', newCleaner.id);

      if (updateError) {
        console.error('❌ Update error:', updateError.message);
      } else {
        console.log('✅ Cleaner profile updated successfully!');
      }

      // Step 5: Clean up - delete the test cleaner
      console.log('\n5️⃣ Cleaning up test data...');
      const { error: deleteError } = await supabase
        .from('cleaners')
        .delete()
        .eq('id', newCleaner.id);

      if (deleteError) {
        console.error('❌ Delete error:', deleteError.message);
      } else {
        console.log('✅ Test cleaner deleted successfully!');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  console.log('\n🏁 Test completed!');
}

// Run the test
testAdminCleanerCreation();
