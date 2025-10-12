import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { StickySummary } from '@/components/booking/StickySummary';
import { useBookingStore } from '@/store/bookingStore';
import { formatCurrencyZAR } from '@/utils/pricing';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/info-tooltip';

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setService } = useBookingStore();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
      return data;
    },
  });

  const handleContinue = () => {
    if (service) {
      setService(service.id, service.name, service.slug);
      navigate('/booking/details');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Service not found</h1>
        <Button onClick={() => navigate('/booking/service/select')}>Back to Services</Button>
      </div>
    );
  }

  // Service-specific features and detailed breakdown
  const getServiceDetails = (slug: string) => {
    const commonFeatures = [
      'Professional cleaning team',
      'Flexible scheduling',
      'Insurance covered',
      'Eco-friendly products',
      'Satisfaction guaranteed',
      'Background-checked staff',
    ];

    switch (slug) {
      case 'standard-cleaning':
        return {
          features: commonFeatures,
          detailedBreakdown: {
            title: 'Top-to-bottom clean',
            description: 'Indoor Cleaning includes a clean of all common areas in your home, including your bedrooms, bathrooms, living room(s) and kitchen.',
            rooms: [
              'Bedrooms - Dusting, vacuuming, making beds',
              'Bathrooms - Sanitizing, scrubbing, mopping',
              'Living Rooms - Dusting, vacuuming, organizing',
              'Kitchen - Counter cleaning, appliance wiping, floor mopping',
              'Common Areas - Hallways, stairs, general tidying'
            ]
          }
        };
      case 'deep-cleaning':
        return {
          features: [...commonFeatures, 'Detailed scrubbing', 'Hard-to-reach areas'],
          detailedBreakdown: {
            title: 'Comprehensive deep clean',
            description: 'Thorough cleaning service covering all areas in detail, including hard-to-reach spaces and intensive scrubbing.',
            rooms: [
              'Bedrooms - Deep dusting, mattress cleaning, wardrobe organization',
              'Bathrooms - Grout cleaning, tile scrubbing, fixture polishing',
              'Living Rooms - Furniture deep cleaning, baseboard cleaning',
              'Kitchen - Appliance deep cleaning, cabinet interior cleaning',
              'Additional Areas - Light fixtures, window sills, door frames'
            ]
          }
        };
      case 'move-in-out':
        return {
          features: [...commonFeatures, 'Move-in/out specialized', 'Complete property cleaning'],
          detailedBreakdown: {
            title: 'Complete move cleaning',
            description: 'Comprehensive cleaning for moving in or out of a property, ensuring every corner is spotless.',
            rooms: [
              'All Rooms - Complete top-to-bottom cleaning',
              'Kitchen - Deep appliance cleaning, cabinet interior',
              'Bathrooms - Intensive sanitizing, grout cleaning',
              'Bedrooms - Wardrobe cleaning, mattress sanitizing',
              'Storage Areas - Closets, cupboards, built-ins',
              'Windows - Interior and accessible exterior cleaning'
            ]
          }
        };
      case 'airbnb-cleaning':
      case 'airbnb-turnover':
        return {
          features: [...commonFeatures, 'Quick turnaround', 'Guest-ready standards'],
          detailedBreakdown: {
            title: 'Guest-ready cleaning',
            description: 'Quick turnaround cleaning for short-term rentals, ensuring every guest arrives to a pristine space.',
            rooms: [
              'All Rooms - Guest-ready standard cleaning',
              'Kitchen - Appliance cleaning, counter sanitizing',
              'Bathrooms - Complete sanitizing, amenity restocking',
              'Bedrooms - Fresh linens, spot cleaning',
              'Common Areas - Quick tidy, surface cleaning',
              'Special Touches - Welcome amenities check'
            ]
          }
        };
      case 'move-in-out-cleaning':
        return {
          features: [...commonFeatures, 'Move-in/out specialized', 'Complete property cleaning'],
          detailedBreakdown: {
            title: 'Complete move cleaning',
            description: 'Comprehensive cleaning for moving in or out of a property, ensuring every corner is spotless.',
            rooms: [
              'All Rooms - Complete top-to-bottom cleaning',
              'Kitchen - Deep appliance cleaning, cabinet interior',
              'Bathrooms - Intensive sanitizing, grout cleaning',
              'Bedrooms - Wardrobe cleaning, mattress sanitizing',
              'Storage Areas - Closets, cupboards, built-ins',
              'Windows - Interior and accessible exterior cleaning'
            ]
          }
        };
      case 'carpet-upholstery':
        return {
          features: [...commonFeatures, 'Deep extraction', 'Stain removal', 'Odor neutralization'],
          detailedBreakdown: {
            title: 'Carpet & Upholstery deep clean',
            description: 'Professional cleaning to revive fabrics and remove embedded dirt, stains, and allergens.',
            rooms: [
              'Carpets - Deep extraction cleaning',
              'Sofas & Chairs - Fabric cleaning and protection',
              'Stain Treatment - Targeted stain removal',
              'Odor Removal - Neutralization treatment',
              'Fabric Protection - Optional protective coating',
              'Fast Drying - Advanced drying techniques'
            ]
          }
        };
      case 'post-construction':
        return {
          features: [...commonFeatures, 'Construction cleanup', 'Debris removal', 'Final polish'],
          detailedBreakdown: {
            title: 'Post-construction cleanup',
            description: 'Thorough cleaning after renovations or construction to make your space move-in ready.',
            rooms: [
              'All Areas - Dust and debris removal',
              'Windows - Paint splatter and frame cleaning',
              'Floors - Deep cleaning and polishing',
              'Fixtures - Complete cleaning and inspection',
              'Surfaces - Detail finishing touches',
              'Final Check - Walkthrough and quality assurance'
            ]
          }
        };
      case 'specialized':
        return {
          features: [...commonFeatures, 'Targeted cleaning', 'Specialized equipment'],
          detailedBreakdown: {
            title: 'Specialized cleaning services',
            description: 'Custom cleaning solutions for specific needs including windows, walls, and more.',
            rooms: [
              'Interior Windows - Streak-free cleaning',
              'Walls - Spot cleaning and wiping',
              'Baseboards - Detailed cleaning',
              'Light Fixtures - Dusting and polishing',
              'Special Areas - Custom cleaning as needed'
            ]
          }
        };
      default:
        return {
          features: commonFeatures,
          detailedBreakdown: {
            title: 'Standard cleaning service',
            description: 'Regular cleaning service for maintaining your home\'s cleanliness.',
            rooms: ['All common areas cleaned', 'Standard tidying and organizing']
          }
        };
    }
  };

  const serviceDetails = getServiceDetails(service.slug);

  const isStandardCleaning = service.slug === 'standard-cleaning';
  const showTeamNote = ['standard-cleaning', 'airbnb-cleaning', 'airbnb-turnover'].includes(service.slug);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section aria-label="Selected service" className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Back Link */}
          <div 
            className="animate-fade-up mb-6"
            style={{ animationDelay: '0ms', animationFillMode: 'both' }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/booking/service/select')} 
              className="p-2 text-[#475569] hover:text-[#0F172A] hover:underline focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Service Detail Card */}
            <div 
              className="lg:col-span-2 animate-fade-up"
              style={{ animationDelay: '80ms', animationFillMode: 'both' }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:ring-2 hover:ring-[#0C53ED]/10 transition-all duration-300 p-6 md:p-8">
                {/* Top Row: Service Name with Accent */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-[#0F172A] tracking-tight mb-2">
                    {service.name}
                  </h1>
                  <div className="w-16 h-[3px] bg-[#0C53ED] mb-4"></div>
                  <p className="text-[#475569] text-lg max-w-[60ch] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price Block */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-[#0F172A] tabular-nums">
                      {formatCurrencyZAR(Number(service.base_price))}
                    </span>
                    <span className="text-sm text-[#475569]">starting from</span>
                  </div>
                  {isStandardCleaning && (
                    <div className="inline-flex items-center px-3 py-1 text-xs font-medium text-[#0C53ED] bg-[#0C53ED]/10 rounded-full">
                      Most Popular
                    </div>
                  )}
                </div>

                {/* What's included */}
                <div className="mb-8">
                  <h2 className="font-semibold text-[#0F172A] mb-4">What's included:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceDetails.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                        <span className="text-[#475569] leading-relaxed">{feature}</span>
                        {(feature === 'Professional cleaning team' || feature === 'Eco-friendly products') && 
                         showTeamNote && (
                          <InfoTooltip message="Team and equipment only provided for extra charge. Contact us for pricing." />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="mb-8">
                  <h2 className="font-semibold text-[#0F172A] mb-4">
                    {serviceDetails.detailedBreakdown.title}
                  </h2>
                  <p className="text-[#475569] mb-4 leading-relaxed">
                    {serviceDetails.detailedBreakdown.description}
                  </p>
                  <div className="space-y-2">
                    {serviceDetails.detailedBreakdown.rooms.map((room, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#0C53ED] flex-shrink-0 mt-2" />
                        <span className="text-[#475569] leading-relaxed">{room}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={handleContinue}
                  className="w-full md:w-auto rounded-full bg-[#0C53ED] text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                  size="lg"
                  aria-label={`Continue to details for ${service.name}`}
                >
                  Continue to Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Booking Summary */}
            <div 
              className="lg:block hidden animate-fade-up"
              style={{ animationDelay: '160ms', animationFillMode: 'both' }}
            >
              <div className="sticky top-6">
                <StickySummary />
              </div>
            </div>
          </div>

          {/* Mobile Booking Summary */}
          <div 
            className="lg:hidden mt-8 animate-fade-up"
            style={{ animationDelay: '160ms', animationFillMode: 'both' }}
          >
            <StickySummary />
          </div>
        </section>
      </main>
    </div>
  );
}
