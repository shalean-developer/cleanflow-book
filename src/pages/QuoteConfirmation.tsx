import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Home, Calendar } from 'lucide-react';

export default function QuoteConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quoteId = searchParams.get('id');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground">
              Your quote request was received successfully
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Quote Reference:</p>
                <p className="text-lg font-bold">{quoteId}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Confirmation Email Sent</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email with your quote details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">We'll Review Your Request</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will prepare a customized quote based on your requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Receive Your Quote</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a detailed quote via email within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button onClick={() => navigate('/')} className="w-full" variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button onClick={() => navigate('/booking/service/select')} className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Make a Booking
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Need help? Contact us at{' '}
              <a href="mailto:bookings@shalean.com" className="text-primary hover:underline">
                bookings@shalean.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
