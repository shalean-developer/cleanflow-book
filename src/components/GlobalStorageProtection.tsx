import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Global Storage Protection Component
 * 
 * This component automatically protects all users from storage corruption issues
 * by implementing proactive cleanup and error recovery.
 */
export function GlobalStorageProtection() {
  useEffect(() => {
    // Run storage health check on app startup
    const checkAndFixStorage = () => {
      try {
        // Check for corrupted Supabase auth data
        const supabaseKeys = Object.keys(localStorage).filter(key => key.startsWith('sb-'));
        let hasCorruptedAuth = false;

        for (const key of supabaseKeys) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              JSON.parse(data); // Test if data is valid JSON
            }
          } catch (error) {
            console.warn(`Corrupted auth data detected in ${key}, clearing...`);
            localStorage.removeItem(key);
            hasCorruptedAuth = true;
          }
        }

        // Check booking store
        try {
          const bookingData = localStorage.getItem('booking-storage');
          if (bookingData) {
            JSON.parse(bookingData);
          }
        } catch (error) {
          console.warn('Corrupted booking data detected, clearing...');
          localStorage.removeItem('booking-storage');
        }

        // If auth data was corrupted, sign out user to prevent auth loops
        if (hasCorruptedAuth) {
          console.log('Auth data was corrupted, signing out user...');
          supabase.auth.signOut();
        }

      } catch (error) {
        console.error('Error during storage health check:', error);
      }
    };

    // Run check on mount
    checkAndFixStorage();

    // Run check periodically (every 5 minutes)
    const interval = setInterval(checkAndFixStorage, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}
