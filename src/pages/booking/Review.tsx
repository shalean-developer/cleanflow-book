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
import { Separator } from '@/components/ui/separator';
import { AuthModal } from '@/components/booking/AuthModal';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Review() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { booking, reset } = useBookingStore();
  const { toast } = useToast();
  const [paying, setPaying] = useState(false);

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
        bedrooms: booking.bedrooms,
        bathrooms: booking.bathrooms,
        extrasTotal,
        frequency: booking.frequency,
      })
    : null;

  const handlePayment = async () => {
    if (!user || !pricing || !paystackKey) return;

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
            pricing: pricing,
          },
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
                reset();
                navigate(`/booking/confirmation?ref=${response.reference}`);
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
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Review & Pay</h1>
              <p className="text-muted-foreground">Review your booking and complete payment</p>
            </div>

            {!user ? (
              <AuthModal />
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Service</div>
                        <div className="font-medium">{service?.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Date & Time</div>
                        <div className="font-medium">
                          {booking.date ? new Date(booking.date).toLocaleDateString() : ''} at {booking.time}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div className="font-medium text-sm">{booking.location}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Frequency</div>
                        <div className="font-medium capitalize">{booking.frequency.replace('-', ' ')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Rooms</div>
                        <div className="font-medium">{booking.bedrooms} bed, {booking.bathrooms} bath</div>
                      </div>
                      {booking.cleanerId && (
                        <div>
                          <div className="text-sm text-muted-foreground">Cleaner</div>
                          <div className="font-medium">
                            {booking.cleanerId === 'auto-match' ? 'Auto-matched by Shalean' : cleaner?.name}
                          </div>
                        </div>
                      )}
                    </div>

                    {extras && extras.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Extras</div>
                          {extras.map((extra) => (
                            <div key={extra.id} className="flex justify-between text-sm">
                              <span>{extra.name}</span>
                              <span>{formatCurrencyZAR(Number(extra.price))}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {booking.specialInstructions && (
                      <>
                        <Separator />
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Special Instructions</div>
                          <div className="text-sm">{booking.specialInstructions}</div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {pricing && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Price Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatCurrencyZAR(pricing.subtotal)}</span>
                      </div>
                      {pricing.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({booking.frequency})</span>
                          <span className="font-medium">-{formatCurrencyZAR(pricing.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span className="font-medium">{formatCurrencyZAR(pricing.fees)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-xl font-bold text-primary">
                        <span>Total</span>
                        <span>{formatCurrencyZAR(pricing.total)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handlePayment} size="lg" className="w-full" disabled={paying || !paystackKey}>
                  {paying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Pay {pricing ? formatCurrencyZAR(pricing.total) : ''}
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
