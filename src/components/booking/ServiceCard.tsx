import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, Sparkles, Home, Zap, Move, Building, Check, Info } from 'lucide-react';
import { formatCurrencyZAR } from '@/utils/pricing';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface ServiceCardProps {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
}

// Service-specific icons mapping
const getServiceIcon = (slug: string) => {
  switch (slug) {
    case 'standard-cleaning':
      return Home;
    case 'deep-cleaning':
      return Sparkles;
    case 'move-in-out':
      return Move;
    case 'airbnb-cleaning':
      return Building;
    default:
      return Home;
  }
};

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

export function ServiceCard({ slug, name, description, basePrice }: ServiceCardProps) {
  const Icon = getServiceIcon(slug);
  const isStandardCleaning = slug === 'standard-cleaning';
  const serviceDetails = getServiceDetails(slug);

  return (
    <article 
      className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:border-[#0C53ED]/20 hover:-translate-y-0.5 transition-all duration-300 p-4 sm:p-5 md:p-6 flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#0C53ED] focus-within:ring-offset-2 relative h-full"
      role="button"
      tabIndex={0}
      aria-label={`Select ${name} service`}
    >
      {/* Most Popular Badge - Top Right Corner */}
      {isStandardCleaning && (
        <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 z-10">
          <span className="px-2 sm:px-3 py-1 text-xs font-medium text-white bg-[#0C53ED] rounded-full shadow-md">
            Most popular
          </span>
        </div>
      )}

      {/* Top Row: Icon, Title, Description */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Service Icon with Gradient Background */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          
          {/* Service Name */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] truncate mb-1">{name}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#475569] text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Price Block */}
      <div className="mb-4 sm:mb-6">
        <div className="text-2xl sm:text-3xl font-bold text-[#0F172A] tabular-nums">
          {formatCurrencyZAR(basePrice)}
          <span className="text-xs sm:text-sm font-normal text-[#475569] ml-1">from</span>
        </div>
      </div>

      {/* What's included section */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-semibold text-[#0F172A] mb-2 sm:mb-3 text-xs sm:text-sm">What's included:</h4>
        <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
          {serviceDetails.features.slice(0, 3).map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-[#0C53ED] flex-shrink-0" />
              <span className="text-[#475569] text-xs leading-relaxed">{feature}</span>
              {(feature === 'Professional cleaning team' || feature === 'Eco-friendly products') && 
               (slug === 'standard-cleaning' || slug === 'airbnb-cleaning') && (
                <InfoTooltip message="Team will and equipment only provided for extra charge contact us for the price." />
              )}
            </div>
          ))}
          {serviceDetails.features.length > 3 && (
            <div className="flex items-center gap-2 text-[#475569] text-xs">
              <span className="ml-5 sm:ml-6">+{serviceDetails.features.length - 3} more</span>
            </div>
          )}
        </div>
      </div>

      {/* Tell Me More Button with Modal */}
      <div className="mb-3 sm:mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost"
              size="sm"
              className="w-full text-[#0C53ED] hover:bg-[#0C53ED]/5 hover:text-[#0C53ED] p-1.5 sm:p-2 h-auto text-xs sm:text-sm"
            >
              <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Tell Me More
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#0F172A]">
                {name} - {serviceDetails.detailedBreakdown.title}
              </DialogTitle>
              <DialogDescription className="text-[#475569] text-base leading-relaxed">
                {serviceDetails.detailedBreakdown.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* What's Included Section */}
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-4 text-lg">What's included:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serviceDetails.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                      <span className="text-[#475569] leading-relaxed">{feature}</span>
                      {(feature === 'Professional cleaning team' || feature === 'Eco-friendly products') && 
                       (slug === 'standard-cleaning' || slug === 'airbnb-cleaning') && (
                        <InfoTooltip message="Team will and equipment only provided for extra charge contact us for the price." />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Breakdown Section */}
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-4 text-lg">Room-by-room breakdown:</h3>
                <div className="space-y-3">
                  {serviceDetails.detailedBreakdown.rooms.map((room, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <div className="w-2 h-2 rounded-full bg-[#0C53ED] flex-shrink-0 mt-2" />
                      <span className="text-[#475569] leading-relaxed font-medium">{room}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Information */}
              <div className="p-4 bg-[#F0F9FF] rounded-lg border border-[#0C53ED]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[#0F172A]">Starting Price</h4>
                    <p className="text-[#475569] text-sm">Pricing varies based on home size and specific requirements</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#0F172A]">
                      {formatCurrencyZAR(basePrice)}
                    </div>
                    <div className="text-sm text-[#475569]">from</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CTA Row */}
      <div className="mt-auto">
        <Link to={`/booking/service/${slug}`}>
          <Button 
            className="w-full bg-[#0C53ED] hover:bg-[#0C53ED]/90 hover:brightness-110 transition-all duration-200 group/btn text-xs sm:text-sm h-8 sm:h-9"
            size="sm"
          >
            Continue to Details
            <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
          </Button>
        </Link>
      </div>
    </article>
  );
}
