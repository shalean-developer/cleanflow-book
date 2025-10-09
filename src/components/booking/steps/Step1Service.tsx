import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
interface Step1ServiceProps {
  onNext: () => void;
}
export const Step1Service = ({
  onNext
}: Step1ServiceProps) => {
  const navigate = useNavigate();
  const {
    bookingData,
    updateBooking
  } = useBooking();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const abortController = new AbortController();
    fetchServices(abortController);
    
    return () => {
      abortController.abort();
    };
  }, []);
  
  const fetchServices = async (abortController?: AbortController) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[Step1Service] Starting to fetch services...');
      console.log('[Step1Service] Supabase client initialized:', !!supabase);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });
      
      // Race between the query and timeout
      const queryPromise = supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .abortSignal(abortController?.signal);
      
      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as any;
      
      console.log('[Step1Service] Query completed successfully');
      console.log('[Step1Service] Data received:', data);
      console.log('[Step1Service] Error:', error);
      
      if (error) {
        console.error('[Step1Service] Supabase error:', error);
        setError(`Failed to load services: ${error.message}`);
        return;
      }
      
      if (!data || data.length === 0) {
        console.warn('[Step1Service] No active services found in database');
        setError('No services available at the moment. Please try again later.');
        return;
      }
      
      console.log('[Step1Service] Successfully loaded', data.length, 'services');
      setServices(data);
    } catch (err: any) {
      if (err?.name === 'AbortError' || abortController?.signal.aborted) {
        console.log('[Step1Service] Request cancelled');
        return;
      }
      console.error('[Step1Service] Unexpected error:', err);
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      if (!abortController?.signal.aborted) {
        setLoading(false);
      }
    }
  };
  const handleRetry = () => {
    const abortController = new AbortController();
    fetchServices(abortController);
  };

  const handleServiceSelect = (service: any) => {
    updateBooking({
      serviceId: service.id,
      serviceName: service.name
    });
    
    // Create URL-friendly slug from service name
    const serviceSlug = service.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Navigate to the property step with service name in URL
    navigate(`/booking/service/${serviceSlug}/property`);
  };
  const canProceed = bookingData.serviceId;
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <p className="text-muted-foreground">No services available at the moment.</p>
        <Button onClick={handleRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }
  return <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Service</h2>
        <p className="text-muted-foreground">Select the cleaning service that suits your needs</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {services.map(service => <Card key={service.id} className={cn('p-6 cursor-pointer transition-all hover:shadow-lg', bookingData.serviceId === service.id && 'ring-2 ring-primary bg-primary/5')} onClick={() => handleServiceSelect(service)}>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          </Card>)}
      </div>

      <div className="flex justify-center pt-4">
        
      </div>
    </div>;
};