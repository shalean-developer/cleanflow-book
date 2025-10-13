import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StickySummary } from '@/components/booking/StickySummary';
import { HorizontalDatePicker } from '@/components/booking/HorizontalDatePicker';
import { generateTimeSlots, filterPastSlots } from '@/utils/timeSlots';
import { ArrowRight, ArrowLeft, MapPin, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { NewCustomerPromoModal } from '@/components/booking/NewCustomerPromoModal';
import { ServiceChangeValidator } from '@/components/booking/ServiceChangeValidator';
import { MapPreview } from '@/components/ui/map-preview';

export default function Schedule() {
  const navigate = useNavigate();
  const { booking, setSchedule } = useBookingStore();

  const [date, setDate] = useState<Date | undefined>(
    booking.date ? new Date(booking.date) : undefined
  );
  const [time, setTime] = useState(booking.time || '');
  const [frequency, setFrequency] = useState(booking.frequency);
  const [location, setLocation] = useState(booking.location || '');

  const allSlots = generateTimeSlots();
  const availableSlots = date ? filterPastSlots(format(date, 'yyyy-MM-dd'), allSlots) : allSlots;

  useEffect(() => {
    if (!booking.serviceId) {
      navigate('/booking/service/select');
    }
  }, [booking.serviceId, navigate]);

  const handleContinue = () => {
    if (date && time && location) {
      setSchedule(format(date, 'yyyy-MM-dd'), time, frequency, location);
      navigate('/booking/cleaner');
    }
  };

  const isComplete = date && time && location;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="w-full px-3 py-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="space-y-3">
              {/* Section Heading */}
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-[#0F172A] tracking-tight leading-tight">
                  Schedule Your Cleaning
                </h1>
                <div className="w-12 h-[3px] bg-[#0C53ED] rounded-full"></div>
                <p className="text-[#475569] text-xs leading-relaxed">Choose your preferred date, time, and location</p>
              </div>

              {/* CARD 1 - Select Date */}
              <fieldset className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
                <legend className="sr-only">Select Date</legend>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">Select Date</h3>
                    <p className="text-xs text-[#475569]">Choose a date for your cleaning service</p>
                  </div>
                  <HorizontalDatePicker
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </div>
              </fieldset>

              {/* CARD 2 - Time Slots */}
              {date && (
                <fieldset className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-100">
                  <legend className="sr-only">Select Time</legend>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A]">Select Time</h3>
                      <p className="text-xs text-[#475569]">Available times between 07:00 - 13:00</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot, index) => {
                        const isSelected = time === slot;
                        const isUnavailable = false; // Add your availability logic here if needed
                        
                        return (
                          <button
                            key={slot}
                            onClick={() => !isUnavailable && setTime(slot)}
                            disabled={isUnavailable}
                            aria-pressed={isSelected}
                            aria-label={`Select ${slot}`}
                            className={`
                              relative flex items-center justify-center px-3 py-2 rounded-full border transition-all duration-200 min-h-[40px] text-xs
                              ${isSelected 
                                ? 'bg-[#0C53ED] text-white border-[#0C53ED] shadow-md' 
                                : isUnavailable
                                ? 'bg-[#F8FAFC] text-[#94A3B8] border-gray-200 cursor-not-allowed opacity-60'
                                : 'bg-white text-[#0F172A] border-gray-200 hover:border-[#0C53ED]/30 hover:shadow-sm hover:scale-105'
                              }
                              focus:outline-none focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2
                              disabled:cursor-not-allowed
                              motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300
                            `}
                            style={{
                              animationDelay: `motion-safe:${index * 50}ms`
                            }}
                          >
                            {isUnavailable && <Lock className="w-4 h-4 mr-2" />}
                            <span className="font-medium tabular-nums">{slot}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </fieldset>
              )}

              {/* CARD 3 - Frequency */}
              <fieldset className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-200">
                <legend className="sr-only">Frequency</legend>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">Frequency</h3>
                    <p className="text-xs text-[#475569]">How often would you like cleaning service?</p>
                  </div>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="rounded-xl border-gray-200 bg-white focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-lg">
                      <SelectItem 
                        value="one-time" 
                        className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                      >
                        One-time
                      </SelectItem>
                      <SelectItem 
                        value="weekly" 
                        className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                      >
                        Weekly (15% discount)
                      </SelectItem>
                      <SelectItem 
                        value="bi-weekly" 
                        className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                      >
                        Bi-weekly (10% discount)
                      </SelectItem>
                      <SelectItem 
                        value="monthly" 
                        className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                      >
                        Monthly (5% discount)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </fieldset>

              {/* CARD 4 - Location */}
              <fieldset className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-300">
                <legend className="sr-only">Location</legend>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">Location</h3>
                    <p className="text-xs text-[#475569]">Enter your service address</p>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                    <Input
                      id="location"
                      placeholder="Enter your full address (e.g., 123 Main St, Sandton, Johannesburg)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 text-sm"
                    />
                  </div>
                  {/* Map preview */}
                  <MapPreview address={location} />
                </div>
              </fieldset>

              {/* Primary CTA */}
              <Button 
                onClick={handleContinue} 
                disabled={!isComplete}
                className="w-full rounded-full bg-[#0C53ED] text-white py-3 shadow-lg hover:brightness-110 hover:-translate-y-[1px] transition-all duration-200 disabled:brightness-75 disabled:shadow-none disabled:translate-y-0 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-400 text-sm"
              >
                Continue to Select Cleaner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Mobile Booking Summary */}
              <div className="mt-3">
                <StickySummary />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN - SCHEDULING FORM */}
              <div className="lg:col-span-2 space-y-6">
                {/* Section Heading */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">
                    Schedule Your Cleaning
                  </h1>
                  <div className="w-16 h-[3px] bg-[#0C53ED] rounded-full"></div>
                  <p className="text-[#475569]">Choose your preferred date, time, and location</p>
                </div>

                {/* CARD 1 - Select Date */}
                <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
                  <legend className="sr-only">Select Date</legend>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#0F172A]">Select Date</h3>
                      <p className="text-sm text-[#475569]">Choose a date for your cleaning service</p>
                    </div>
                    <HorizontalDatePicker
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </div>
                </fieldset>

                {/* CARD 2 - Time Slots */}
                {date && (
                  <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-100">
                    <legend className="sr-only">Select Time</legend>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#0F172A]">Select Time</h3>
                        <p className="text-sm text-[#475569]">Available times between 07:00 - 13:00</p>
                      </div>
                      <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
                        {availableSlots.map((slot, index) => {
                          const isSelected = time === slot;
                          const isUnavailable = false; // Add your availability logic here if needed
                          
                          return (
                            <button
                              key={slot}
                              onClick={() => !isUnavailable && setTime(slot)}
                              disabled={isUnavailable}
                              aria-pressed={isSelected}
                              aria-label={`Select ${slot}`}
                              className={`
                                relative flex items-center justify-center px-4 py-2 rounded-full border transition-all duration-200 min-h-[44px] text-sm
                                ${isSelected 
                                  ? 'bg-[#0C53ED] text-white border-[#0C53ED] shadow-md' 
                                  : isUnavailable
                                  ? 'bg-[#F8FAFC] text-[#94A3B8] border-gray-200 cursor-not-allowed opacity-60'
                                  : 'bg-white text-[#0F172A] border-gray-200 hover:border-[#0C53ED]/30 hover:shadow-sm hover:scale-105'
                                }
                                focus:outline-none focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2
                                disabled:cursor-not-allowed
                                motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300
                              `}
                              style={{
                                animationDelay: `motion-safe:${index * 50}ms`
                              }}
                            >
                              {isUnavailable && <Lock className="w-4 h-4 mr-2" />}
                              <span className="font-medium tabular-nums">{slot}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* CARD 3 - Frequency */}
                <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-200">
                  <legend className="sr-only">Frequency</legend>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#0F172A]">Frequency</h3>
                      <p className="text-sm text-[#475569]">How often would you like cleaning service?</p>
                    </div>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="rounded-xl border-gray-200 bg-white focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-lg">
                        <SelectItem 
                          value="one-time" 
                          className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                        >
                          One-time
                        </SelectItem>
                        <SelectItem 
                          value="weekly" 
                          className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                        >
                          Weekly (15% discount)
                        </SelectItem>
                        <SelectItem 
                          value="bi-weekly" 
                          className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                        >
                          Bi-weekly (10% discount)
                        </SelectItem>
                        <SelectItem 
                          value="monthly" 
                          className="focus:bg-[#EAF2FF] focus:text-[#0C53ED]"
                        >
                          Monthly (5% discount)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </fieldset>

                {/* CARD 4 - Location */}
                <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-300">
                  <legend className="sr-only">Location</legend>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#0F172A]">Location</h3>
                      <p className="text-sm text-[#475569]">Enter your service address</p>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                      <Input
                        id="location"
                        placeholder="Enter your full address (e.g., 123 Main St, Sandton, Johannesburg)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2"
                      />
                    </div>
                    {/* Map preview */}
                    <MapPreview address={location} />
                  </div>
                </fieldset>

                {/* Primary CTA */}
                <Button 
                  onClick={handleContinue} 
                  disabled={!isComplete}
                  className="w-full rounded-full bg-[#0C53ED] text-white py-3.5 shadow-lg hover:brightness-110 hover:-translate-y-[1px] transition-all duration-200 disabled:brightness-75 disabled:shadow-none disabled:translate-y-0 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-400"
                >
                  Continue to Select Cleaner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* RIGHT COLUMN - BOOKING SUMMARY */}
              <div className="lg:block hidden">
                <div className="sticky top-6">
                  <StickySummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ServiceChangeValidator />
      <NewCustomerPromoModal />
    </div>
  );
}
