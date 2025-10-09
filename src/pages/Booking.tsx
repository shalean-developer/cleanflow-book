import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BookingProvider, useBooking } from '@/contexts/BookingContext';
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
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = useBooking();
  const [currentStep, setCurrentStep] = useState(1);

  // Determine current step from URL
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/review')) {
      setCurrentStep(5);
    } else if (path.includes('/cleaner')) {
      setCurrentStep(4);
    } else if (path.includes('/schedule')) {
      setCurrentStep(3);
    } else if (path.includes('/property')) {
      setCurrentStep(2);
    } else if (serviceName) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [location.pathname, serviceName]);

  const getServiceSlug = () => {
    if (serviceName) return serviceName;
    if (bookingData.serviceName) {
      return bookingData.serviceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    return 'select';
  };

  const nextStep = () => {
    const slug = getServiceSlug();
    const stepRoutes = [
      `/booking/service/select`,
      `/booking/service/${slug}/property`,
      `/booking/service/${slug}/schedule`,
      `/booking/service/${slug}/cleaner`,
      `/booking/service/${slug}/review`,
    ];
    
    if (currentStep < 5) {
      navigate(stepRoutes[currentStep]);
    }
  };

  const prevStep = () => {
    const slug = getServiceSlug();
    const stepRoutes = [
      `/booking/service/select`,
      `/booking/service/${slug}/property`,
      `/booking/service/${slug}/schedule`,
      `/booking/service/${slug}/cleaner`,
      `/booking/service/${slug}/review`,
    ];
    
    if (currentStep > 1) {
      navigate(stepRoutes[currentStep - 2]);
    }
  };

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
