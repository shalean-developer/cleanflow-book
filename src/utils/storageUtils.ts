/**
 * Storage utility functions to manage app data
 */

export const clearAppStorage = () => {
  try {
    // Clear localStorage items related to the app
    const keysToRemove = [
      'sb-', // Supabase auth tokens (they start with 'sb-')
      'booking-storage', // Zustand booking store
    ];
    
    // Remove specific keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Remove all keys that start with 'sb-' (Supabase tokens)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage
    sessionStorage.clear();
    
    console.log('✅ App storage cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
};

export const clearSupabaseAuth = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    await supabase.auth.signOut();
    console.log('✅ Supabase auth cleared');
  } catch (error) {
    console.error('❌ Error clearing Supabase auth:', error);
  }
};

export const resetBookingStore = () => {
  try {
    // Clear booking store from localStorage
    localStorage.removeItem('booking-storage');
    console.log('✅ Booking store cleared');
  } catch (error) {
    console.error('❌ Error clearing booking store:', error);
  }
};

export const clearAllAppData = async () => {
  await clearSupabaseAuth();
  clearAppStorage();
  resetBookingStore();
  
  // Reload the page to reset all state
  window.location.reload();
};
