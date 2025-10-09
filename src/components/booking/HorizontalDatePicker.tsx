import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfDay } from 'date-fns';

interface HorizontalDatePickerProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
}

export function HorizontalDatePicker({ selected, onSelect, disabled }: HorizontalDatePickerProps) {
  const [startDate, setStartDate] = useState(new Date());
  const today = startOfDay(new Date());
  
  // Generate 5 visible dates
  const visibleDates = Array.from({ length: 5 }, (_, i) => 
    addDays(startDate, i)
  );

  const handlePrevious = () => {
    const newStart = addDays(startDate, -1);
    if (newStart >= today) {
      setStartDate(newStart);
    }
  };

  const handleNext = () => {
    setStartDate(addDays(startDate, 1));
  };

  const isDisabled = (date: Date) => {
    return disabled ? disabled(date) : false;
  };

  const isSelected = (date: Date) => {
    return selected ? format(date, 'yyyy-MM-dd') === format(selected, 'yyyy-MM-dd') : false;
  };

  const isPastDate = (date: Date) => {
    return startOfDay(date) < today;
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-3xl mx-auto">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={isPastDate(addDays(startDate, -1))}
        className="shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1 grid grid-cols-5 gap-2">
        {visibleDates.map((date) => {
          const isDateSelected = isSelected(date);
          const isDateDisabled = isDisabled(date) || isPastDate(date);
          
          return (
            <button
              key={format(date, 'yyyy-MM-dd')}
              onClick={() => !isDateDisabled && onSelect(date)}
              disabled={isDateDisabled}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                ${isDateSelected 
                  ? 'bg-[#0C53ED] border-[#0C53ED] text-white' 
                  : 'bg-card border-border hover:border-[#0C53ED]/30 hover:bg-accent'
                }
                ${isDateDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-xs font-medium">
                {format(date, 'EEE')}
              </span>
              <span className="text-sm font-semibold mt-1">
                {format(date, 'MMM d')}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        className="shrink-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
