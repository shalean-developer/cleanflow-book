import { useState, useEffect } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const today = startOfDay(new Date());
  
  // Generate 7 visible dates to fill the available space
  const visibleDates = Array.from({ length: 7 }, (_, i) => 
    addDays(startDate, i)
  );

  // Reset animation state after animation completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handlePrevious = () => {
    const newStart = addDays(startDate, -1);
    if (newStart >= today) {
      setIsAnimating(true);
      setAnimationDirection('right');
      setStartDate(newStart);
    }
  };

  const handleNext = () => {
    setIsAnimating(true);
    setAnimationDirection('left');
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

      <div className="flex-1 overflow-hidden">
        <div className={`flex gap-3 pb-2 justify-center transition-all duration-300 ease-in-out ${
          isAnimating 
            ? animationDirection === 'left' 
              ? 'transform translate-x-4 opacity-60 scale-95' 
              : 'transform -translate-x-4 opacity-60 scale-95'
            : 'transform translate-x-0 opacity-100 scale-100'
        }`}>
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
