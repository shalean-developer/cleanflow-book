import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { clearAppStorage, clearSupabaseAuth, resetBookingStore, clearAllAppData } from '@/utils/storageUtils';

export function StorageManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleClearStorage = async (type: 'auth' | 'booking' | 'all') => {
    setIsLoading(true);
    setMessage('');

    try {
      switch (type) {
        case 'auth':
          await clearSupabaseAuth();
          setMessage('Authentication data cleared successfully');
          break;
        case 'booking':
          resetBookingStore();
          setMessage('Booking data cleared successfully');
          break;
        case 'all':
          await clearAllAppData();
          setMessage('All app data cleared. Page will reload...');
          break;
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Storage Manager
        </CardTitle>
        <CardDescription>
          Clear corrupted storage data that might be causing app issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            If your app is not working properly, try clearing the storage data below.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => handleClearStorage('auth')}
            disabled={isLoading}
            className="w-full justify-start"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Authentication Data
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleClearStorage('booking')}
            disabled={isLoading}
            className="w-full justify-start"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Booking Data
          </Button>
          
          <Button
            variant="destructive"
            onClick={() => handleClearStorage('all')}
            disabled={isLoading}
            className="w-full justify-start"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear All & Reload
          </Button>
        </div>

        {message && (
          <Alert className={message.includes('Error') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
