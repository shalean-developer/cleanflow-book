import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Mail, Phone } from 'lucide-react';

export default function QuoteConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="p-8 md:p-12 shadow-large text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Quote Request Received!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your interest in our cleaning services. We've received your quote request 
            and will get back to you shortly with a personalized quote.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 mb-8 space-y-4">
            <h2 className="font-semibold text-lg mb-4">What happens next?</h2>
            
            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Review Your Request</h3>
                <p className="text-sm text-muted-foreground">
                  Our team will review your property details and requirements
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Prepare Your Quote</h3>
                <p className="text-sm text-muted-foreground">
                  We'll calculate a customized quote based on your needs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Contact You</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive your personalized quote within 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              We'll contact you via:
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>Phone</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              onClick={() => navigate('/booking/quote')}
              size="lg"
              variant="outline"
            >
              Request Another Quote
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
