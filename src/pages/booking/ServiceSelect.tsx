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
    <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
<ServiceChangeValidator />
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Accent Bar */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mb-2 sm:mb-3">Choose Your Service</h1>
          <div className="w-12 sm:w-16 h-[2px] sm:h-[3px] bg-[#0C53ED] mb-3 sm:mb-4"></div>
          <p className="text-[#475569] text-base sm:text-lg">Select the cleaning service that fits your needs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[#0C53ED]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

          {/* Sticky Booking Summary - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              <StickySummary />
            </div>
          </div>
        </div>

        {/* Mobile Booking Summary */}
        <div className="lg:hidden mt-6 sm:mt-8">
          <StickySummary />
        </div>
      </div>
      <NewCustomerPromoModal />
    </div>
  );
}
