import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Droplets, Building2, Sparkles, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import serviceStandardImage from '@/assets/service-standard-cleaning.jpg';
import serviceDeepImage from '@/assets/service-deep-cleaning.jpg';
import serviceMoveImage from '@/assets/service-move-inout.jpg';
import serviceSpecializedImage from '@/assets/service-specialized.jpg';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Home,
      image: serviceStandardImage,
      title: 'Standard Cleaning',
      slug: 'standard-cleaning',
      description: 'Regular home maintenance to keep your space fresh and tidy',
      features: [
        'Dusting all surfaces',
        'Vacuuming and mopping floors',
        'Kitchen cleaning and sanitizing',
        'Bathroom cleaning and disinfecting',
        'Trash removal',
        'Making beds and tidying rooms'
      ],
      price: 'From R350',
      isPopular: true
    },
    {
      icon: Droplets,
      image: serviceDeepImage,
      title: 'Deep Cleaning',
      slug: 'deep-cleaning',
      description: 'Thorough top-to-bottom cleaning for a spotless home',
      features: [
        'Behind and under furniture',
        'Inside cabinets and drawers',
        'Baseboards and crown molding',
        'Window cleaning (interior)',
        'Appliance deep clean',
        'Light fixture cleaning'
      ],
      price: 'From R550',
      isPopular: false
    },
    {
      icon: Building2,
      image: serviceMoveImage,
      title: 'Move In/Out Cleaning',
      slug: 'move-in-out',
      description: 'Complete cleaning for seamless transitions',
      features: [
        'Empty property focus',
        'All surfaces sanitized',
        'Cabinet and closet cleaning',
        'Wall spot cleaning',
        'Full kitchen and bathroom detail',
        'Ready for occupancy'
      ],
      price: 'From R650',
      isPopular: false
    },
    {
      icon: Building2,
      image: serviceStandardImage,
      title: 'Airbnb Cleaning',
      slug: 'airbnb-cleaning',
      description: 'Quick turnaround cleaning for short-term rentals',
      features: [
        'Fast turnaround service',
        'Guest-ready cleaning',
        'Linen changes',
        'Amenity restocking',
        'Same-day availability',
        'Quality inspection'
      ],
      price: 'From R550',
      isPopular: false
    },
    {
      icon: Sparkles,
      image: serviceSpecializedImage,
      title: 'Specialized Services',
      slug: 'specialized-services',
      description: 'Carpet, upholstery, and post-construction cleaning',
      features: [
        'Carpet shampooing and stain removal',
        'Upholstery deep cleaning',
        'Post-construction dust removal',
        'High-traffic area restoration',
        'Odor elimination',
        'Fabric protection treatment'
      ],
      price: 'Custom Quote',
      isPopular: false
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#475569]">
              <Sparkles className="w-4 h-4" />
              Professional Cleaning Services
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight">
                Our Services
              </h1>
              <div className="w-16 h-[3px] bg-[#0C53ED] mx-auto"></div>
            </div>
            
            <p className="text-xl text-[#475569] max-w-2xl mx-auto">
              Choose from our comprehensive range of cleaning solutions designed to meet your specific needs
            </p>
          </div>
        </div>
      </section>

      {/* Filters Strip */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full px-3 py-1.5 bg-[#EAF2FF] text-[#0C53ED] border-[#0C53ED]/30">
              All
            </Badge>
            <Badge className="rounded-full px-3 py-1.5 border-gray-200 hover:bg-[#EAF2FF] hover:text-[#0C53ED] hover:border-[#0C53ED]/30 transition-colors cursor-pointer">
              Standard
            </Badge>
            <Badge className="rounded-full px-3 py-1.5 border-gray-200 hover:bg-[#EAF2FF] hover:text-[#0C53ED] hover:border-[#0C53ED]/30 transition-colors cursor-pointer">
              Deep
            </Badge>
            <Badge className="rounded-full px-3 py-1.5 border-gray-200 hover:bg-[#EAF2FF] hover:text-[#0C53ED] hover:border-[#0C53ED]/30 transition-colors cursor-pointer">
              Move In/Out
            </Badge>
            <Badge className="rounded-full px-3 py-1.5 border-gray-200 hover:bg-[#EAF2FF] hover:text-[#0C53ED] hover:border-[#0C53ED]/30 transition-colors cursor-pointer">
              Specialized
            </Badge>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full flex flex-col focus-within:ring-2 focus-within:ring-[#0C53ED] focus-within:ring-offset-2 animate-fade-up"
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'both'
              }}
              aria-label={`${service.title} service`}
            >
              {/* Popular Tag */}
              {service.isPopular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-[#0C53ED] text-white text-xs px-2 py-1 rounded-full">
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Top Media */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Body */}
              <div className="flex-1 p-6 space-y-4">
                {/* Row 1: Icon and Price */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="tabular-nums bg-gray-100 text-[#475569] px-3 py-1">
                    {service.price}
                  </Badge>
                </div>

                {/* Name and Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#0F172A] leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-[#475569] text-sm line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* What's Included */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-[#0F172A]">What's included:</h4>
                  <ul className="space-y-2">
                    {service.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#475569]">
                        <CheckCircle className="w-4 h-4 text-[#0C53ED] flex-shrink-0" />
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 5 && (
                      <li className="text-xs text-[#0C53ED] cursor-pointer hover:underline">
                        View more ({service.features.length - 5} additional features)
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 pt-0 space-y-3">
                <Button
                  className="w-full rounded-full bg-[#0C53ED] text-white shadow-lg hover:brightness-110 hover:-translate-y-[1px] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                  onClick={() => navigate(`/booking/service/${service.slug}`)}
                >
                  Book This Service
                  <Calendar className="w-4 h-4 ml-2" />
                </Button>
                <button
                  className="w-full text-sm text-[#0C53ED] hover:underline focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded"
                  onClick={() => navigate(`/services/${service.slug}`)}
                >
                  View Details →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="rounded-2xl bg-[#F8FAFC] border border-gray-100 p-8 text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
            Not sure which service you need?
          </h3>
          <p className="text-[#475569] text-lg max-w-2xl mx-auto">
            Get a free, personalized quote based on your specific requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#0C53ED] text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
              onClick={() => navigate('/booking/quote')}
            >
              Get Free Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#0C53ED] text-[#0C53ED] hover:bg-[#0C53ED]/5 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
              onClick={() => navigate('/booking/service/select')}
            >
              Book Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
