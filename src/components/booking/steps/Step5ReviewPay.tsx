import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, User, Clock, Home, Sparkles, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Step5ReviewPayProps {
  onBack: () => void;
}

export const Step5ReviewPay = ({ onBack }: Step5ReviewPayProps) => {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { user } = useAuth();
  const { bookingData, resetBooking } = useBooking();
  const [processing, setProcessing] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      const returnUrl = `/booking/service/${serviceName || 'select'}/review`;
      navigate(`/auth?returnTo=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, navigate, serviceName]);

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Get the current user and profile
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

      if (priceError) throw priceError;

      // Validate client price matches server price
      const priceDifference = Math.abs(Number(serverPrice) - bookingData.totalAmount);
      if (priceDifference > 0.01) {
        throw new Error(`Price mismatch detected. Expected: R${Number(serverPrice).toFixed(2)}, Got: R${bookingData.totalAmount.toFixed(2)}`);
      }

      // Initialize Paystack payment
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'initialize-paystack-payment',
        {
          body: {
            email: userEmail,
            amount: bookingData.totalAmount,
            bookingData: {
              serviceId: bookingData.serviceId,
              serviceName: bookingData.serviceName,
              bedrooms: bookingData.bedrooms,
              bathrooms: bookingData.bathrooms,
              extras: bookingData.extras,
              date: bookingData.date?.toISOString().split('T')[0],
              time: bookingData.time,
              areaId: bookingData.areaId,
              areaName: bookingData.areaName,
              frequency: bookingData.frequency,
              cleanerId: bookingData.cleanerId,
              cleanerName: bookingData.cleanerName,
              specialInstructions: bookingData.specialInstructions,
            },
          },
        }
      );

      if (paymentError) {
        console.error('Payment initialization error:', paymentError);
        throw new Error('Failed to initialize payment');
      }

      if (!paymentData?.authorization_url) {
        throw new Error('Payment URL not received');
      }

      // Store booking reference in localStorage for confirmation page
      localStorage.setItem('paystack_reference', paymentData.reference);
      localStorage.setItem('booking_id', paymentData.booking_id);

      // Redirect to Paystack payment page
      window.location.href = paymentData.authorization_url;
      
    } catch (error: any) {
      console.error('Booking error:', error);
      const errorMessage = error?.message || 'Failed to initialize payment. Please try again.';
      toast.error(errorMessage);
    } finally {
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
