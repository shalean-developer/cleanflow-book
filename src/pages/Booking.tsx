import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookingProvider } from '@/contexts/BookingContext';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { Step1Service } from '@/components/booking/steps/Step1Service';
import { Step2Property } from '@/components/booking/steps/Step2Property';
import { Step3Schedule } from '@/components/booking/steps/Step3Schedule';
import { Step4Cleaner } from '@/components/booking/steps/Step4Cleaner';
import { Step5ReviewPay } from '@/components/booking/steps/Step5ReviewPay';

const STEPS = ['Service', 'Property', 'Schedule', 'Cleaner', 'Review'];

const BookingContent = () => {
  const { serviceName } = useParams();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (serviceName) {
      setCurrentStep(2);
    }
  }, [serviceName]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <BookingStepper currentStep={currentStep} steps={STEPS} />
        
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 mt-8">
          <div>
            {currentStep === 1 && <Step1Service onNext={nextStep} />}
            {currentStep === 2 && <Step2Property onNext={nextStep} onBack={prevStep} />}
            {currentStep === 3 && <Step3Schedule onNext={nextStep} onBack={prevStep} />}
            {currentStep === 4 && <Step4Cleaner onNext={nextStep} onBack={prevStep} />}
            {currentStep === 5 && <Step5ReviewPay onBack={prevStep} />}
          </div>
          
          {currentStep < 5 && (
            <div className="hidden lg:block">
              <BookingSummary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Booking = () => {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
};

export default Booking;
