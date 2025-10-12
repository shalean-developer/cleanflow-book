import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Calendar, Home, Clock, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSuburbBySlug } from '@/data/suburbs';
import { useEffect } from 'react';

const SuburbDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const suburb = slug ? getSuburbBySlug(slug) : undefined;

  useEffect(() => {
    if (!suburb) {
      navigate('/locations');
    }
  }, [suburb, navigate]);

  if (!suburb) {
    return null;
  }

  const services = [
    'Standard Cleaning',
    'Deep Cleaning',
    'Move-In/Out Cleaning',
    'Carpet Cleaning',
    'Window Cleaning',
    'Post-Construction Cleaning'
  ];

  const features = [
    { icon: Shield, title: 'Trusted Professionals', description: 'Background-checked cleaners' },
    { icon: Clock, title: 'Flexible Scheduling', description: 'Book at your convenience' },
    { icon: Sparkles, title: 'Quality Guaranteed', description: '100% satisfaction promise' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#F8FAFC] py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <Button
              variant="ghost"
              onClick={() => navigate('/locations')}
              className="mb-4 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Button>
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border-gray-200 text-gray-700 rounded-full hover:shadow-md transition-all duration-300">
              <MapPin className="w-4 h-4" />
              {suburb.area}
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] leading-tight">
              Cleaning Services in <span className="bg-gradient-to-r from-[#0C53ED] to-[#2A869E] bg-clip-text text-transparent">{suburb.name}</span>
            </h1>
            <p className="text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed">
              {suburb.description}
            </p>
          </div>
        </div>
      </section>

      {/* About the Area */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <h2 className="text-4xl font-bold text-[#0F172A]">
                Serving {suburb.name}
                <div className="w-16 h-[3px] bg-[#0C53ED] mt-4 rounded-full"></div>
              </h2>
              <p className="text-[#475569] text-lg leading-relaxed">
                {suburb.detailedDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
              {features.map((feature, idx) => (
                <Card key={idx} className="border-gray-100 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0C53ED] to-[#2A869E] flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A] mb-1">{feature.title}</h3>
                      <p className="text-[#475569] text-sm">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Available */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-6">
              Services Available in {suburb.name}
              <div className="w-16 h-[3px] bg-[#0C53ED] mx-auto mt-4 rounded-full"></div>
            </h2>
            <p className="text-[#475569] text-lg max-w-2xl mx-auto">
              Comprehensive cleaning solutions for your home or business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {services.map((service, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-100 hover:border-[#0C53ED]/20 hover:shadow-md transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <CheckCircle className="w-5 h-5 text-[#0C53ED] flex-shrink-0" />
                <span className="text-[#0F172A] font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-[#0C53ED] to-[#2A869E] rounded-2xl p-8 md:p-12 text-center text-white animate-fade-up">
            <Home className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready for a Spotless Home in {suburb.name}?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
              Book your cleaning service today and experience the Shalean difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/booking/service/select')}
                className="bg-white text-[#0C53ED] hover:bg-gray-50 rounded-full px-8 py-4 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/booking/quote')}
                className="border-2 border-white text-white hover:bg-white hover:text-[#0C53ED] rounded-full px-8 py-4 font-medium transition-all duration-200"
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

export default SuburbDetail;

