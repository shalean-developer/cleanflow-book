import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Calendar, Sparkles, Home, MapPinIcon, Droplets, Trash2, TruckIcon, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSuburbsByArea } from '@/data/suburbs';

const Locations = () => {
  const navigate = useNavigate();

  const availableServices = [
    {
      name: 'Standard Cleaning',
      icon: Home,
      color: 'text-blue-600'
    },
    {
      name: 'Deep Cleaning',
      icon: Droplets,
      color: 'text-purple-600'
    },
    {
      name: 'Move In/Out',
      icon: TruckIcon,
      color: 'text-green-600'
    },
    {
      name: 'Specialized Services',
      icon: Wrench,
      color: 'text-orange-600'
    },
    {
      name: 'Post-Construction',
      icon: Trash2,
      color: 'text-red-600'
    },
    {
      name: 'Office Cleaning',
      icon: Sparkles,
      color: 'text-teal-600'
    }
  ];

  const serviceAreas = [
    {
      area: 'City Bowl',
      suburbs: getSuburbsByArea('City Bowl')
    },
    {
      area: 'Atlantic Seaboard',
      suburbs: getSuburbsByArea('Atlantic Seaboard')
    },
    {
      area: 'Southern Suburbs',
      suburbs: getSuburbsByArea('Southern Suburbs')
    },
    {
      area: 'Northern Suburbs',
      suburbs: getSuburbsByArea('Northern Suburbs')
    },
    {
      area: 'West Coast',
      suburbs: getSuburbsByArea('West Coast')
    },
    {
      area: 'False Bay',
      suburbs: getSuburbsByArea('False Bay')
    }
  ];

  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#F8FAFC] py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border-gray-200 text-gray-700 rounded-full hover:shadow-md transition-all duration-300">
              <MapPin className="w-4 h-4" />
              Serving Cape Town
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] leading-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
              Service <span className="bg-gradient-to-r from-[#0C53ED] to-[#2A869E] bg-clip-text text-transparent">Locations</span>
            </h1>
            <p className="text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '200ms' }}>
              We proudly serve homes and businesses across Cape Town and surrounding areas
            </p>
          </div>
        </div>
      </section>

      {/* Service Areas Grid */}
      <section className="py-20 space-y-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-6 relative">
              Where We Clean
              <div className="w-16 h-[3px] bg-[#0C53ED] mx-auto mt-4 rounded-full"></div>
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              Professional cleaning services available in the following areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {serviceAreas.map((location, i) => (
              <section 
                key={i} 
                aria-label={`${location.area} region`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] hover:border-[#0C53ED]/20 p-6 group animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0F172A]">{location.area}</h3>
                    <p className="text-sm text-[#475569]">{location.suburbs.length} suburbs</p>
                  </div>
                </div>
                
                {/* Services Available */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <p className="text-sm font-medium text-[#0F172A] mb-3">Available Services:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {availableServices.map((service, idx) => {
                      const ServiceIcon = service.icon;
                      return (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#0C53ED] transition-colors cursor-pointer group/service"
                          title={`${service.name} available in ${location.area}`}
                        >
                          <ServiceIcon className={`w-4 h-4 flex-shrink-0 ${service.color} group-hover/service:scale-110 transition-transform`} />
                          <span className="text-xs sm:text-sm truncate">{service.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-[#0F172A] mb-3">Suburbs We Serve:</p>
                  <div className="max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {location.suburbs.map((suburb, idx) => (
                        <span 
                          key={idx}
                          onClick={() => navigate(`/locations/${suburb.slug}`)}
                          className="inline-flex items-center gap-1 rounded-full bg-[#EAF2FF] text-[#0C53ED] text-sm font-medium px-3 py-1 transition-colors hover:bg-[#D6E8FF] cursor-pointer"
                          title={`View ${suburb.name} cleaning services`}
                        >
                          <CheckCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate max-w-[120px]">{suburb.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Info */}
      <section className="py-20 space-y-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-up hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0C53ED] to-[#2A869E] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Don't see your area?</h3>
                <p className="text-[#475569] leading-relaxed">
                  We're constantly expanding our service areas. If your location isn't listed above, don't worry! 
                  We're actively expanding our coverage throughout Cape Town. Contact us to check if we can 
                  accommodate your area, or join our waitlist to be notified when we expand to your neighborhood.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-[#0C53ED] hover:bg-[#0A47D1] text-white rounded-full px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                aria-label="Contact us about service availability"
              >
                Contact Us
              </Button>
              <Button 
                variant="outline"
                className="border border-[#0C53ED] text-[#0C53ED] hover:bg-[#0C53ED] hover:text-white rounded-full px-8 py-3 font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                aria-label="Join waitlist for new areas"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 space-y-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-[#F8FAFC] to-white border border-gray-100 rounded-2xl p-8 md:p-12 text-center animate-fade-up hover:shadow-md transition-all duration-300">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6">
              Ready to book a cleaning?
            </h2>
            <p className="text-[#475569] text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Schedule your service today and experience the Shalean difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/booking/service/select')}
                className="bg-[#0C53ED] hover:bg-[#0A47D1] text-white rounded-full px-8 py-4 font-medium shadow-lg hover:shadow-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 flex items-center gap-2"
                aria-label="Book a cleaning service now"
              >
                <Calendar className="w-5 h-5" />
                Book Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/booking/quote')}
                className="border border-[#0C53ED] text-[#0C53ED] hover:bg-[#0C53ED] hover:text-white rounded-full px-8 py-4 font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                aria-label="Get a free quote for cleaning services"
              >
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Locations;
