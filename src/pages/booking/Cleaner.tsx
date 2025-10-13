import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { CleanerCard } from '@/components/booking/CleanerCard';
import { ChooseForMeCard } from '@/components/booking/ChooseForMeCard';
import { StickySummary } from '@/components/booking/StickySummary';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { NewCustomerPromoModal } from '@/components/booking/NewCustomerPromoModal';
import { ServiceChangeValidator } from '@/components/booking/ServiceChangeValidator';

export default function Cleaner() {
  const navigate = useNavigate();
  const { booking, setCleaner } = useBookingStore();
  const [selectedCleanerId, setSelectedCleanerId] = useState(booking.cleanerId || '');

  const { data: cleaners } = useQuery({
    queryKey: ['cleaners'],
    queryFn: async () => {
      const { data } = await supabase.from('cleaners').select('*').order('rating', { ascending: false });
      return data || [];
    },
  });

  useEffect(() => {
    if (!booking.date || !booking.time || !booking.location) {
      navigate('/booking/schedule');
    }
  }, [booking, navigate]);

  const extractArea = (location: string): string => {
    const parts = location.split(',').map(s => s.trim());
    return parts.length > 1 ? parts[parts.length - 2] : parts[0];
  };

  const filteredCleaners = useMemo(() => {
    if (!cleaners || !booking.date || !booking.time || !booking.location) return [];

    const area = extractArea(booking.location);
    const selectedDate = new Date(booking.date);
    const dayOfWeek = selectedDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    return cleaners.filter((cleaner) => {
      const serviceAreas = cleaner.service_areas || [];
      const matchesArea = serviceAreas.some((sa: string) =>
        sa.toLowerCase().includes(area.toLowerCase()) || 
        area.toLowerCase().includes(sa.toLowerCase()) ||
        sa.toLowerCase() === 'any'
      );

      // Check if cleaner is available on this day (available for all time slots 07:00-13:00)
      const availability = cleaner.availability as Record<string, string[]>;
      const isAvailableOnDay = availability[dayName] && availability[dayName].length > 0;

      return matchesArea && isAvailableOnDay;
    });
  }, [cleaners, booking.date, booking.time, booking.location]);

  const handleSelectCleaner = (id: string, name: string) => {
    setSelectedCleanerId(id);
    setCleaner(id, name);
  };

  const handleChooseForMe = () => {
    setSelectedCleanerId('auto-match');
    setCleaner('auto-match', 'Auto-matched by Shalean');
    navigate('/booking/review');
  };

  const handleContinue = () => {
    if (selectedCleanerId) {
      navigate('/booking/review');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 sm:mb-6 -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Cleaner Selection */}
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight mb-2 sm:mb-3">
                  Select Your Cleaner
                </h1>
                <div className="w-12 sm:w-16 h-[2px] sm:h-[3px] bg-[#0C53ED] rounded-full mb-3 sm:mb-4"></div>
                <p className="text-[#475569] text-sm sm:text-base lg:text-lg">
                  Available cleaners for {booking.location} on {booking.date ? new Date(booking.date).toLocaleDateString() : ''} at {booking.time}
                </p>
              </div>

              {/* Filter/Sort Toolbar */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Address and Sort Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
                      {extractArea(booking.location || '')}
                    </button>
                  </div>
                  
                  {/* Sort Select */}
                  <select className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#475569] bg-gray-50 rounded-lg sm:rounded-xl border-0 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2">
                    <option>Rating</option>
                    <option>Experience</option>
                    <option>Closest</option>
                  </select>
                </div>
                
                {/* Availability Day Chips */}
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full bg-[#EAF2FF] text-[#0C53ED] whitespace-nowrap flex-shrink-0"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Choose for Me Card */}
            <ChooseForMeCard onSelect={handleChooseForMe} />

            {/* Cleaner List */}
            {filteredCleaners.length === 0 ? (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md p-6 sm:p-8 lg:p-12 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-2">No cleaners available</h3>
                <p className="text-sm sm:text-base text-[#475569] mb-4 sm:mb-6">No cleaners available for your selected time and location.</p>
                <Button variant="outline" onClick={() => navigate('/booking/schedule')} className="border-[#0C53ED] text-[#0C53ED] hover:bg-[#EAF2FF] text-sm sm:text-base">
                  Change Schedule
                </Button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4" role="radiogroup" aria-label="Available cleaners">
                {filteredCleaners.map((cleaner) => (
                  <CleanerCard
                    key={cleaner.id}
                    id={cleaner.id}
                    name={cleaner.name}
                    rating={Number(cleaner.rating)}
                    serviceAreas={cleaner.service_areas}
                    isAvailable={true}
                    selected={selectedCleanerId === cleaner.id}
                    onSelect={handleSelectCleaner}
                  />
                ))}
              </ul>
            )}

            {/* Primary CTA */}
            {filteredCleaners.length > 0 && (
              <div className="sticky bottom-4 sm:bottom-6 lg:static z-10">
                <Button 
                  onClick={handleContinue} 
                  size="lg" 
                  className="w-full bg-[#0C53ED] hover:bg-[#0C53ED]/90 text-white rounded-full shadow-lg hover:brightness-110 hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:brightness-100 text-sm sm:text-base" 
                  disabled={!selectedCleanerId}
                >
                  Continue to Review & Pay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <StickySummary />
          </div>
        </div>
      </main>
      <ServiceChangeValidator />
      <NewCustomerPromoModal />
    </div>
  );
}
