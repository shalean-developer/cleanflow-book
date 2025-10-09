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
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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

    return cleaners.filter((cleaner) => {
      const serviceAreas = cleaner.service_areas || [];
      const matchesArea = serviceAreas.some((sa: string) =>
        sa.toLowerCase().includes(area.toLowerCase()) || area.toLowerCase().includes(sa.toLowerCase())
      );

      const availability = cleaner.availability as Record<string, string[]>;
      const daySlots = availability[dayOfWeek.toString()] || [];
      const isAvailable = daySlots.includes(booking.time || '');

      return matchesArea && isAvailable;
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Select Your Cleaner</h1>
                <p className="text-muted-foreground">
                  Available cleaners for {booking.location} on {booking.date ? new Date(booking.date).toLocaleDateString() : ''} at {booking.time}
                </p>
              </div>

              <div className="space-y-6">
                <ChooseForMeCard onSelect={handleChooseForMe} />

                {filteredCleaners.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No cleaners available for your selected time and location.</p>
                    <Button variant="outline" onClick={() => navigate('/booking/schedule')}>
                      Change Schedule
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                  </div>
                )}
              </div>

              {filteredCleaners.length > 0 && (
                <Button onClick={handleContinue} size="lg" className="w-full md:w-auto" disabled={!selectedCleanerId}>
                  Continue to Review & Pay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="lg:block hidden">
              <StickySummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ServiceChangeValidator />
      <NewCustomerPromoModal />
    </div>
  );
}
