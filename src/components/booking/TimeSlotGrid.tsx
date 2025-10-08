import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TimeSlotGridProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  selectedDate?: Date;
}

export const TimeSlotGrid = ({ selectedTime, onTimeSelect, selectedDate }: TimeSlotGridProps) => {
  const timeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'
  ];

  const isTimeDisabled = (time: string) => {
    if (!selectedDate) return false;
    
    const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();
    
    if (!isToday) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(dateObj);
    slotTime.setHours(hours, minutes, 0, 0);
    
    return slotTime <= now;
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {timeSlots.map((time) => {
        const disabled = isTimeDisabled(time);
        
        return (
          <Button
            key={time}
            variant={selectedTime === time ? 'default' : 'outline'}
            className={cn(
              'h-12',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !disabled && onTimeSelect(time)}
            disabled={disabled}
          >
            {time}
          </Button>
        );
      })}
    </div>
  );
};
