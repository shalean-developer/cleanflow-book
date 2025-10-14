/**
 * SAFE APP DATA CLEANUP SCRIPT
 * 
 * This script safely clears all problematic cookies and app data
 * that could be blocking your CleanFlow app functionality.
 * 
 * INSTRUCTIONS:
 * 1. Open your browser's Developer Tools (F12)
 * 2. Go to the Console tab
 * 3. Copy and paste this ENTIRE script
 * 4. Press Enter to run it
 * 5. Wait for completion message
 * 6. Refresh your page
 */

console.log('🧹 Starting SAFE CleanFlow app data cleanup...');
console.log('⚠️  This will clear authentication, booking, and session data');

// Confirm before proceeding
if (!confirm('This will clear all app data (auth, booking, sessions). Continue?')) {
  console.log('❌ Cleanup cancelled by user');
  exit;
}

let clearedItems = [];
let errors = [];

try {
  // 1. Clear Supabase Authentication Data (Most Important)
  console.log('🔐 Clearing Supabase authentication data...');
  const supabaseKeys = Object.keys(localStorage).filter(key => key.startsWith('sb-'));
  supabaseKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
      clearedItems.push(`Supabase: ${key}`);
      console.log(`✅ Cleared: ${key}`);
    } catch (error) {
      errors.push(`Failed to clear ${key}: ${error.message}`);
    }
  });

  // 2. Clear Booking Store Data
  console.log('📋 Clearing booking store data...');
  try {
    localStorage.removeItem('booking-storage');
    clearedItems.push('Booking Store');
    console.log('✅ Cleared: booking-storage');
  } catch (error) {
    errors.push(`Failed to clear booking store: ${error.message}`);
  }

  // 3. Clear Session Storage (Safe)
  console.log('🔄 Clearing session storage...');
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    try {
      sessionStorage.removeItem(key);
      clearedItems.push(`Session: ${key}`);
      console.log(`✅ Cleared session: ${key}`);
    } catch (error) {
      errors.push(`Failed to clear session ${key}: ${error.message}`);
    }
  });

  // 4. Clear any other app-related localStorage items
  console.log('🗂️ Checking for other app-related data...');
  const appKeys = [
    'promo_seen_standard20',
    'booking_session_id',
    'user_preferences',
    'app_settings'
  ];
  
  appKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      try {
        localStorage.removeItem(key);
        clearedItems.push(`App Data: ${key}`);
        console.log(`✅ Cleared: ${key}`);
      } catch (error) {
        errors.push(`Failed to clear ${key}: ${error.message}`);
      }
    }
  });

  // 5. Summary Report
  console.log('\n📊 CLEANUP SUMMARY:');
  console.log(`✅ Successfully cleared ${clearedItems.length} items:`);
  clearedItems.forEach(item => console.log(`   - ${item}`));
  
  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} errors encountered:`);
    errors.forEach(error => console.log(`   - ${error}`));
  }

  console.log('\n🎉 App data cleanup completed!');
  console.log('🔄 Please refresh the page to see the changes.');
  
  // Auto-refresh option
  if (confirm('Data cleared successfully! Refresh the page now?')) {
    window.location.reload();
  }

} catch (error) {
  console.error('❌ Critical error during cleanup:', error);
  console.log('💡 Try manually clearing browser cookies and site data.');
}
