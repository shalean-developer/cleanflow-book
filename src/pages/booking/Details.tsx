import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { StickySummary } from '@/components/booking/StickySummary';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { NewCustomerPromoModal } from '@/components/booking/NewCustomerPromoModal';
import { ServiceChangeValidator } from '@/components/booking/ServiceChangeValidator';

export default function Details() {
  const navigate = useNavigate();
  const { booking, setDetails } = useBookingStore();
  
  const [bedrooms, setBedrooms] = useState(booking.bedrooms);
  const [bathrooms, setBathrooms] = useState(booking.bathrooms);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(booking.extras);
  const [specialInstructions, setSpecialInstructions] = useState(booking.specialInstructions || '');

  const { data: extras } = useQuery({
    queryKey: ['extras'],
    queryFn: async () => {
      const { data } = await supabase.from('extras').select('*').order('name');
      return data || [];
    },
  });

  useEffect(() => {
    if (!booking.serviceId) {
      navigate('/booking/service/select');
    }
  }, [booking.serviceId, navigate]);

  const handleContinue = () => {
    setDetails(bedrooms, bathrooms, selectedExtras, specialInstructions);
    navigate('/booking/schedule');
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : <LucideIcons.Sparkles className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section aria-label="Booking Details" className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Back Link */}
          <div 
            className="animate-fade-up mb-6"
            style={{ animationDelay: '0ms', animationFillMode: 'both' }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="p-2 text-[#475569] hover:text-[#0F172A] hover:underline focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Section Title */}
              <div 
                className="animate-fade-up mb-8"
                style={{ animationDelay: '80ms', animationFillMode: 'both' }}
              >
                <h1 className="text-4xl font-bold text-[#0F172A] tracking-tight mb-2">
                  Booking Details
                </h1>
                <div className="w-16 h-[3px] bg-[#0C53ED] mb-4"></div>
                <p className="text-[#475569] text-lg max-w-[60ch] leading-relaxed">
                  Tell us about your space and any extras you need
                </p>
              </div>

              {/* Card 1 — Room Details */}
              <fieldset 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up"
                style={{ animationDelay: '160ms', animationFillMode: 'both' }}
              >
                <legend className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-[#0F172A]">Room Details</h2>
                </legend>
                <p className="text-[#475569] text-sm mb-6">Select the number of bedrooms and bathrooms</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="text-sm font-medium text-[#0F172A]">Bedrooms</Label>
                    <Select value={bedrooms.toString()} onValueChange={(v) => setBedrooms(Number(v))}>
                      <SelectTrigger 
                        id="bedrooms" 
                        className="rounded-xl border-gray-200 bg-white hover:shadow-md focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 transition-all duration-200"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-lg">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem 
                            key={num} 
                            value={num.toString()}
                            className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                          >
                            {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms" className="text-sm font-medium text-[#0F172A]">Bathrooms</Label>
                    <Select value={bathrooms.toString()} onValueChange={(v) => setBathrooms(Number(v))}>
                      <SelectTrigger 
                        id="bathrooms"
                        className="rounded-xl border-gray-200 bg-white hover:shadow-md focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 transition-all duration-200"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-lg">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem 
                            key={num} 
                            value={num.toString()}
                            className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                          >
                            {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </fieldset>

              {/* Card 2 — Extra Services */}
              <fieldset 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up"
                style={{ animationDelay: '240ms', animationFillMode: 'both' }}
              >
                <legend className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-[#0F172A]">Extra Services</h2>
                </legend>
                <p className="text-[#475569] text-sm mb-6">Select any additional services you need</p>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {extras?.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.id);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        onClick={() => toggleExtra(extra.id)}
                        aria-pressed={isSelected}
                        role="button"
                        className={`
                          flex items-center gap-3 p-4 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 min-h-[60px]
                          ${isSelected 
                            ? 'bg-[#EAF2FF] border-[#0C53ED]/30 text-[#0C53ED] shadow-sm scale-100' 
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'
                          }
                        `}
                        style={{
                          transform: isSelected ? 'scale(1)' : 'scale(0.98)',
                          transition: 'transform 150ms ease-out, background-color 150ms ease-out, border-color 150ms ease-out'
                        }}
                      >
                        <div className="flex-shrink-0">
                          {getIcon(extra.icon || 'Sparkles')}
                        </div>
                        <span className="flex-1 text-left font-medium">{extra.name}</span>
                        <span className={`
                          px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200
                          ${isSelected 
                            ? 'bg-white/70 text-[#0C53ED]' 
                            : 'bg-gray-100 text-gray-700'
                          }
                        `}>
                          R{Number(extra.base_price || 0).toFixed(0)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Card 3 — Special Instructions */}
              <fieldset 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up"
                style={{ animationDelay: '320ms', animationFillMode: 'both' }}
              >
                <legend className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-[#0F172A]">Special Instructions</h2>
                </legend>
                <p className="text-[#475569] text-sm mb-6">Any specific requirements or notes for the cleaner? (Optional)</p>
                
                <Textarea
                  placeholder="E.g., Please use pet-friendly products, pay special attention to the kitchen..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="rounded-xl border-gray-200 min-h-28 placeholder-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-[#0C53ED] transition-all duration-200"
                  rows={4}
                />
              </fieldset>

              {/* Primary CTA */}
              <div 
                className="animate-fade-up"
                style={{ animationDelay: '400ms', animationFillMode: 'both' }}
              >
                <Button 
                  onClick={handleContinue} 
                  size="lg" 
                  className="w-full md:w-auto rounded-full bg-[#0C53ED] text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                >
                  Continue to Schedule
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* RIGHT — Booking Summary */}
            <div 
              className="lg:block hidden animate-fade-up"
              style={{ animationDelay: '480ms', animationFillMode: 'both' }}
            >
              <div className="sticky top-6">
                <StickySummary />
              </div>
            </div>
          </div>

          {/* Mobile Booking Summary */}
          <div 
            className="lg:hidden mt-8 animate-fade-up"
            style={{ animationDelay: '480ms', animationFillMode: 'both' }}
          >
            <StickySummary />
          </div>
        </section>
      </main>
      <ServiceChangeValidator />
      <NewCustomerPromoModal />
    </div>
  );
}
