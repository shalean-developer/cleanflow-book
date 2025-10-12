import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { serviceGroups } from '@/data/services';

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#475569]">
              <ArrowRight className="w-4 h-4" />
              Professional Cleaning Services
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight">
                Our Cleaning Services
              </h1>
              <div className="w-16 h-[3px] bg-[#0C53ED] mx-auto"></div>
            </div>
            
            <p className="text-xl text-[#475569] max-w-2xl mx-auto">
              Choose a category, then pick the service that fits your home.
            </p>
          </div>
        </div>
      </section>

      {/* Service Groups */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="space-y-20">
          {serviceGroups.map((group, groupIndex) => (
            <div key={group.id} className="space-y-8">
              {/* Group Header */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0C53ED] flex items-center justify-center">
                    <group.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
                    {group.title}
                  </h2>
                </div>
                <p className="text-lg text-[#475569] max-w-2xl mx-auto">
                  {group.description}
                </p>
              </div>

              {/* Services Grid */}
              <div className={`grid gap-6 ${
                group.services.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                group.services.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                group.services.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {group.services.map((service, serviceIndex) => (
                  <article
                    key={service.slug}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col focus-within:ring-2 focus-within:ring-[#0C53ED] focus-within:ring-offset-2"
                    style={{
                      animationDelay: `${(groupIndex * 200) + (serviceIndex * 100)}ms`,
                      animationFillMode: 'both'
                    }}
                    aria-label={`${service.name} service`}
                  >
                    {/* Badge */}
                    {service.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-[#0C53ED] text-white text-xs px-2 py-1 rounded-full">
                          {service.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 space-y-4">
                      {/* Header with Price */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-[#0F172A] leading-tight mb-2">
                            {service.name}
                          </h3>
                          <p className="text-[#475569] text-sm line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                        <Badge className="flex-shrink-0 bg-gray-100 text-[#475569] px-3 py-1 rounded-full text-sm font-medium">
                          {service.priceLabel}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3 pt-2">
                        <Button
                          className="w-full bg-[#0C53ED] text-white hover:bg-[#0C53ED]/90 hover:text-white shadow-md hover:shadow-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                          onClick={() => navigate(service.href)}
                        >
                          Book Now →
                        </Button>
                        <button
                          className="w-full text-sm text-[#0C53ED] hover:underline focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded text-center"
                          onClick={() => navigate(`/services/${service.slug}`)}
                        >
                          Learn more
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
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
