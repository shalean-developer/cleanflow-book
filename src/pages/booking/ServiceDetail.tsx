import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StickySummary } from '@/components/booking/StickySummary';
import { useBookingStore } from '@/store/bookingStore';
import { formatCurrencyZAR } from '@/utils/pricing';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/booking/service/select')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">{service.name}</CardTitle>
                  <CardDescription className="text-lg">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrencyZAR(Number(service.base_price))}
                    <span className="text-base text-muted-foreground font-normal"> starting from</span>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">What's included:</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleContinue} size="lg" className="w-full md:w-auto">
                    Continue to Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:block hidden">
              <StickySummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
