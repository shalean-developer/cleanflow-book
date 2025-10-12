import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Sparkles, Clock, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CarpetUpholstery = () => {
  const navigate = useNavigate();

  const features = [
    'Deep extraction cleaning',
    'Stain removal treatment',
    'Odor neutralization',
    'Fabric protection',
    'Professional grade equipment',
    'Eco-friendly products'
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: 'Deep Clean',
      description: 'Remove embedded dirt and allergens'
    },
    {
      icon: Clock,
      title: 'Fast Drying',
      description: 'Advanced techniques for quick drying'
    },
    {
      icon: Shield,
      title: 'Fabric Safe',
      description: 'Gentle on your upholstery'
    },
    {
      icon: Star,
      title: 'Revitalize',
      description: 'Restore like-new appearance'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#475569]">
              <ArrowRight className="w-4 h-4" />
              Specialized Service
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight">
                Carpet & Upholstery Cleaning
              </h1>
              <div className="w-16 h-[3px] bg-[#0C53ED] mx-auto"></div>
            </div>
            
            <p className="text-xl text-[#475569] max-w-2xl mx-auto">
              Deep clean to revive fabrics and remove stains. Professional treatment for carpets, sofas, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-[#0C53ED] text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                onClick={() => navigate('/booking/service/carpet-upholstery')}
              >
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#0C53ED] text-[#0C53ED] hover:bg-[#0C53ED]/5"
                onClick={() => navigate('/booking/quote')}
              >
                Get Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            What's Included
          </h2>
          <p className="text-lg text-[#475569]">
            Professional cleaning for all your soft furnishings
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Check className="h-6 w-6 text-[#0C53ED] flex-shrink-0 mt-0.5" />
              <span className="text-[#0F172A] font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            Why Choose Our Service
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0C53ED]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-6 h-6 text-[#0C53ED]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                {benefit.title}
              </h3>
              <p className="text-[#475569]">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Info */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br from-[#0C53ED]/5 to-[#2A869E]/5">
          <h2 className="text-3xl font-bold text-[#0F172A]">
            Custom Pricing
          </h2>
          <p className="text-lg text-[#475569]">
            Pricing depends on the size and number of items. Get a personalized quote based on your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#0C53ED] text-white hover:brightness-110"
              onClick={() => navigate('/booking/quote')}
            >
              Get Free Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#0C53ED] text-[#0C53ED] hover:bg-[#0C53ED]/5"
              onClick={() => navigate('/services')}
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarpetUpholstery;

