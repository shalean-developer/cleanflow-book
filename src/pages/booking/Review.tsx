import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/store/bookingStore';
import { calculatePricing, formatCurrencyZAR } from '@/utils/pricing';
import { initializePaystackPayment } from '@/lib/paystack';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthModal } from '@/components/booking/AuthModal';
import { OrderSummary } from '@/components/booking/OrderSummary';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { NewCustomerPromoModal } from '@/components/booking/NewCustomerPromoModal';
import { ServiceChangeValidator } from '@/components/booking/ServiceChangeValidator';

export default function Review() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { booking, reset, setPhoneNumber } = useBookingStore();
  const { toast } = useToast();
  const [paying, setPaying] = useState(false);
  const [phoneNumber, setPhoneNumberLocal] = useState(booking.phoneNumber || '');

  const { data: service } = useQuery({
    queryKey: ['service', booking.serviceId],
    queryFn: async () => {
      if (!booking.serviceId) return null;
      const { data } = await supabase.from('services').select('*').eq('id', booking.serviceId).maybeSingle();
      return data;
    },
    enabled: !!booking.serviceId,
  });

  const { data: extras } = useQuery({
    queryKey: ['extras', booking.extras],
    queryFn: async () => {
      if (!booking.extras.length) return [];
      const { data } = await supabase.from('extras').select('*').in('id', booking.extras);
      return data || [];
    },
    enabled: booking.extras.length > 0,
  });

  const { data: cleaner } = useQuery({
    queryKey: ['cleaner', booking.cleanerId],
    queryFn: async () => {
      if (!booking.cleanerId || booking.cleanerId === 'auto-match') return null;
      const { data } = await supabase.from('cleaners').select('*').eq('id', booking.cleanerId).maybeSingle();
      return data;
    },
    enabled: !!booking.cleanerId && booking.cleanerId !== 'auto-match',
  });

  const { data: paystackKey } = useQuery({
    queryKey: ['paystack-key'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('get-paystack-public-key');
      return data?.publicKey;
    },
  });

  useEffect(() => {
    if (!booking.serviceId || !booking.date || !booking.time || !booking.location) {
      navigate('/booking/service/select');
    }
  }, [booking, navigate]);

  const extrasTotal = extras?.reduce((sum, extra) => sum + Number(extra.price), 0) || 0;
  const pricing = service
    ? calculatePricing({
        basePrice: Number(service.base_price),
        bedroomPrice: Number(service.bedroom_price),
        bathroomPrice: Number(service.bathroom_price),
        serviceFeeRate: Number(service.service_fee_rate),
        bedrooms: booking.bedrooms,
        bathrooms: booking.bathrooms,
        extrasTotal,
        frequency: booking.frequency,
        promo: booking.promo,
      })
    : null;

  const handlePayment = async () => {
    if (!user || !pricing || !paystackKey) return;

    if (!phoneNumber.trim()) {
      toast({
        title: 'Phone Number Required',
        description: 'Please enter your phone number',
        variant: 'destructive',
      });
      return;
    }

    setPhoneNumber(phoneNumber);
    setPaying(true);
    try {
      const reference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const handler = initializePaystackPayment({
        key: paystackKey,
        email: user.email!,
        amount: Math.round(pricing.total * 100),
        currency: 'ZAR',
        ref: reference,
        metadata: {
          booking_data: {
            service_id: booking.serviceId,
            bedrooms: booking.bedrooms,
            bathrooms: booking.bathrooms,
            extras: booking.extras,
            date: booking.date,
            time: booking.time,
            frequency: booking.frequency,
            location: booking.location,
            special_instructions: booking.specialInstructions,
            cleaner_id: booking.cleanerId,
            phone_number: phoneNumber,
            pricing: pricing,
          },
          ...(booking.promo && {
            promo: {
              code: booking.promo.code,
              type: booking.promo.type,
              value: booking.promo.value,
              appliesTo: booking.promo.appliesTo,
              claimId: booking.promo.claimId,
            }
          }),
        },
        callback: (response: any) => {
          // Handle verification in a separate async function
          const verifyPayment = async () => {
            try {
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
                'verify-paystack-payment',
                { body: { reference: response.reference } }
              );

              if (verifyError) throw verifyError;

              if (verifyData.success) {
                navigate(`/booking/confirmation?reference=${response.reference}`);
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (error: any) {
              toast({
                title: 'Payment Error',
                description: error.message,
                variant: 'destructive',
              });
            } finally {
              setPaying(false);
            }
          };
          
          verifyPayment();
        },
        onClose: () => {
          setPaying(false);
          toast({
            title: 'Payment Cancelled',
            description: 'You cancelled the payment',
          });
        },
      });

      handler.openIframe();
    } catch (error: any) {
      setPaying(false);
      toast({
        title: 'Payment Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 text-[#475569] hover:text-[#0F172A] hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Section Header */}
          <div className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <h1 className="text-4xl font-bold text-[#0F172A] tracking-tight mb-3">Review & Pay</h1>
            <p className="text-[#475569] text-lg">Review your booking and complete payment</p>
            <div className="w-16 h-[3px] bg-[#0C53ED] mt-4 rounded-full"></div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Auth/Contact */}
            <div className="space-y-6">
              {!user ? (
                <AuthModal />
              ) : (
                <div className="space-y-6">
                  <Card className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 delay-160">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#0F172A]">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm font-medium text-[#0F172A]">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumberLocal(e.target.value)}
                          className="rounded-xl border-gray-200 bg-white placeholder-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:shadow-md transition-all"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Button */}
                  <Button 
                    onClick={handlePayment} 
                    size="lg" 
                    className="w-full rounded-full bg-[#0C53ED] text-white py-3.5 shadow-lg hover:bg-[#0B47D1] hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5" 
                    disabled={paying || !paystackKey}
                  >
                    {paying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue to Payment {pricing ? `• ${formatCurrencyZAR(pricing.total)}` : ''}
                  </Button>

                  {/* Back Link */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="w-full text-[#475569] hover:text-[#0F172A] hover:bg-gray-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:block">
              <OrderSummary
                service={service}
                extras={extras}
                cleaner={cleaner}
                booking={booking}
                pricing={pricing}
              />
            </div>
          </div>
        </div>
      </main>
      <ServiceChangeValidator />
      <NewCustomerPromoModal />
    </div>
  );
}
