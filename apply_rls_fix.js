#!/usr/bin/env node

/**
 * Script to apply RLS policy fixes for CleanFlow dashboard
 * This script should be run in Lovable cloud environment
 */

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL' || !SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_ROLE_KEY') {
  console.error('❌ Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const migrationSQL = `
-- Fix RLS policies for dashboard implementation
-- This migration ensures data can be fetched properly after adding roles

-- 1. Ensure all users have a profile with default role
-- Create profiles for any users that don't have one
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

-- 2. Update existing profiles to have customer role if they don't have a role
UPDATE public.profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- 3. Ensure services can be read by everyone (including non-authenticated users)
-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

-- 4. Ensure extras can be read by everyone (including non-authenticated users)
DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
CREATE POLICY "Extras are viewable by everyone"
  ON public.extras FOR SELECT
  USING (true);

-- 5. Ensure cleaners can be read by everyone (including non-authenticated users)
DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
CREATE POLICY "Cleaners are viewable by everyone"
  ON public.cleaners FOR SELECT
  USING (true);

-- 6. Ensure users can view their own bookings
-- This policy already exists, but we'll ensure it's properly set up
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

-- 7. Ensure users can create their own bookings
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 8. Ensure users can update their own bookings (for cancellations, etc.)
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- 9. Add a policy for profiles to allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 10. Add a policy for profiles to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 11. Add a policy to allow profile creation on signup
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 12. Update the trigger to automatically create profiles with role for new users
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

-- 13. Allow authenticated users to read suburbs (if this table exists)
-- This is a safety check - only runs if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'suburbs') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Suburbs are viewable by everyone" ON public.suburbs';
    EXECUTE 'CREATE POLICY "Suburbs are viewable by everyone" ON public.suburbs FOR SELECT USING (true)';
  END IF;
END $$;
`;

async function applyMigration() {
  try {
    console.log('🚀 Starting RLS policy fix migration...');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [index, statement] of statements.entries()) {
      try {
        console.log(`⚡ Executing statement ${index + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`❌ Error in statement ${index + 1}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Statement ${index + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${index + 1}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('Your dashboard should now be able to load data properly.');
    } else {
      console.log('\n⚠️  Migration completed with some errors.');
      console.log('Some policies may not have been applied correctly.');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach using direct SQL execution
async function applyMigrationDirect() {
  try {
    console.log('🚀 Starting direct SQL execution...');
    
    const { data, error } = await supabase
      .from('_migrations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('📝 Executing SQL statements directly...');
      
      // Execute the migration in chunks
      const chunks = [
        // Profile creation and updates
        `
        INSERT INTO public.profiles (id, role, created_at, updated_at)
        SELECT id, 'customer'::text, now(), now()
        FROM auth.users
        WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id)
        ON CONFLICT (id) DO NOTHING;
        
        UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;
        `,
        
        // Services policy
        `
        DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
        CREATE POLICY "Services are viewable by everyone"
          ON public.services FOR SELECT USING (true);
        `,
        
        // Extras policy
        `
        DROP POLICY IF EXISTS "Extras are viewable by everyone" ON public.extras;
        CREATE POLICY "Extras are viewable by everyone"
          ON public.extras FOR SELECT USING (true);
        `,
        
        // Cleaners policy
        `
        DROP POLICY IF EXISTS "Cleaners are viewable by everyone" ON public.cleaners;
        CREATE POLICY "Cleaners are viewable by everyone"
          ON public.cleaners FOR SELECT USING (true);
        `,
        
        // Bookings policies
        `
        DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
        CREATE POLICY "Users can view their own bookings"
          ON public.bookings FOR SELECT USING (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
        CREATE POLICY "Users can create their own bookings"
          ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
          
        DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
        CREATE POLICY "Users can update their own bookings"
          ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
        `,
        
        // Profile policies
        `
        DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
        CREATE POLICY "Users can view own profile" ON public.profiles
          FOR SELECT USING (auth.uid() = id);
          
        DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
        CREATE POLICY "Users can update own profile" ON public.profiles
          FOR UPDATE USING (auth.uid() = id);
          
        DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
        CREATE POLICY "Users can insert own profile" ON public.profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
        `
      ];
      
      for (const [index, chunk] of chunks.entries()) {
        try {
          console.log(`⚡ Executing chunk ${index + 1}/${chunks.length}...`);
          // Note: This approach may not work with all Supabase setups
          // You might need to execute these manually in the Supabase SQL editor
          console.log(`SQL to execute manually in Supabase SQL editor:`);
          console.log(chunk);
          console.log('---');
        } catch (err) {
          console.error(`❌ Error in chunk ${index + 1}:`, err.message);
        }
      }
      
      console.log('\n📋 Manual Steps Required:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste each SQL chunk above');
      console.log('4. Execute each chunk separately');
      
    } else {
      console.log('✅ Database connection successful');
    }
    
  } catch (error) {
    console.error('💥 Direct execution failed:', error.message);
    console.log('\n📋 Manual Steps Required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL from supabase/migrations/20251012150000_fix_rls_policies.sql');
    console.log('4. Execute the SQL');
  }
}

// Main execution
if (require.main === module) {
  console.log('🔧 CleanFlow RLS Policy Fix Tool');
  console.log('================================');
  
  applyMigrationDirect();
}
