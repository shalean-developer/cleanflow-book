// Test script to verify cleaner view functionality
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCleanerData() {
  console.log('Testing cleaner data loading...');
  
  try {
    // Test 1: Check if cleaners table exists and has data
    const { data: cleaners, error: cleanersError } = await supabase
      .from('cleaners')
      .select('*')
      .order('rating', { ascending: false });
    
    if (cleanersError) {
      console.error('Error fetching cleaners:', cleanersError);
      return;
    }
    
    console.log('✅ Cleaners loaded successfully:', cleaners?.length || 0, 'cleaners found');
    
    if (cleaners && cleaners.length > 0) {
      console.log('Sample cleaner data:', cleaners[0]);
    } else {
      console.log('⚠️ No cleaners found in database');
    }
    
    // Test 2: Check if RLS policies allow public access
    const { data: publicCleaners, error: publicError } = await supabase
      .from('cleaners')
      .select('id, name, rating, active')
      .eq('active', true);
    
    if (publicError) {
      console.error('Error with public access:', publicError);
    } else {
      console.log('✅ Public access works:', publicCleaners?.length || 0, 'active cleaners');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testCleanerData();
