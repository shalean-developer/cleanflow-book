import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { TimeSlotGrid } from '../TimeSlotGrid';
import { Card } from '@/components/ui/card';
interface Step3ScheduleProps {
  onNext: () => void;
  onBack: () => void;
}
export const Step3Schedule = ({
  onNext,
  onBack
}: Step3ScheduleProps) => {
  const {
    bookingData,
    updateBooking
  } = useBooking();
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [date, setDate] = useState<Date | undefined>(bookingData.date ? new Date(bookingData.date) : undefined);
  useEffect(() => {
    fetchServiceAreas();
  }, []);
  const fetchServiceAreas = async () => {
    const {
      data
    } = await supabase.from('service_areas').select('*').eq('active', true);
    if (data) setServiceAreas(data);
  };
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      updateBooking({
        date: selectedDate
      });
    }
  };
  const handleTimeSelect = (time: string) => {
    updateBooking({
      time
    });
  };
  const handleAreaChange = (areaId: string) => {
    const area = serviceAreas.find(a => a.id === areaId);
    updateBooking({
      areaId,
      areaName: area?.name
    });
  };
  const handleFrequencyChange = (frequency: string) => {
    updateBooking({
      frequency
    });
  };
  const canProceed = bookingData.date && bookingData.time && bookingData.areaId;
  return <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Schedule Your Service</h2>
        <p className="text-muted-foreground">Choose your preferred date, time, and location</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <Label className="text-lg mb-4 block">Select Date</Label>
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))} className="rounded-md border w-full" />
        </Card>

        <div className="space-y-6">
          <div>
            <Label htmlFor="area" className="text-lg">Service Location</Label>
            <Select value={bookingData.areaId} onValueChange={handleAreaChange}>
              <SelectTrigger id="area" className="mt-2">
                <SelectValue placeholder="Select your area" />
              </SelectTrigger>
              <SelectContent>
                {serviceAreas.map(area => <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="frequency" className="text-lg">Frequency</Label>
            <Select value={bookingData.frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger id="frequency" className="mt-2 my-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once-off">Once-off</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {date && <div>
          <Label className="text-lg mb-4 block">Select Time</Label>
          <TimeSlotGrid selectedTime={bookingData.time} onTimeSelect={handleTimeSelect} selectedDate={date} />
        </div>}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="min-w-[200px]">
          Continue
        </Button>
      </div>
    </div>;
};