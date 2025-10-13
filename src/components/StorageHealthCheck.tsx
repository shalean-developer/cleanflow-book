import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { clearAppStorage } from '@/utils/storageUtils';

interface StorageHealth {
  localStorage: boolean;
  sessionStorage: boolean;
  supabaseAuth: boolean;
  bookingStore: boolean;
}

export function StorageHealthCheck() {
  const [health, setHealth] = useState<StorageHealth | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showFix, setShowFix] = useState(false);

  const checkStorageHealth = () => {
    setIsChecking(true);
    
    const healthCheck: StorageHealth = {
      localStorage: true,
      sessionStorage: true,
      supabaseAuth: true,
      bookingStore: true,
    };

    try {
      // Test localStorage
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (error) {
      healthCheck.localStorage = false;
    }

    try {
      // Test sessionStorage
      const testKey = '__session_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
    } catch (error) {
      healthCheck.sessionStorage = false;
    }

    try {
      // Check for corrupted Supabase auth data
      const supabaseKeys = Object.keys(localStorage).filter(key => key.startsWith('sb-'));
      for (const key of supabaseKeys) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            JSON.parse(data); // Try to parse as JSON
          }
        } catch (error) {
          healthCheck.supabaseAuth = false;
          break;
        }
      }
    } catch (error) {
      healthCheck.supabaseAuth = false;
    }

    try {
      // Check booking store data
      const bookingData = localStorage.getItem('booking-storage');
      if (bookingData) {
        JSON.parse(bookingData);
      }
    } catch (error) {
      healthCheck.bookingStore = false;
    }

    setHealth(healthCheck);
    setIsChecking(false);
    setShowFix(!Object.values(healthCheck).every(status => status));
  };

  const handleFixStorage = async () => {
    await clearAppStorage();
    window.location.reload();
  };

  useEffect(() => {
    checkStorageHealth();
  }, []);

  if (isChecking) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Checking storage health...</AlertDescription>
      </Alert>
    );
  }

  if (!health) return null;

  const allHealthy = Object.values(health).every(status => status);

  if (allHealthy) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Storage is healthy - no issues detected
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-red-200 bg-red-50">
      <XCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="space-y-2">
          <div>Storage issues detected:</div>
          <ul className="text-sm list-disc list-inside space-y-1">
            {!health.localStorage && <li>LocalStorage is corrupted</li>}
            {!health.sessionStorage && <li>SessionStorage is corrupted</li>}
            {!health.supabaseAuth && <li>Authentication data is corrupted</li>}
            {!health.bookingStore && <li>Booking data is corrupted</li>}
          </ul>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={handleFixStorage}
            className="mt-2"
          >
            Fix Storage Issues
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
