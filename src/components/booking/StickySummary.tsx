import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useBookingStore } from '@/store/bookingStore';
import { calculatePricing, formatCurrencyZAR } from '@/utils/pricing';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, User, Home, Bath, Sparkles, Repeat } from 'lucide-react';

export function StickySummary() {
  const { booking } = useBookingStore();

  const { data: service } = useQuery({
    queryKey: ['service', booking.serviceId],
    queryFn: async () => {
      if (!booking.serviceId) return null;
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('id', booking.serviceId)
        .maybeSingle();
      return data;
    },
    enabled: !!booking.serviceId,
  });

  const { data: extras } = useQuery({
    queryKey: ['extras', booking.extras],
    queryFn: async () => {
      if (!booking.extras.length) return [];
      const { data } = await supabase
        .from('extras')
        .select('*')
        .in('id', booking.extras);
      return data || [];
    },
    enabled: booking.extras.length > 0,
  });

  const extrasTotal = extras?.reduce((sum, extra) => sum + Number(extra.price), 0) || 0;
  
  const pricing = service
    ? calculatePricing({
        basePrice: Number(service.base_price),
        bedrooms: booking.bedrooms,
        bathrooms: booking.bathrooms,
        extrasTotal,
        frequency: booking.frequency,
      })
    : null;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {booking.serviceName && (
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Service</div>
              <div className="font-medium">{booking.serviceName}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Home className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground">Bedrooms</div>
              <div className="font-medium">{booking.bedrooms}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Bath className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground">Bathrooms</div>
              <div className="font-medium">{booking.bathrooms}</div>
            </div>
          </div>
        </div>

        {extras && extras.length > 0 && (
          <div>
            <div className="text-sm text-muted-foreground mb-2">Extras</div>
            <div className="space-y-1">
              {extras.map((extra) => (
                <div key={extra.id} className="text-sm flex justify-between">
                  <span>{extra.name}</span>
                  <span className="font-medium">{formatCurrencyZAR(Number(extra.price))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {booking.frequency && (
          <div className="flex items-start gap-2">
            <Repeat className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Frequency</div>
              <div className="font-medium capitalize">{booking.frequency.replace('-', ' ')}</div>
            </div>
          </div>
        )}

        {booking.date && (
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{new Date(booking.date).toLocaleDateString('en-ZA')}</div>
            </div>
          </div>
        )}

        {booking.time && (
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-medium">{booking.time}</div>
            </div>
          </div>
        )}

        {booking.location && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-medium text-sm">{booking.location}</div>
            </div>
          </div>
        )}

        {booking.cleanerName && (
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Cleaner</div>
              <div className="font-medium">{booking.cleanerName}</div>
            </div>
          </div>
        )}

        {pricing && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrencyZAR(pricing.subtotal)}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-{formatCurrencyZAR(pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="font-medium">{formatCurrencyZAR(pricing.fees)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total</span>
                <span>{formatCurrencyZAR(pricing.total)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
