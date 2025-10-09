import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { CleanerCard } from '../CleanerCard';

interface Step4CleanerProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step4Cleaner = ({ onNext, onBack }: Step4CleanerProps) => {
  const { bookingData, updateBooking } = useBooking();
  const [cleaners, setCleaners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingData.areaId && bookingData.date) {
      fetchCleaners();
    }
  }, [bookingData.areaId, bookingData.date]);

  const fetchCleaners = async () => {
    if (!bookingData.date) return;

    const weekday = bookingData.date.getDay();
    
    // Get cleaners in the selected area with availability on the selected day
    const { data } = await supabase
      .from('cleaners')
      .select(`
        *,
        cleaner_service_areas!inner(service_area_id),
        cleaner_availability!inner(weekday, start_time, end_time)
      `)
      .eq('active', true)
      .eq('cleaner_service_areas.service_area_id', bookingData.areaId)
      .eq('cleaner_availability.weekday', weekday);

    if (data) {
      // Filter cleaners based on time availability
      const availableCleaners = data.filter((cleaner: any) => {
        if (!bookingData.time) return true;
        
        const [hours, minutes] = bookingData.time.split(':').map(Number);
        const selectedMinutes = hours * 60 + minutes;
        
        return cleaner.cleaner_availability.some((avail: any) => {
          const [startH, startM] = avail.start_time.split(':').map(Number);
          const [endH, endM] = avail.end_time.split(':').map(Number);
          const startMinutes = startH * 60 + startM;
          const endMinutes = endH * 60 + endM;
          
          return selectedMinutes >= startMinutes && selectedMinutes <= endMinutes;
        });
      });
      
      setCleaners(availableCleaners);
    }
    setLoading(false);
  };

  const handleCleanerSelect = (cleaner: any) => {
    updateBooking({
      cleanerId: cleaner.id,
      cleanerName: cleaner.full_name,
    });
  };

  if (loading) {
    return <div className="text-center py-12">Finding available cleaners...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Cleaner</h2>
        <p className="text-muted-foreground">
          Select from our available professionals in your area
        </p>
      </div>

      {cleaners.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">
            No cleaners available for your selected time slot.
          </p>
          <Button variant="outline" onClick={onBack}>
            Go Back and Choose Different Time
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cleaners.map((cleaner) => {
              const availableDays = cleaner.cleaner_availability?.map((avail: any) => {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return days[avail.weekday];
              }) || [];
              
              return (
                <CleanerCard
                  key={cleaner.id}
                  cleaner={cleaner}
                  availableDays={availableDays}
                  selected={bookingData.cleanerId === cleaner.id}
                  onSelect={() => handleCleanerSelect(cleaner)}
                />
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!bookingData.cleanerId}
              className="min-w-[200px]"
            >
              Continue to Payment
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
