import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ShaleanCalendar from '@/components/ui/shalean-calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { TimeSlotGrid } from '../TimeSlotGrid';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarIcon, Search, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
  const [filteredAreas, setFilteredAreas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<Date | undefined>(bookingData.date ? new Date(bookingData.date) : undefined);
  useEffect(() => {
    fetchServiceAreas();
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = serviceAreas.filter(area =>
        area.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAreas(filtered);
    } else {
      setFilteredAreas(serviceAreas);
    }
  }, [searchQuery, serviceAreas]);
  
  const fetchServiceAreas = async () => {
    const {
      data
    } = await supabase.from('service_areas').select('*').eq('active', true);
    if (data) {
      setServiceAreas(data);
      setFilteredAreas(data);
    }
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
  const getFrequencyDiscount = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return '15% off';
      case 'bi-weekly': return '10% off';
      case 'monthly': return '5% off';
      default: return '';
    }
  };

  const canProceed = bookingData.date && bookingData.time && bookingData.areaId && bookingData.address;
  return <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Schedule Your Service</h2>
        <p className="text-muted-foreground">Choose your preferred date, time, and location</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label className="text-lg mb-2 block">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <ShaleanCalendar 
                  value={date} 
                  onChange={handleDateSelect} 
                  minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="area" className="text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Service Location
            </Label>
            <Select value={bookingData.areaId} onValueChange={handleAreaChange}>
              <SelectTrigger id="area" className="mt-2">
                <SelectValue placeholder="Select your area" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <div className="sticky top-0 bg-background p-2 border-b z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredAreas.length > 0 ? (
                    filteredAreas.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No locations found
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address" className="text-lg">Service Address</Label>
            <Input
              id="address"
              placeholder="Enter your full service address"
              value={bookingData.address || ''}
              onChange={(e) => updateBooking({ address: e.target.value })}
              className="mt-2"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Please provide your complete address including street, unit number, etc.
            </p>
          </div>

          <div>
            <Label htmlFor="frequency" className="text-lg">Frequency</Label>
            <Select value={bookingData.frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger id="frequency" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="once-off">
                  <div className="flex items-center justify-between w-full">
                    <span>Once-off</span>
                  </div>
                </SelectItem>
                <SelectItem value="weekly">
                  <div className="flex items-center gap-2">
                    <span>Weekly</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                      15% off
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="bi-weekly">
                  <div className="flex items-center gap-2">
                    <span>Bi-weekly</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                      10% off
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="monthly">
                  <div className="flex items-center gap-2">
                    <span>Monthly</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                      5% off
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {bookingData.frequency !== 'once-off' && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                🎉 You're saving {getFrequencyDiscount(bookingData.frequency)} with {bookingData.frequency} service!
              </p>
            )}
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