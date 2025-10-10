import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useBookingStore } from '@/store/bookingStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { AuthModal } from '@/components/booking/AuthModal';

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
];

export function NewCustomerPromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setService, setPromo } = useBookingStore();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session && showAuthModal) {
        // User just logged in, close auth modal and claim promo
        setShowAuthModal(false);
        handleClaim();
      }
    });

    return () => subscription.unsubscribe();
  }, [showAuthModal]);

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

  const handleClaimClick = async () => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Show auth modal
      setShowAuthModal(true);
      return;
    }

    // User is authenticated, proceed with claim
    await handleClaim();
  };

  const handleClaim = async () => {
    setIsLoading(true);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + PROMO_CONFIG.daysValid);
      
      const sessionId = generateSessionId();

      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Authentication required to claim promo");
      }
      
      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Authentication required");
      }
      
      // Claim promo in database with auth token
      const { data, error } = await supabase.functions.invoke('claim-promo', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          code: PROMO_CONFIG.code,
          serviceSlug: PROMO_CONFIG.appliesTo,
          sessionId,
          email: user.email,
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
    <>
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to claim your discount</DialogTitle>
            <DialogDescription>
              Please sign in to claim your 20% off discount
            </DialogDescription>
          </DialogHeader>
          <AuthModal />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <div className="relative">
            <DialogHeader className="text-center space-y-4 pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-[#0C53ED]" />
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-[#0C53ED] leading-tight">
                Welcome! 20% Off Your First Standard Clean
              </DialogTitle>
              <DialogDescription className="text-[#555] text-base leading-relaxed">
                New to Shalean? Enjoy <strong className="text-[#0C53ED]">20% off</strong> your first <strong className="text-[#0C53ED]">Standard Cleaning</strong>. Limited time offer.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleClaimClick}
                  disabled={isLoading}
                  size="lg"
                  className="w-full rounded-full bg-[#0C53ED] hover:bg-[#0A47D1] text-white font-semibold py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? 'Applying...' : 'Claim 20% Off'}
                </Button>
                <button
                  onClick={handleDismiss}
                  className="text-[#888] hover:text-[#555] hover:underline transition-colors duration-200 text-center py-2 font-medium"
                >
                  Not now
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="terms" className="border-none">
                    <AccordionTrigger className="text-sm font-medium text-[#555] hover:text-[#0C53ED] transition-colors duration-200 py-2 px-0 [&[data-state=open]]:text-[#0C53ED]">
                      Terms & Conditions
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-[#555] space-y-2 pt-2">
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
