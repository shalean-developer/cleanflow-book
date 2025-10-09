import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Home, LayoutDashboard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('failed');
        return;
      }

      setVerifying(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
          body: { reference },
        });

        if (error || !data?.success) {
          console.error('Payment verification error:', error || data);
          setStatus('failed');
          toast.error('Payment verification failed');
        } else {
          setStatus('success');
          localStorage.removeItem('booking-data');
          localStorage.removeItem('paystack_reference');
          localStorage.removeItem('booking_id');
          toast.success('Payment verified successfully!');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('failed');
        toast.error('Failed to verify payment');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {status === 'loading' ? (
          <>
            <div className="flex justify-center">
              <Loader2 className="h-20 w-20 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Verifying Payment...</h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment.
              </p>
            </div>
          </>
        ) : status === 'success' ? (
          <>
            <div className="flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-primary animate-in zoom-in duration-300" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Your booking has been confirmed. We'll send you a confirmation email shortly.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <XCircle className="h-20 w-20 text-destructive animate-in zoom-in duration-300" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Payment Failed</h1>
              <p className="text-muted-foreground">
                Your payment could not be processed. Please try again or contact support.
              </p>
            </div>
          </>
        )}

        {status !== 'loading' && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookingConfirmation;
