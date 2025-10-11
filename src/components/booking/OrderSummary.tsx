import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatCurrencyZAR } from '@/utils/pricing';
import { ArrowLeft, Lock, MapPin, Calendar, Clock, Home, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  };
  pricing?: {
    subtotal: number;
    discount: number;
    fees: number;
    total: number;
  } | null;
}

export function OrderSummary({ service, extras, cleaner, booking, pricing }: OrderSummaryProps) {
  const navigate = useNavigate();

  const extrasTotal = extras?.reduce((sum, extra) => sum + Number(extra.price), 0) || 0;

  return (
    <Card className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 sticky top-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 delay-80">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-[#0F172A]">Order Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Service Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#0C53ED]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="h-4 w-4 text-[#0C53ED]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-[#0F172A] truncate">{service?.name || 'Service'}</div>
              <div className="text-sm text-[#475569]">{booking.bedrooms} bed, {booking.bathrooms} bath</div>
            </div>
            <div className="text-sm font-medium text-[#0F172A]">
              {service ? formatCurrencyZAR(Number(service.base_price)) : '—'}
            </div>
          </div>

          {/* Extras */}
          {extras && extras.length > 0 && (
            <div className="ml-11 space-y-2">
              {extras.map((extra) => (
                <div key={extra.id} className="flex justify-between items-center text-sm">
                  <span className="text-[#475569]">+ {extra.name}</span>
                  <span className="font-medium text-[#0F172A]">{formatCurrencyZAR(Number(extra.price))}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#2A869E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-[#2A869E]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-[#475569]">Frequency</div>
              <div className="font-medium text-[#0F172A] capitalize">
                {booking.frequency.replace('-', ' ')}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-[#475569]">Date & Time</div>
              <div className="font-medium text-[#0F172A]">
                {booking.date ? new Date(booking.date).toLocaleDateString() : '—'} at {booking.time || '—'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-[#475569]">Location</div>
              <div className="font-medium text-[#0F172A] text-sm" title={booking.location || ''}>
                {booking.location && booking.location.length > 30 
                  ? `${booking.location.substring(0, 30)}...` 
                  : booking.location || '—'}
              </div>
            </div>
          </div>

          {booking.cleanerId && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Home className="h-4 w-4 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-[#475569]">Cleaner</div>
                <div className="font-medium text-[#0F172A]">
                  {booking.cleanerId === 'auto-match' ? 'Auto-matched by Shalean' : cleaner?.name || 'Selected cleaner'}
                </div>
              </div>
            </div>
          )}

          {booking.specialInstructions && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-[#475569]">Special Instructions</div>
                <div className="font-medium text-[#0F172A] text-sm" title={booking.specialInstructions}>
                  {booking.specialInstructions.length > 40 
                    ? `${booking.specialInstructions.substring(0, 40)}...` 
                    : booking.specialInstructions}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-gray-200" />

        {/* Pricing Breakdown */}
        {pricing && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#475569]">Subtotal</span>
              <span className="font-medium text-[#0F172A]">{formatCurrencyZAR(pricing.subtotal)}</span>
            </div>
            
            {pricing.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({booking.frequency})</span>
                <span className="font-medium">-{formatCurrencyZAR(pricing.discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-[#475569]">Service Fee</span>
              <span className="font-medium text-[#0F172A]">{formatCurrencyZAR(pricing.fees)}</span>
            </div>
            
            <Separator className="bg-gray-200" />
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-[#0F172A]">Total</span>
              <span className="text-[#0C53ED] tabular-nums">{formatCurrencyZAR(pricing.total)}</span>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-gray-200">
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
