/**
 * Manual Storage Cleanup Script
 * 
 * Run this script in your browser console to clear all app-related storage data
 * when the app is not working properly due to corrupted cookies/storage.
 * 
 * Usage:
 * 1. Open your browser's Developer Tools (F12)
 * 2. Go to the Console tab
 * 3. Copy and paste this entire script
 * 4. Press Enter to run it
 */

console.log('🧹 Starting storage cleanup...');

try {
  // Clear localStorage items related to the app
  const keysToRemove = [
    'sb-', // Supabase auth tokens (they start with 'sb-')
    'booking-storage', // Zustand booking store
  ];
  
  // Remove specific keys
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Removed: ${key}`);
    }
  });
  
  // Remove all keys that start with 'sb-' (Supabase tokens)
  const supabaseKeys = Object.keys(localStorage).filter(key => key.startsWith('sb-'));
  supabaseKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removed Supabase key: ${key}`);
  });
  
  // Clear session storage
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    sessionStorage.removeItem(key);
    console.log(`✅ Removed session key: ${key}`);
  });
  
  console.log('✅ Storage cleanup completed successfully!');
  console.log('🔄 Please refresh the page to see the changes.');
  
  // Ask if user wants to refresh
  if (confirm('Storage cleared! Would you like to refresh the page now?')) {
    window.location.reload();
  }
  
} catch (error) {
  console.error('❌ Error during storage cleanup:', error);
  console.log('💡 Try manually clearing cookies and site data from browser settings.');
}
