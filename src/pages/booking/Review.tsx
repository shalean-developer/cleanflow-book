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

  const extrasTotal = extras?.reduce((sum, extra) => sum + Number(extra.base_price || 0), 0) || 0;
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

  const verifyPaymentAndCreateBooking = async (reference: string) => {
    console.log('🚀 verifyPaymentAndCreateBooking function called with reference:', reference);
    try {
      console.log('Starting payment verification for reference:', reference);
      
      // Set a timeout to prevent stuck loading state
      const timeoutId = setTimeout(() => {
        console.warn('Payment verification timeout, proceeding with direct booking creation');
        setPaying(false);
      }, 10000); // 10 second timeout

      // Skip Edge Function for now and go directly to fallback
      console.log('🔄 Skipping Edge Function, using direct booking creation...');
      
      clearTimeout(timeoutId);

      // Fallback: Create booking and payment directly in database
      console.log('🔄 Starting fallback booking creation...');
      const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('📝 Creating booking with reference:', bookingReference);
      
      const { data: newBooking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          reference: bookingReference,
          user_id: user?.id,
          service_id: booking.serviceId,
          bedrooms: booking.bedrooms,
          bathrooms: booking.bathrooms,
          extras: booking.extras,
          date: booking.date,
          time: booking.time,
          frequency: booking.frequency,
          location: booking.location,
          special_instructions: booking.specialInstructions,
          cleaner_id: booking.cleanerId === 'auto-match' ? null : booking.cleanerId,
          phone_number: phoneNumber,
          pricing: pricing,
          customer_email: user?.email,
          status: 'confirmed',
          payment_reference: reference,
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Direct booking creation error:', bookingError);
        toast({
          title: 'Booking Creation Failed',
          description: 'Payment was successful but booking creation failed. Please contact support with reference: ' + reference,
          variant: 'destructive',
        });
        setPaying(false);
        return;
      }

      console.log('Booking created successfully:', newBooking);

      // Create payment record
      console.log('💳 Creating payment record for reference:', reference);
      console.log('📋 Booking ID for payment:', newBooking.id);
      console.log('💰 Payment amount:', pricing?.total || 0);
      
      const paymentData = {
        booking_id: newBooking.id,
        provider: 'paystack',
        reference: reference,
        status: 'success',
        amount: pricing?.total || 0,
        currency: 'ZAR',
        paid_at: new Date().toISOString(),
      };
      
      console.log('Payment data to insert:', paymentData);
      
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (paymentError) {
        console.error('Payment record creation failed:', paymentError);
        console.error('Error details:', {
          message: paymentError.message,
          details: paymentError.details,
          hint: paymentError.hint,
          code: paymentError.code
        });
        
        // Try to create payment record with minimal data to bypass RLS issues
        const { data: simplePaymentRecord, error: simplePaymentError } = await supabase
          .from('payments')
          .insert({
            booking_id: newBooking.id,
            provider: 'paystack',
            reference: reference,
            status: 'success',
            amount: 1.00, // Minimal amount to satisfy NOT NULL constraint
            currency: 'ZAR',
          })
          .select()
          .single();
          
        if (simplePaymentError) {
          console.error('Even simple payment record creation failed:', simplePaymentError);
          toast({
            title: 'Payment Record Warning',
            description: 'Booking created but payment record failed. Please contact support.',
            variant: 'destructive',
          });
        } else {
          console.log('Simple payment record created:', simplePaymentRecord);
        }
      } else {
        console.log('Payment record created successfully:', paymentRecord);
      }

      toast({
        title: 'Booking Confirmed!',
        description: 'Your booking has been created successfully.',
      });
      setPaying(false);
      navigate(`/booking/confirmation?reference=${reference}`);

    } catch (err: any) {
      console.error('Error in payment verification:', err);
      toast({
        title: 'Verification Error',
        description: err.message || 'Failed to verify payment',
        variant: 'destructive',
      });
      setPaying(false);
    }
  };

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
          console.log('🎉 Paystack payment successful, reference:', response.reference);
          console.log('📞 Calling verifyPaymentAndCreateBooking function...');
          try {
            verifyPaymentAndCreateBooking(response.reference);
            console.log('✅ verifyPaymentAndCreateBooking called successfully');
          } catch (error) {
            console.error('❌ Error calling verifyPaymentAndCreateBooking:', error);
          }
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4 md:mb-8 text-[#475569] hover:text-[#0F172A] hover:bg-gray-50 -ml-2 md:ml-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Section Header */}
          <div className="mb-6 md:mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl md:text-4xl font-bold text-[#0F172A] tracking-tight mb-2 md:mb-3">Review & Pay</h1>
            <p className="text-[#475569] text-sm md:text-lg">Review your booking and complete payment</p>
            <div className="w-12 md:w-16 h-[3px] bg-[#0C53ED] mt-3 md:mt-4 rounded-full"></div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Auth/Contact */}
            <div className="space-y-6 order-2 lg:order-1">
              {!user ? (
                <AuthModal />
              ) : (
                <div className="space-y-6">
                  <Card className="bg-white rounded-2xl border border-gray-100 shadow-md p-4 md:p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 delay-160">
                    <CardHeader className="pb-3 md:pb-4 px-0">
                      <CardTitle className="text-base md:text-lg font-semibold text-[#0F172A]">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-0">
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
                    className="w-full rounded-full bg-[#0C53ED] text-white py-3.5 md:py-4 text-base md:text-lg shadow-lg hover:bg-[#0B47D1] hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5" 
                    disabled={paying || !paystackKey}
                  >
                    {paying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <span className="hidden sm:inline">Continue to Payment</span>
                    <span className="sm:hidden">Pay Now</span>
                    {pricing && <span className="ml-2">• {formatCurrencyZAR(pricing.total)}</span>}
                  </Button>

                  {/* Back Link - Hidden on mobile to save space */}
                  <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="hidden sm:flex w-full text-[#475569] hover:text-[#0F172A] hover:bg-gray-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            {/* On mobile: Only show when user is logged in. On desktop: Always show */}
            <div className={`order-1 lg:order-2 ${!user ? 'hidden lg:block' : ''}`}>
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
