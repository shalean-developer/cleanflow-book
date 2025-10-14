// Test script to check cleaners table access
import { createClient } from '@supabase/supabase-js';

// You'll need to replace these with your actual values
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCleanersAccess() {
  console.log('Testing cleaners table access...');
  
  try {
    // Test 1: Simple count query
    const { count, error: countError } = await supabase
      .from('cleaners')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count error:', countError);
    } else {
      console.log('✅ Total cleaners count:', count);
    }
    
    // Test 2: Simple select query
    const { data, error } = await supabase
      .from('cleaners')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Select error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Cleaners data:', data);
      console.log('✅ Number of cleaners:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('✅ Sample cleaner:', data[0]);
        console.log('✅ Available fields:', Object.keys(data[0]));
      }
    }
    
    // Test 3: Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'cleaners' });
    
    if (tableError) {
      console.log('Could not get table structure:', tableError.message);
    } else {
      console.log('✅ Table structure:', tableInfo);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testCleanersAccess();
