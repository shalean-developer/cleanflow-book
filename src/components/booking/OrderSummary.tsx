import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatCurrencyZAR } from '@/utils/pricing';
import { ArrowLeft, Lock, MapPin, Calendar, Clock, Home, Users, Star, Repeat, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Reusable SummaryItem component
interface SummaryItemProps {
  icon?: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

function SummaryItem({ icon, label, value, className = "", showIcon = true }: SummaryItemProps) {
  return (
    <div className={`flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50/50 transition-colors duration-200 ${className}`}>
      {showIcon && icon && (
        <div className="w-8 h-8 bg-[#0C53ED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm text-[#475569]">{label}</div>
        <div className="font-medium text-[#0F172A] text-sm">{value}</div>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  service?: {
    name: string;
    base_price: number;
  } | null;
  extras?: Array<{
    id: string;
    name: string;
    price: number;
  }> | null;
  cleaner?: {
    name: string;
  } | null;
  booking: {
    bedrooms: number;
    bathrooms: number;
    date?: string;
    time?: string;
    location?: string;
    frequency: string;
    cleanerId?: string;
    specialInstructions?: string;
    promo?: {
      code: string;
      type: 'percent' | 'fixed';
      value: number;
    };
  };
  pricing?: {
    subtotal: number;
    discount: number;
    promoDiscount: number;
    fees: number;
    total: number;
  } | null;
}

export function OrderSummary({ service, extras, cleaner, booking, pricing }: OrderSummaryProps) {
  const navigate = useNavigate();

  const extrasTotal = extras?.reduce((sum, extra) => sum + Number(extra.base_price || 0), 0) || 0;

  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sticky top-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 delay-80 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
            <Calendar className="h-3 w-3 text-white" />
          </div>
          <CardTitle className="text-lg font-semibold text-[#0F172A]">Order Summary</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Service Details */}
        <div className="space-y-4">
          {/* Service with pricing */}
          <div className="bg-gray-50/50 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 bg-[#0C53ED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="h-4 w-4 text-[#0C53ED]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[#0F172A] text-base">{service?.name || 'Service'}</div>
                  <div className="text-sm text-[#475569] mt-1">{booking.bedrooms} bed, {booking.bathrooms} bath</div>
                </div>
              </div>
              <div className="text-lg font-bold text-[#0C53ED]">
                {service ? formatCurrencyZAR(Number(service.base_price)) : '—'}
              </div>
            </div>

            {/* Extras */}
            {extras && extras.length > 0 && (
              <div className="mt-3 ml-11 space-y-2 border-t border-gray-200 pt-3">
                {extras.map((extra) => (
                  <div key={extra.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#475569]">+ {extra.name}</span>
                    <span className="font-medium text-[#0F172A]">{formatCurrencyZAR(Number(extra.base_price || 0))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <SummaryItem
              icon={<Calendar className="h-4 w-4 text-[#0C53ED]" />}
              label="Date & Time"
              value={`${booking.date ? new Date(booking.date).toLocaleDateString() : '—'} at ${booking.time || '—'}`}
            />

            <SummaryItem
              icon={<MapPin className="h-4 w-4 text-[#0C53ED]" />}
              label="Location"
              value={booking.location && booking.location.length > 30 
                ? `${booking.location.substring(0, 30)}...` 
                : booking.location || '—'}
            />

            {booking.cleanerId && (
              <SummaryItem
                icon={<User className="h-4 w-4 text-[#0C53ED]" />}
                label="Cleaner"
                value={booking.cleanerId === 'auto-match' ? 'Auto-matched by Shalean' : cleaner?.name || 'Selected cleaner'}
              />
            )}

            <SummaryItem
              icon={<Repeat className="h-4 w-4 text-[#0C53ED]" />}
              label="Frequency"
              value={booking.frequency.replace('-', ' ')}
              className="capitalize"
            />

            {booking.specialInstructions && (
              <SummaryItem
                icon={<FileText className="h-4 w-4 text-[#0C53ED]" />}
                label="Special Instructions"
                value={booking.specialInstructions.length > 40 
                  ? `${booking.specialInstructions.substring(0, 40)}...` 
                  : booking.specialInstructions}
              />
            )}
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Pricing Breakdown */}
        {pricing && (
          <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Cost Breakdown</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#475569]">Subtotal</span>
                <span className="font-medium text-[#0F172A] tabular-nums">{formatCurrencyZAR(pricing.subtotal)}</span>
              </div>
              
              {pricing.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({booking.frequency})</span>
                  <span className="font-medium tabular-nums">-{formatCurrencyZAR(pricing.discount)}</span>
                </div>
              )}
              
              {pricing.promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Promo Discount {booking.promo && `(${booking.promo.code})`}</span>
                  <span className="font-medium tabular-nums">-{formatCurrencyZAR(pricing.promoDiscount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-[#475569]">Service Fee</span>
                <span className="font-medium text-[#0F172A] tabular-nums">{formatCurrencyZAR(pricing.fees)}</span>
              </div>
            </div>
            
            <Separator className="bg-gray-300 my-3" />
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-[#0F172A]">Total</span>
              <span className="text-2xl font-bold text-[#0C53ED] tabular-nums">{formatCurrencyZAR(pricing.total)}</span>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#0F172A]">Secure checkout with Paystack</div>
            <div className="text-xs text-[#475569]">Your payment information is encrypted and secure</div>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-full justify-start text-[#475569] hover:text-[#0F172A] hover:bg-gray-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to details
        </Button>
      </CardContent>
    </Card>
  );
}
