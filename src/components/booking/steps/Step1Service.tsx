import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step1ServiceProps {
  onNext: () => void;
}

export const Step1Service = ({ onNext }: Step1ServiceProps) => {
  const { bookingData, updateBooking } = useBooking();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('active', true);
    
    if (data) setServices(data);
    setLoading(false);
  };

  const handleServiceSelect = (service: any) => {
    updateBooking({
      serviceId: service.id,
      serviceName: service.name,
    });
  };

  const canProceed = bookingData.serviceId;

  if (loading) {
    return <div className="text-center py-12">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Service</h2>
        <p className="text-muted-foreground">Select the cleaning service that suits your needs</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {services.map((service) => (
          <Card
            key={service.id}
            className={cn(
              'p-6 cursor-pointer transition-all hover:shadow-lg',
              bookingData.serviceId === service.id && 'ring-2 ring-primary bg-primary/5'
            )}
            onClick={() => handleServiceSelect(service)}
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canProceed}
          className="min-w-[200px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
