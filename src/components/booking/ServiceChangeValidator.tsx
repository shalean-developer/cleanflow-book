import { useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function ServiceChangeValidator() {
  const { booking, clearPromo, isPromoValidForService } = useBookingStore();

  useEffect(() => {
    if (!booking.promo || !booking.serviceSlug) return;

    // Check if promo is valid for current service
    if (!isPromoValidForService(booking.serviceSlug)) {
      // Service changed away from promo-eligible service
      const revokePromo = async () => {
        if (booking.promo?.claimId) {
          await supabase.functions.invoke('revoke-promo', {
            body: {
              claimId: booking.promo.claimId,
              reason: `Service changed from ${booking.promo.appliesTo} to ${booking.serviceSlug}`,
            },
          });
        }

        clearPromo();

        toast({
          title: 'Promo Removed',
          description: `Promo ${booking.promo?.code} is only valid for ${booking.promo?.appliesTo.replace('-', ' ')}.`,
          variant: 'destructive',
        });
      };

      revokePromo();
    }
  }, [booking.serviceSlug, booking.promo, clearPromo, isPromoValidForService]);

  return null;
}
