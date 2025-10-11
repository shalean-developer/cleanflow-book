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
        {/* Section Header with Accent Bar */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-3">Choose Your Service</h1>
          <div className="w-16 h-[3px] bg-[#0C53ED] mb-4"></div>
          <p className="text-[#475569] text-lg">Select the cleaning service that fits your needs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#0C53ED]" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services?.map((service, index) => (
                  <div
                    key={service.id}
                    className="animate-fade-up"
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <ServiceCard
                      slug={service.slug}
                      name={service.name}
                      description={service.description || ''}
                      basePrice={Number(service.base_price)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Booking Summary */}
          <div className="lg:block hidden">
            <div className="sticky top-4">
              <StickySummary />
            </div>
          </div>
        </div>

        {/* Mobile Booking Summary */}
        <div className="lg:hidden mt-8">
          <StickySummary />
        </div>
      </div>
      <NewCustomerPromoModal />
    </div>
  );
}
