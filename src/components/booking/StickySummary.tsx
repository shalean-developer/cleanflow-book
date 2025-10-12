import { useBookingStore } from '@/store/bookingStore';
import { calculatePricing, formatCurrencyZAR } from '@/utils/pricing';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, User, Home, Bath, Sparkles, Repeat } from 'lucide-react';

// Reusable SummaryItem component for StickySummary
interface SummaryItemProps {
  icon?: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

function SummaryItem({ icon, label, value, className = "", showIcon = true }: SummaryItemProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {showIcon && icon && (
        <div className="w-5 h-5 text-[#0C53ED] mt-0.5 flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[#475569]">{label}</div>
        <div className="font-semibold text-[#0F172A] text-sm">{value}</div>
      </div>
    </div>
  );
}

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
          <Calendar className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A]">Booking Summary</h2>
      </div>

      <div className="space-y-5">
        {/* Service Information */}
        {booking.serviceName && (
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-4">
            <SummaryItem
              icon={<Sparkles className="h-5 w-5" />}
              label="Service"
              value={booking.serviceName}
              className="pb-0"
            />
            
            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200">
              <SummaryItem
                icon={<Home className="h-4 w-4" />}
                label="Bedrooms"
                value={booking.bedrooms.toString()}
                className="pb-0"
              />
              <SummaryItem
                icon={<Bath className="h-4 w-4" />}
                label="Bathrooms"
                value={booking.bathrooms.toString()}
                className="pb-0"
              />
            </div>

            {extras && extras.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-[#475569] mb-2">Extras</div>
                <div className="space-y-1">
                  {extras.map((extra) => (
                    <div key={extra.id} className="text-sm flex justify-between">
                      <span className="text-[#475569]">+ {extra.name}</span>
                      <span className="font-medium tabular-nums text-[#0F172A]">{formatCurrencyZAR(Number(extra.price))}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Booking Details */}
        <div className="space-y-3">
          {booking.frequency && (
            <SummaryItem
              icon={<Repeat className="h-5 w-5" />}
              label="Frequency"
              value={booking.frequency.replace('-', ' ')}
              className="capitalize"
            />
          )}

          {booking.date && (
            <SummaryItem
              icon={<Calendar className="h-5 w-5" />}
              label="Date"
              value={new Date(booking.date).toLocaleDateString('en-ZA')}
            />
          )}

          {booking.time && (
            <SummaryItem
              icon={<Clock className="h-5 w-5" />}
              label="Time"
              value={booking.time}
            />
          )}

          {booking.location && (
            <SummaryItem
              icon={<MapPin className="h-5 w-5" />}
              label="Location"
              value={booking.location}
            />
          )}

          {booking.cleanerName && (
            <SummaryItem
              icon={<User className="h-5 w-5" />}
              label="Cleaner"
              value={booking.cleanerName}
            />
          )}
        </div>

        {/* Changes caption */}
        <p className="text-xs text-gray-500 text-center bg-gray-50 rounded-lg py-2">
          Updates automatically as you make changes
        </p>

         {pricing && (
           <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-4 space-y-3">
             <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Cost Breakdown</h3>
             
             {booking.promo && (
               <div className="p-3 bg-[#0C53ED]/10 rounded-lg border border-[#0C53ED]/20 mb-3">
                 <div className="flex items-center gap-2 text-sm font-semibold text-[#0C53ED]">
                   <Sparkles className="h-4 w-4" />
                   <span>{booking.promo.code} - {booking.promo.value}% off</span>
                 </div>
                 <div className="text-xs text-[#475569] mt-1">
                   {booking.serviceName} only
                 </div>
               </div>
             )}
             
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-[#475569]">Subtotal</span>
                 <span className="font-semibold text-[#0F172A] tabular-nums">{formatCurrencyZAR(pricing.subtotal)}</span>
               </div>
               
               {pricing.discount > 0 && (
                 <div className="flex justify-between text-sm text-green-600">
                   <span>Frequency Discount</span>
                   <span className="font-semibold tabular-nums">-{formatCurrencyZAR(pricing.discount)}</span>
                 </div>
               )}
               
               {pricing.promoDiscount > 0 && (
                 <div className="flex justify-between text-sm text-[#0C53ED] font-semibold">
                   <span>Promo ({booking.promo?.code})</span>
                   <span className="tabular-nums">-{formatCurrencyZAR(pricing.promoDiscount)}</span>
                 </div>
               )}
               
               <div className="flex justify-between text-sm">
                 <span className="text-[#475569]">Service Fee</span>
                 <span className="font-semibold text-[#0F172A] tabular-nums">{formatCurrencyZAR(pricing.fees)}</span>
               </div>
             </div>
             
             <div className="border-t border-gray-300 pt-3">
               <div className="flex justify-between items-center">
                 <span className="text-lg font-bold text-[#0F172A]">Total</span>
                 <span className="text-2xl font-bold text-[#0C53ED] tabular-nums">{formatCurrencyZAR(pricing.total)}</span>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
