import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Shield, 
  Sparkles,
  ChevronRight,
  Users,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import serviceStandardImage from '@/assets/service-standard-cleaning.jpg';

const StandardCleaning = () => {
  const navigate = useNavigate();

  const includedByRoom = [
    {
      room: 'LIVING ROOM',
      description: 'General clean of living room and other living areas includes:',
      items: [
        'Dusting of furniture and surfaces',
        'Mopping and vacuuming of floors',
        'Dusting and wiping of skirtings',
        'Dusting and wiping of electronics, pictures frames etc.',
        'Dusting and wiping of light switches and other fixtures'
      ]
    },
    {
      room: 'KITCHEN',
      description: 'General clean of kitchen includes:',
      items: [
        'Wiping of surfaces, sinks and appliances',
        'Washing of dishes',
        'Wiping outside of cupboards and fridge',
        'Wiping of walls',
        'Emptying bins and cleaning bin area',
        'Mopping floors'
      ]
    },
    {
      room: 'BEDROOMS',
      description: 'General clean of bedrooms includes:',
      items: [
        'Dusting of furniture and surfaces',
        'Making bed',
        'Vacuuming and/or mopping floors',
        'Dusting and wiping of skirtings',
        'Folding or hanging of clothes in bedroom'
      ]
    },
    {
      room: 'BATHROOMS',
      description: 'General clean of bathrooms includes:',
      items: [
        'Cleaning of shower, bath and sinks',
        'Toilet clean',
        'Wiping of counters and taps',
        'Wiping of walls and mirrors',
        'Wiping outside of cupboards and cabinets',
        'Folding or hanging of clean towels',
        'Emptying bins and cleaning bin area',
        'Mopping floors'
      ]
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Time-Saving',
      description: 'Reclaim your weekends and free time for what matters most'
    },
    {
      icon: Shield,
      title: 'Reliable Service',
      description: 'Consistent quality with vetted and trained professionals'
    },
    {
      icon: Sparkles,
      title: 'Fresh & Clean',
      description: 'Maintain a consistently clean and healthy home environment'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: "100% satisfaction guarantee or we'll make it right"
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Book Online',
      description: 'Choose your preferred date, time, and any special requirements'
    },
    {
      step: '2',
      title: 'We Arrive',
      description: 'Our professional team arrives on time with all supplies'
    },
    {
      step: '3',
      title: 'We Clean',
      description: 'Thorough cleaning of all areas according to our checklist'
    },
    {
      step: '4',
      title: 'You Relax',
      description: 'Enjoy your spotless home while we handle the cleanup'
    }
  ];

  const faqs = [
    {
      question: 'How long does a standard cleaning take?',
      answer: 'Typically 2-4 hours depending on the size of your home and specific requirements. Larger homes or homes that haven\'t been cleaned recently may take longer.'
    },
    {
      question: 'Do I need to provide cleaning supplies?',
      answer: 'No! Our team brings all professional-grade cleaning supplies and equipment. However, if you have specific products you prefer, we\'re happy to use them.'
    },
    {
      question: 'Can I customize what gets cleaned?',
      answer: 'Absolutely! You can add special instructions during booking or speak directly with your cleaning team about any specific needs or focus areas.'
    },
    {
      question: 'What if I\'m not satisfied?',
      answer: 'We stand behind our work with a 100% satisfaction guarantee. If you\'re not happy, contact us within 24 hours and we\'ll return to make it right at no additional cost.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#475569]">
                <Home className="w-4 h-4" />
                Most Popular Service
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight">
                  Standard Cleaning
                </h1>
                <div className="w-16 h-[3px] bg-[#0C53ED]"></div>
              </div>
              
              <p className="text-xl text-[#475569] leading-relaxed">
                Regular home maintenance to keep your space fresh, tidy, and welcoming. Perfect for busy families and professionals who want to maintain a clean home without the hassle.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#475569]">
                  <Clock className="w-5 h-5 text-[#0C53ED]" />
                  <span>2-4 hours</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Users className="w-5 h-5 text-[#0C53ED]" />
                  <span>Professional team</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Award className="w-5 h-5 text-[#0C53ED]" />
                  <span>Satisfaction guaranteed</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#0C53ED] text-white hover:brightness-110 shadow-lg text-lg px-8"
                  onClick={() => navigate('/booking/service/standard-cleaning')}
                >
                  Book Standard Cleaning
                  <Calendar className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#0C53ED] text-[#0C53ED] hover:bg-[#0C53ED]/5"
                  onClick={() => navigate('/booking/quote')}
                >
                  Get Free Quote
                </Button>
              </div>

              <div className="flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
                Starting from <span className="text-2xl text-[#0C53ED]">R350</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={serviceStandardImage}
                  alt="Standard Cleaning Service"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0F172A]">1000+</div>
                    <div className="text-sm text-[#475569]">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-[#0F172A]">What's included in your clean?</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Our comprehensive standard cleaning covers all the essentials to keep your home looking its best
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {includedByRoom.map((section, index) => (
            <Card key={index} className="p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0F172A]">{section.room}</h3>
                <p className="text-sm text-[#475569]">{section.description}</p>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                      <span className="text-[#475569]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-[#475569] text-center">
            <strong className="text-[#0F172A]">Need something specific?</strong> All our services can be customized. 
            Add special instructions during booking or contact us to discuss your needs.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">Why Choose Standard Cleaning?</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              The perfect solution for maintaining a consistently clean and healthy home
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center space-y-4 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center mx-auto">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A]">{benefit.title}</h3>
                <p className="text-[#475569]">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-[#0F172A]">How It Works</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Getting your home professionally cleaned is easy with our simple 4-step process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((item, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="text-[#475569]">{item.description}</p>
              </div>
              {index < process.length - 1 && (
                <ChevronRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-[#0C53ED] opacity-30" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">Transparent Pricing</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              No hidden fees. Clear pricing based on your home's size and needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 space-y-4 border-2 border-gray-200">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#0F172A]">One-Time</h3>
                <div className="text-3xl font-bold text-[#0C53ED]">R350+</div>
                <p className="text-sm text-[#475569]">Perfect for occasional deep refreshes</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-2 border-[#0C53ED] relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0C53ED] text-white">
                Most Popular
              </Badge>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#0F172A]">Bi-Weekly</h3>
                <div className="text-3xl font-bold text-[#0C53ED]">R315+</div>
                <p className="text-sm text-[#475569]">Save 10% with regular service</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-2 border-gray-200">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#0F172A]">Weekly</h3>
                <div className="text-3xl font-bold text-[#0C53ED]">R298+</div>
                <p className="text-sm text-[#475569]">Save 15% with weekly service</p>
              </div>
            </Card>
          </div>

          <p className="text-center text-[#475569] mt-8">
            Final price depends on home size (bedrooms/bathrooms) and any additional services.
            <br />
            <Button 
              variant="link" 
              className="text-[#0C53ED] hover:underline p-0 h-auto"
              onClick={() => navigate('/booking/quote')}
            >
              Get an exact quote →
            </Button>
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-[#0F172A]">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-3">{faq.question}</h3>
              <p className="text-[#475569]">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#0C53ED] to-[#2A869E] py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready for a Cleaner Home?
          </h2>
          <p className="text-xl text-white/90">
            Book your standard cleaning service today and enjoy a spotless home without lifting a finger
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0C53ED] hover:bg-gray-100 shadow-lg text-lg px-8"
              onClick={() => navigate('/booking/service/standard-cleaning')}
            >
              Book Now
              <Calendar className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
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

export default StandardCleaning;

