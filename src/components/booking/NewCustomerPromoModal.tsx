import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useBookingStore } from '@/store/bookingStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const PROMO_CONFIG = {
  code: 'NEW20SC',
  type: 'percent' as const,
  value: 20,
  appliesTo: 'standard-cleaning',
  serviceName: 'Standard Cleaning',
  daysValid: 30,
};

const ELIGIBLE_ROUTES = [
  '/',
  '/booking/service/select',
  '/booking/details',
  '/booking/schedule',
  '/booking/cleaner',
  '/booking/review',
];

export function NewCustomerPromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setService, setPromo } = useBookingStore();

  useEffect(() => {
    // Check if we should show the modal
    const shouldShow = () => {
      // Check session storage
      if (sessionStorage.getItem('promo_seen_standard20') === 'true') {
        return false;
      }

      // Check if on eligible route
      const isEligibleRoute = ELIGIBLE_ROUTES.some(route => {
        if (route === '/') return location.pathname === '/';
        return location.pathname.startsWith(route);
      });

      if (!isEligibleRoute) {
        return false;
      }

      return true;
    };

    if (shouldShow()) {
      // Delay 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const generateSessionId = () => {
    let sessionId = sessionStorage.getItem('booking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('booking_session_id', sessionId);
    }
    return sessionId;
  };

  const handleClaim = async () => {
    setIsLoading(true);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + PROMO_CONFIG.daysValid);
      
      const sessionId = generateSessionId();

      // Get user email if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Claim promo in database
      const { data, error } = await supabase.functions.invoke('claim-promo', {
        body: {
          code: PROMO_CONFIG.code,
          serviceSlug: PROMO_CONFIG.appliesTo,
          sessionId,
          email: user?.email,
          expiresAt: expiresAt.toISOString(),
        },
      });

      if (error) throw error;

      // Apply promo to booking state
      setPromo({
        code: PROMO_CONFIG.code,
        type: PROMO_CONFIG.type,
        value: PROMO_CONFIG.value,
        appliesTo: PROMO_CONFIG.appliesTo,
        expiresAt: expiresAt.toISOString(),
        claimId: data.claim.id,
      });

      // Get standard-cleaning service
      const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('slug', PROMO_CONFIG.appliesTo)
        .single();

      if (services) {
        setService(services.id, services.name, services.slug);
      }

      // Mark as seen
      sessionStorage.setItem('promo_seen_standard20', 'true');

      // Close modal
      setIsOpen(false);

      // Show success toast
      toast({
        title: 'Promo Applied!',
        description: `${PROMO_CONFIG.code}: 20% off ${PROMO_CONFIG.serviceName}`,
      });

      // Navigate to details
      navigate('/booking/details');
    } catch (error: any) {
      console.error('Error claiming promo:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply promo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('promo_seen_standard20', 'true');
    setIsOpen(false);
  };

  const formatExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + PROMO_CONFIG.daysValid);
    return date.toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">Welcome! 20% Off Your First Standard Clean</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            New to Shalean? Enjoy <strong>20% off</strong> your first <strong>Standard Cleaning</strong>. Limited time offer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleClaim}
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? 'Applying...' : 'Claim 20% Off'}
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Not now
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="terms">
              <AccordionTrigger className="text-sm">Terms & Conditions</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Valid for new customers only (first booking)</li>
                  <li>Applies to Standard Cleaning service only</li>
                  <li>Cannot be combined with other promotions</li>
                  <li>Valid in all service areas</li>
                  <li>24-48 hour cancellation window required</li>
                  <li>Expires on {formatExpiryDate()}</li>
                  <li>Subject to cleaner availability</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
