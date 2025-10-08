import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Home, LayoutDashboard } from 'lucide-react';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'success';
  const [isSuccess] = useState(status === 'success');

  useEffect(() => {
    // Clear booking data from localStorage on successful payment
    if (isSuccess) {
      localStorage.removeItem('booking-data');
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {isSuccess ? (
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
              <h1 className="text-3xl font-bold">Payment Declined</h1>
              <p className="text-muted-foreground">
                Your payment could not be processed. Please try again or contact support.
              </p>
            </div>
          </>
        )}

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
      </Card>
    </div>
  );
};

export default BookingConfirmation;
