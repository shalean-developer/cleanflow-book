import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Home } from 'lucide-react';
import { formatCurrencyZAR } from '@/utils/pricing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Confirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('ref');

  const { data: booking } = useQuery({
    queryKey: ['booking', reference],
    queryFn: async () => {
      if (!reference) return null;
      const { data } = await supabase
        .from('bookings')
        .select('*, services(name), cleaners(name)')
        .eq('payment_reference', reference)
        .maybeSingle();
      return data;
    },
    enabled: !!reference,
  });

  useEffect(() => {
    if (!reference) {
      navigate('/');
    }
  }, [reference, navigate]);

  const pricing = booking?.pricing as any;
  const bookingWithAmount = booking as any;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your cleaning service has been successfully booked
            </p>
          </div>

          {booking && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Reference</div>
                    <div className="font-medium">{booking.reference}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Service</div>
                    <div className="font-medium">{booking.services?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="font-medium">{booking.time}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium text-sm">{booking.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Cleaner</div>
                    <div className="font-medium">
                      {booking.cleaners?.name || 'Auto-matched by Shalean'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Frequency</div>
                    <div className="font-medium capitalize">{booking.frequency.replace('-', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Paid</div>
                    <div className="font-bold text-primary">
                      {pricing?.total ? formatCurrencyZAR(Number(pricing.total)) : ''}
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    A confirmation email has been sent to <strong>{booking.customer_email}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We'll send you a reminder 24 hours before your scheduled cleaning.
                  </p>
                </div>

                <Button onClick={() => navigate('/')} className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
