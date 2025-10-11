import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { StickySummary } from '@/components/booking/StickySummary';
import { useBookingStore } from '@/store/bookingStore';
import { formatCurrencyZAR } from '@/utils/pricing';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setService } = useBookingStore();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
      return data;
    },
  });

  const handleContinue = () => {
    if (service) {
      setService(service.id, service.name, service.slug);
      navigate('/booking/details');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Service not found</h1>
        <Button onClick={() => navigate('/booking/service/select')}>Back to Services</Button>
      </div>
    );
  }

  const features = [
    'Professional cleaning team',
    'Eco-friendly products',
    'Flexible scheduling',
    'Satisfaction guaranteed',
    'Insurance covered',
    'Background-checked staff',
  ];

  const isStandardCleaning = service.slug === 'standard-cleaning';

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section aria-label="Selected service" className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Back Link */}
          <div 
            className="animate-fade-up mb-6"
            style={{ animationDelay: '0ms', animationFillMode: 'both' }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/booking/service/select')} 
              className="p-2 text-[#475569] hover:text-[#0F172A] hover:underline focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Service Detail Card */}
            <div 
              className="lg:col-span-2 animate-fade-up"
              style={{ animationDelay: '80ms', animationFillMode: 'both' }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:ring-2 hover:ring-[#0C53ED]/10 transition-all duration-300 p-6 md:p-8">
                {/* Top Row: Service Name with Accent */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-[#0F172A] tracking-tight mb-2">
                    {service.name}
                  </h1>
                  <div className="w-16 h-[3px] bg-[#0C53ED] mb-4"></div>
                  <p className="text-[#475569] text-lg max-w-[60ch] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price Block */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-[#0F172A] tabular-nums">
                      {formatCurrencyZAR(Number(service.base_price))}
                    </span>
                    <span className="text-sm text-[#475569]">starting from</span>
                  </div>
                  {isStandardCleaning && (
                    <div className="inline-flex items-center px-3 py-1 text-xs font-medium text-[#0C53ED] bg-[#0C53ED]/10 rounded-full">
                      Most Popular
                    </div>
                  )}
                </div>

                {/* What's included */}
                <div className="mb-8">
                  <h2 className="font-semibold text-[#0F172A] mb-4">What's included:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                        <span className="text-[#475569] leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={handleContinue}
                  className="w-full md:w-auto rounded-full bg-[#0C53ED] text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                  size="lg"
                  aria-label={`Continue to details for ${service.name}`}
                >
                  Continue to Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Booking Summary */}
            <div 
              className="lg:block hidden animate-fade-up"
              style={{ animationDelay: '160ms', animationFillMode: 'both' }}
            >
              <div className="sticky top-6">
                <StickySummary />
              </div>
            </div>
          </div>

          {/* Mobile Booking Summary */}
          <div 
            className="lg:hidden mt-8 animate-fade-up"
            style={{ animationDelay: '160ms', animationFillMode: 'both' }}
          >
            <StickySummary />
          </div>
        </section>
      </main>
    </div>
  );
}
