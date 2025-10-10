import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { StickySummary } from '@/components/booking/StickySummary';
import { Loader2 } from 'lucide-react';
import { NewCustomerPromoModal } from '@/components/booking/NewCustomerPromoModal';
import { ServiceChangeValidator } from '@/components/booking/ServiceChangeValidator';

export default function ServiceSelect() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await supabase.from('services').select('*').order('base_price');
      return data || [];
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ServiceChangeValidator />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Service</h1>
          <p className="text-muted-foreground">Select the cleaning service that fits your needs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {services?.map((service) => (
                  <ServiceCard
                    key={service.id}
                    slug={service.slug}
                    name={service.name}
                    description={service.description || ''}
                    basePrice={Number(service.base_price)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:block hidden">
            <StickySummary />
          </div>
        </div>
      </div>
      <NewCustomerPromoModal />
    </div>
  );
}
