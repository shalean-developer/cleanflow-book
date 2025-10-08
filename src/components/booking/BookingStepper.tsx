import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingStepperProps {
  currentStep: number;
  steps: string[];
}

export const BookingStepper = ({ currentStep, steps }: BookingStepperProps) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center',
                    (isCurrent || isCompleted) ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-border relative">
                  <div
                    className={cn(
                      'absolute inset-0 bg-primary transition-transform duration-300 origin-left',
                      isCompleted ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
