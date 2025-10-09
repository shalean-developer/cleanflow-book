import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, User, Clock, Home, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { initializePaystackPayment } from '@/lib/paystack';

interface Step5ReviewPayProps {
  onBack: () => void;
}

export const Step5ReviewPay = ({ onBack }: Step5ReviewPayProps) => {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { user } = useAuth();
  const { bookingData, resetBooking } = useBooking();
  const [processing, setProcessing] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState<string>('');

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      const returnUrl = `/booking/service/${serviceName || 'select'}/review`;
      navigate(`/auth?returnTo=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, navigate, serviceName]);

  // Fetch Paystack public key
  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-paystack-public-key');
        if (error) throw error;
        if (data?.publicKey) {
          setPaystackPublicKey(data.publicKey);
        }
      } catch (error) {
        console.error('Error fetching Paystack public key:', error);
        toast.error('Failed to load payment configuration');
      }
    };
    fetchPublicKey();
  }, []);

  const handlePayment = async () => {
    if (!paystackPublicKey) {
      toast.error('Payment system not ready. Please try again.');
      return;
    }

    setProcessing(true);
    
    try {
      // Get the current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to create a booking');
      }

      // Get user email
      const userEmail = currentUser.email || currentUser.user_metadata?.email;
      if (!userEmail) {
        throw new Error('User email not found');
      }

      // Server-side price validation
      const extraIds = bookingData.extras.map(e => e.id);
      const { data: serverPrice, error: priceError } = await supabase
        .rpc('calculate_booking_price', {
          p_bedrooms: bookingData.bedrooms,
          p_bathrooms: bookingData.bathrooms,
          p_extra_ids: extraIds.length > 0 ? extraIds : null,
        });

      if (priceError) {
        console.error('Price calculation error:', priceError);
        throw priceError;
      }

      // Validate client price matches server price
      const priceDifference = Math.abs(Number(serverPrice) - bookingData.totalAmount);
      if (priceDifference > 0.01) {
        throw new Error(`Price mismatch detected. Expected: R${Number(serverPrice).toFixed(2)}, Got: R${bookingData.totalAmount.toFixed(2)}`);
      }

      // Generate unique reference
      const reference = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create pending booking first
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: currentUser.id,
          service_id: bookingData.serviceId,
          area_id: bookingData.areaId,
          cleaner_id: bookingData.cleanerId,
          date: bookingData.date?.toISOString().split('T')[0],
          time: bookingData.time,
          bedrooms: bookingData.bedrooms,
          bathrooms: bookingData.bathrooms,
          frequency: bookingData.frequency,
          special_instructions: bookingData.specialInstructions,
          house_details: bookingData.houseDetails,
          total_amount: bookingData.totalAmount,
          status: 'pending',
          currency: 'ZAR',
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw new Error('Failed to create booking');
      }

      // Add booking extras
      if (bookingData.extras.length > 0) {
        const bookingExtras = bookingData.extras.map(extra => ({
          booking_id: booking.id,
          extra_id: extra.id,
          quantity: 1,
        }));

        const { error: extrasError } = await supabase
          .from('booking_extras')
          .insert(bookingExtras);

        if (extrasError) {
          console.error('Extras creation error:', extrasError);
        }
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: booking.id,
          amount: bookingData.totalAmount,
          currency: 'ZAR',
          provider: 'paystack',
          status: 'pending',
          reference: reference,
        });

      if (paymentError) {
        console.error('Payment record error:', paymentError);
      }

      // Convert amount to kobo (Paystack uses smallest currency unit - cents for ZAR)
      const amountInCents = Math.round(bookingData.totalAmount * 100);

      // Initialize Paystack popup
      const handlePaymentSuccess = async (response: { reference: string }) => {
        console.log('Payment successful:', response);
        
        try {
          // Update booking status to confirmed
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ 
              status: 'confirmed',
              payment_reference: response.reference,
            })
            .eq('id', booking.id);

          if (updateError) {
            console.error('Error updating booking:', updateError);
          }

          // Update payment status
          await supabase
            .from('payments')
            .update({ 
              status: 'success',
              paid_at: new Date().toISOString(),
            })
            .eq('reference', reference);

          // Clear booking data
          resetBooking();
          localStorage.removeItem('booking-data');
          
          toast.success('Payment successful! Your booking is confirmed.');
          navigate(`/booking/confirmation?reference=${response.reference}`);
        } catch (error) {
          console.error('Error processing payment:', error);
          toast.error('Payment successful but booking update failed. Please contact support.');
        }
      };

      const handlePaymentClose = () => {
        console.log('Payment popup closed');
        toast.info('Payment cancelled. Your booking is saved as pending.');
        setProcessing(false);
      };

      const paystack = initializePaystackPayment({
        key: paystackPublicKey,
        email: userEmail,
        amount: amountInCents,
        currency: 'ZAR',
        ref: reference,
        metadata: {
          booking_id: booking.id,
          user_id: currentUser.id,
          service_name: bookingData.serviceName,
        },
        callback: (response) => {
          handlePaymentSuccess(response);
        },
        onClose: handlePaymentClose,
      });

      // Open payment popup
      paystack.openIframe();
      
    } catch (error: any) {
      console.error('Booking error:', error);
      const errorMessage = error?.message || 'Failed to initialize payment. Please try again.';
      toast.error(errorMessage);
      setProcessing(false);
    }
  };

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Review & Pay</h2>
        <p className="text-muted-foreground">Confirm your booking details and complete your reservation</p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Service Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{bookingData.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property</span>
              <span className="font-medium">
                {bookingData.bedrooms} Bedrooms, {bookingData.bathrooms} Bathrooms
              </span>
            </div>
            {bookingData.extras.length > 0 && (
              <div>
                <div className="text-muted-foreground mb-1">Extras</div>
                <div className="pl-4 space-y-1">
                  {bookingData.extras.map((extra) => (
                    <div key={extra.id} className="flex justify-between">
                      <span>• {extra.name}</span>
                      <span>R {extra.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schedule</h3>
          <div className="space-y-3">
            {bookingData.date && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{format(bookingData.date, 'PPPP')}</span>
              </div>
            )}
            {bookingData.time && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span>{bookingData.time}</span>
              </div>
            )}
            {bookingData.areaName && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{bookingData.areaName}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-primary" />
              <span className="capitalize">{bookingData.frequency} cleaning</span>
            </div>
          </div>
        </div>

        {bookingData.cleanerName && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Your Cleaner</h3>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <span>{bookingData.cleanerName}</span>
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>Total</span>
            <span className="text-primary">R {bookingData.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={processing}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={handlePayment}
          disabled={processing}
          className="min-w-[200px]"
        >
          {processing ? 'Processing...' : 'Confirm & Pay'}
        </Button>
      </div>
    </div>
  );
};
