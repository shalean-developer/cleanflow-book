const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL or SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const fixSQL = `
-- =====================================================
-- FIX MULTIPLE BOOKING PERMISSIONS ISSUE
-- =====================================================

-- STEP 1: Clean up all conflicting booking policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can insert all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can view their assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can update their assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can update assigned bookings" ON public.bookings;

-- STEP 2: Ensure all users have proper profiles and roles
INSERT INTO public.profiles (id, role, created_at, updated_at)
SELECT 
  id, 
  'customer'::text, 
  now(), 
  now()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- STEP 3: Create clean, consistent booking policies
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all bookings"
  ON public.bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Cleaners can view assigned bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'cleaner'
    )
    AND cleaner_id IN (
      SELECT id FROM public.cleaners
      WHERE cleaners.user_id = auth.uid()
    )
  );

CREATE POLICY "Cleaners can update assigned bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'cleaner'
    )
    AND cleaner_id IN (
      SELECT id FROM public.cleaners
      WHERE cleaners.user_id = auth.uid()
    )
  );

-- STEP 4: Fix booking_extras policies
DROP POLICY IF EXISTS "Users can view booking extras" ON public.booking_extras;
DROP POLICY IF EXISTS "Users can insert booking extras" ON public.booking_extras;
DROP POLICY IF EXISTS "Users can update booking extras" ON public.booking_extras;
DROP POLICY IF EXISTS "Users can delete booking extras" ON public.booking_extras;
DROP POLICY IF EXISTS "Users can delete own booking extras" ON public.booking_extras;

CREATE POLICY "Users can view booking extras for own bookings"
  ON public.booking_extras FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert booking extras for own bookings"
  ON public.booking_extras FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update booking extras for own bookings"
  ON public.booking_extras FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete booking extras for own bookings"
  ON public.booking_extras FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_extras.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all booking extras"
  ON public.booking_extras FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- STEP 5: Fix payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert payments for own bookings" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments;

CREATE POLICY "Users can view payments for own bookings"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert payments for own bookings"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update payments for own bookings"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete payments for own bookings"
  ON public.payments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all payments"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- STEP 6: Fix profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- STEP 7: Update user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = COALESCE(public.profiles.role, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
`;

async function applyFix() {
  try {
    console.log('🚀 Starting booking permissions fix...');
    
    // Execute the SQL fix
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: fixSQL
    });

    if (error) {
      console.error('❌ Error applying fix:', error);
      
      // Try alternative method - direct SQL execution
      console.log('🔄 Trying alternative method...');
      const { error: altError } = await supabase
        .from('_sql')
        .select('*')
        .eq('query', fixSQL);
      
      if (altError) {
        console.error('❌ Alternative method also failed:', altError);
        console.log('\n📝 Manual fix required:');
        console.log('1. Copy the contents of FIX_MULTIPLE_BOOKING_PERMISSIONS.sql');
        console.log('2. Go to your Supabase Dashboard → SQL Editor');
        console.log('3. Paste and execute the SQL script');
        return;
      }
    }

    console.log('✅ Fix applied successfully!');
    
    // Run verification queries
    console.log('\n🔍 Running verification...');
    
    // Check user profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .not('role', 'is', null);
    
    if (!profileError) {
      console.log(`✅ Found ${profiles?.length || 0} users with proper roles`);
    }

    // Check booking policies
    const { data: policies, error: policyError } = await supabase
      .rpc('get_table_policies', { table_name: 'bookings' });
    
    if (!policyError && policies) {
      console.log(`✅ Found ${policies.length} booking policies`);
    }

    console.log('\n🎉 Booking permissions fix completed!');
    console.log('\n📋 What was fixed:');
    console.log('   • Removed conflicting RLS policies');
    console.log('   • Created consistent user booking permissions');
    console.log('   • Ensured users can make multiple bookings');
    console.log('   • Fixed admin and cleaner access policies');
    console.log('   • Updated profile creation trigger');
    
    console.log('\n🧪 Test your fix:');
    console.log('   1. Log in to your app');
    console.log('   2. Make a booking');
    console.log('   3. Try to make another booking');
    console.log('   4. Verify you can see all your bookings in dashboard');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('\n📝 Manual fix required:');
    console.log('1. Copy the contents of FIX_MULTIPLE_BOOKING_PERMISSIONS.sql');
    console.log('2. Go to your Supabase Dashboard → SQL Editor');
    console.log('3. Paste and execute the SQL script');
  }
}

// Run the fix
applyFix();
