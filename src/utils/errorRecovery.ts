/**
 * Error Recovery Utilities
 * 
 * These utilities help automatically recover from common app errors
 * that could affect any user.
 */

export const handleAuthError = async (error: any) => {
  console.warn('Authentication error detected, attempting recovery...', error);
  
  try {
    // Clear potentially corrupted auth data
    const supabaseKeys = Object.keys(localStorage).filter(key => key.startsWith('sb-'));
    supabaseKeys.forEach(key => localStorage.removeItem(key));
    
    // Clear session storage
    sessionStorage.clear();
    
    console.log('✅ Auth error recovery completed');
    return true;
  } catch (recoveryError) {
    console.error('❌ Auth error recovery failed:', recoveryError);
    return false;
  }
};

export const handleStorageError = async (error: any) => {
  console.warn('Storage error detected, attempting recovery...', error);
  
  try {
    // Clear booking store if corrupted
    try {
      const bookingData = localStorage.getItem('booking-storage');
      if (bookingData) {
        JSON.parse(bookingData);
      }
    } catch {
      localStorage.removeItem('booking-storage');
      console.log('✅ Cleared corrupted booking store');
    }
    
    // Clear session storage
    sessionStorage.clear();
    
    console.log('✅ Storage error recovery completed');
    return true;
  } catch (recoveryError) {
    console.error('❌ Storage error recovery failed:', recoveryError);
    return false;
  }
};

export const handlePaymentError = async (error: any) => {
  console.warn('Payment error detected, attempting recovery...', error);
  
  try {
    // Clear any payment-related session data
    const paymentKeys = [
      'payment_session',
      'booking_session_id',
      'promo_seen_standard20'
    ];
    
    paymentKeys.forEach(key => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });
    
    console.log('✅ Payment error recovery completed');
    return true;
  } catch (recoveryError) {
    console.error('❌ Payment error recovery failed:', recoveryError);
    return false;
  }
};

export const handleGenericError = async (error: any, context: string) => {
  console.warn(`Generic error in ${context}, attempting recovery...`, error);
  
  try {
    // Clear all app-related storage as last resort
    const appKeys = [
      'booking-storage',
      'promo_seen_standard20',
      'user_preferences'
    ];
    
    appKeys.forEach(key => localStorage.removeItem(key));
    sessionStorage.clear();
    
    console.log(`✅ Generic error recovery completed for ${context}`);
    return true;
  } catch (recoveryError) {
    console.error(`❌ Generic error recovery failed for ${context}:`, recoveryError);
    return false;
  }
};
