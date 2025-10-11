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
        promo: booking.promo,
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A]">Booking Summary</h2>
      </div>

      <div className="space-y-4">
        {booking.serviceName && (
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <Sparkles className="h-5 w-5 text-[#0C53ED] mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-[#475569]">Service</div>
              <div className="font-semibold text-[#0F172A]">{booking.serviceName}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <Home className="h-5 w-5 text-[#0C53ED] mt-0.5" />
            <div>
              <div className="text-sm text-[#475569]">Bedrooms</div>
              <div className="font-semibold text-[#0F172A]">{booking.bedrooms}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bath className="h-5 w-5 text-[#0C53ED] mt-0.5" />
            <div>
              <div className="text-sm text-[#475569]">Bathrooms</div>
              <div className="font-semibold text-[#0F172A]">{booking.bathrooms}</div>
            </div>
          </div>
        </div>

        {extras && extras.length > 0 && (
          <div>
            <div className="text-sm text-[#475569] mb-2">Extras</div>
            <div className="space-y-1">
              {extras.map((extra) => (
                <div key={extra.id} className="text-sm flex justify-between">
                  <span>{extra.name}</span>
                  <span className="font-medium tabular-nums">{formatCurrencyZAR(Number(extra.price))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {booking.frequency && (
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <Repeat className="h-5 w-5 text-[#0C53ED] mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-[#475569]">Frequency</div>
              <div className="font-semibold text-[#0F172A] capitalize">{booking.frequency.replace('-', ' ')}</div>
            </div>
          </div>
        )}

        {/* Changes caption */}
        <p className="text-sm text-gray-500 text-center">
          Changes as you update details
        </p>

        {booking.date && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#0C53ED] mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-[#475569]">Date</div>
              <div className="font-semibold text-[#0F172A]">{new Date(booking.date).toLocaleDateString('en-ZA')}</div>
            </div>
          </div>
        )}

        {booking.time && (
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-[#0C53ED] mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-[#475569]">Time</div>
              <div className="font-semibold text-[#0F172A]">{booking.time}</div>
            </div>
          </div>
        )}

        {booking.location && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[#0C53ED] mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-[#475569]">Location</div>
              <div className="font-semibold text-[#0F172A] text-sm">{booking.location}</div>
            </div>
          </div>
        )}

        {booking.cleanerName && (
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-[#0C53ED] mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-[#475569]">Cleaner</div>
              <div className="font-semibold text-[#0F172A]">{booking.cleanerName}</div>
            </div>
          </div>
        )}

         {pricing && (
           <div className="pt-4 border-t border-gray-100">
             {booking.promo && (
               <div className="p-3 bg-[#0C53ED]/10 rounded-xl border border-[#0C53ED]/20 mb-4">
                 <div className="flex items-center gap-2 text-sm font-semibold text-[#0C53ED]">
                   <Sparkles className="h-4 w-4" />
                   <span>{booking.promo.code} - {booking.promo.value}% off</span>
                 </div>
                 <div className="text-xs text-[#475569] mt-1">
                   {booking.serviceName} only
                 </div>
               </div>
             )}
             <div className="space-y-3 text-sm">
               <div className="flex justify-between">
                 <span className="text-[#475569]">Subtotal</span>
                 <span className="font-semibold text-[#0F172A] tabular-nums">{formatCurrencyZAR(pricing.subtotal)}</span>
               </div>
               {pricing.discount > 0 && (
                 <div className="flex justify-between text-green-600">
                   <span>Frequency Discount</span>
                   <span className="font-semibold tabular-nums">-{formatCurrencyZAR(pricing.discount)}</span>
                 </div>
               )}
               {pricing.promoDiscount > 0 && (
                 <div className="flex justify-between text-[#0C53ED] font-semibold">
                   <span>Promo ({booking.promo?.code})</span>
                   <span className="tabular-nums">-{formatCurrencyZAR(pricing.promoDiscount)}</span>
                 </div>
               )}
               <div className="flex justify-between">
                 <span className="text-[#475569]">Service Fee</span>
                 <span className="font-semibold text-[#0F172A] tabular-nums">{formatCurrencyZAR(pricing.fees)}</span>
               </div>
               <div className="border-t border-gray-100 pt-3">
                 <div className="flex justify-between text-xl font-bold text-[#0C53ED] tabular-nums">
                   <span>Total</span>
                   <span>{formatCurrencyZAR(pricing.total)}</span>
                 </div>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
