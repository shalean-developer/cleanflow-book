import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Hammer, Trash2, Sparkles, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostConstruction = () => {
  const navigate = useNavigate();

  const features = [
    'Dust and debris removal',
    'Paint splatter cleaning',
    'Window and frame cleaning',
    'Floor deep cleaning',
    'Fixture and appliance cleaning',
    'Final inspection walkthrough'
  ];

  const areas = [
    {
      icon: Hammer,
      title: 'Construction Cleanup',
      description: 'Remove all construction dust and debris'
    },
    {
      icon: Trash2,
      title: 'Waste Removal',
      description: 'Dispose of leftover materials properly'
    },
    {
      icon: Sparkles,
      title: 'Detail Finishing',
      description: 'Polish and perfect every surface'
    },
    {
      icon: Shield,
      title: 'Safety Check',
      description: 'Ensure the space is safe and clean'
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
                Post-Construction Cleaning
              </h1>
              <div className="w-16 h-[3px] bg-[#0C53ED] mx-auto"></div>
            </div>
            
            <p className="text-xl text-[#475569] max-w-2xl mx-auto">
              Dust and debris removal after renovations. Transform your construction site into a pristine, move-in ready space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-[#0C53ED] text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                onClick={() => navigate('/booking/service/post-construction')}
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
            Comprehensive cleaning after construction or renovation
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

      {/* Service Areas */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            Our Process
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0C53ED]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <area.icon className="w-6 h-6 text-[#0C53ED]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                {area.title}
              </h3>
              <p className="text-[#475569]">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ideal For */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-6 text-center">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-[#0F172A] mb-2">Renovations</h3>
              <p className="text-[#475569]">Kitchen, bathroom, or whole home renovations</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-[#0F172A] mb-2">New Construction</h3>
              <p className="text-[#475569]">Brand new builds ready for occupancy</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-[#0F172A] mb-2">Remodeling</h3>
              <p className="text-[#475569]">Room additions and structural changes</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-[#0F172A] mb-2">Commercial Spaces</h3>
              <p className="text-[#475569]">Office and retail space preparation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br from-[#0C53ED]/5 to-[#2A869E]/5">
          <h2 className="text-3xl font-bold text-[#0F172A]">
            Custom Pricing Based on Project Size
          </h2>
          <p className="text-lg text-[#475569]">
            Every construction project is unique. Get a personalized quote based on your specific needs and project size.
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

export default PostConstruction;

