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
    <div className="flex items-center gap-2 w-full">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={isPastDate(addDays(startDate, -1))}
        className="shrink-0 rounded-xl border-gray-200 hover:border-[#0C53ED]/30 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1 overflow-x-auto scroll-snap-x scroll-snap-mandatory">
        <div className="flex gap-3 pb-2 min-w-max">
          {visibleDates.map((date) => {
            const isDateSelected = isSelected(date);
            const isDateDisabled = isDisabled(date) || isPastDate(date);
            
            return (
              <button
                key={format(date, 'yyyy-MM-dd')}
                onClick={() => !isDateDisabled && onSelect(date)}
                disabled={isDateDisabled}
                aria-pressed={isDateSelected}
                aria-label={`Select ${format(date, 'EEEE, MMMM d')}`}
                className={`
                  relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 min-w-[80px] scroll-snap-start
                  ${isDateSelected 
                    ? 'bg-[#EAF2FF] border-[#0C53ED]/30 text-[#0C53ED] shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-[#0C53ED]/30 hover:shadow-sm motion-safe:hover:scale-105'
                  }
                  ${isDateDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  focus:outline-none focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2
                `}
              >
                <span className="text-xs font-medium uppercase tracking-wide">
                  {format(date, 'EEE')}
                </span>
                <span className="text-sm font-semibold mt-1 tabular-nums">
                  {format(date, 'MMM d')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        className="shrink-0 rounded-xl border-gray-200 hover:border-[#0C53ED]/30 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
