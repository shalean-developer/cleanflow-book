import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { TimeSlotGrid } from '../TimeSlotGrid';
import { Card } from '@/components/ui/card';

interface Step3ScheduleProps {
  onNext: () => void;
  onBack: () => void;
}

export const Step3Schedule = ({ onNext, onBack }: Step3ScheduleProps) => {
  const { bookingData, updateBooking } = useBooking();
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    bookingData.date ? new Date(bookingData.date) : undefined
  );

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = serviceAreas.filter(area =>
        area.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAreas(filtered);
    } else if (searchQuery.length === 0) {
      setFilteredAreas(serviceAreas);
    } else {
      setFilteredAreas([]);
    }
  }, [searchQuery, serviceAreas]);

  const fetchServiceAreas = async () => {
    const { data } = await supabase
      .from('service_areas')
      .select('*')
      .eq('active', true);
    
    if (data) {
      setServiceAreas(data);
      setFilteredAreas(data);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      updateBooking({ date: selectedDate });
    }
  };

  const handleTimeSelect = (time: string) => {
    updateBooking({ time });
  };

  const handleAreaChange = (areaId: string) => {
    const area = serviceAreas.find(a => a.id === areaId);
    updateBooking({ areaId, areaName: area?.name });
    setOpen(false);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBooking({ houseDetails: e.target.value });
  };

  const handleFrequencyChange = (frequency: string) => {
    updateBooking({ frequency });
  };

  const canProceed = bookingData.date && bookingData.time && bookingData.areaId;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Schedule Your Service</h2>
        <p className="text-muted-foreground">Choose your preferred date, time, and location</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-4 md:p-6">
          <Label className="text-lg mb-4 block">Select Date</Label>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium px-10",
                nav: "flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-0",
                nav_button_next: "absolute right-0",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_hidden: "invisible",
              }}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <div>
            <Label htmlFor="area" className="text-lg">Service Location</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between mt-2"
                >
                  {bookingData.areaId
                    ? serviceAreas.find((area) => area.id === bookingData.areaId)?.name
                    : "Select your area..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-background z-50" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Type at least 3 letters to search..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {searchQuery.length < 3 
                        ? "Type at least 3 letters to search" 
                        : "No location found."}
                    </CommandEmpty>
                    {searchQuery.length >= 3 && (
                      <CommandGroup>
                        {filteredAreas.map((area) => (
                          <CommandItem
                            key={area.id}
                            value={area.id}
                            onSelect={() => handleAreaChange(area.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                bookingData.areaId === area.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {area.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="address" className="text-lg">Home Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter your full home address"
              value={bookingData.houseDetails || ''}
              onChange={handleAddressChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="frequency" className="text-lg">Frequency</Label>
            <Select value={bookingData.frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger id="frequency" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="once-off">Once-off</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {date && (
        <div>
          <Label className="text-lg mb-4 block">Select Time</Label>
          <TimeSlotGrid
            selectedTime={bookingData.time}
            onTimeSelect={handleTimeSelect}
            selectedDate={date}
          />
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="min-w-[200px]">
          Continue
        </Button>
      </div>
    </div>
  );
};
