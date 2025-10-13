import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Droplets, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Shield, 
  Sparkles,
  ChevronRight,
  Target,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ServiceStructuredData } from '@/components/StructuredData';
import serviceDeepImage from '@/assets/service-deep-cleaning.jpg';

const DeepCleaning = () => {
  const navigate = useNavigate();

  const included = [
    'All standard cleaning tasks included',
    'Behind and under all furniture and appliances',
    'Inside cabinets and drawers (kitchen & bathroom)',
    'Baseboards and crown molding throughout',
    'Interior window cleaning and tracks',
    'Deep clean and degrease range hood and filters',
    'Oven interior cleaning',
    'Refrigerator interior cleaning',
    'Dishwasher deep clean',
    'Light fixture cleaning and dusting',
    'Door frames and handles sanitizing',
    'Ceiling fan cleaning',
    'Vent and air register cleaning',
    'Grout scrubbing and tile cleaning',
    'Deep carpet vacuuming with attention to edges',
    'Wall spot cleaning and scuff removal'
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Thorough Clean',
      description: 'We clean areas often missed in regular cleaning routines'
    },
    {
      icon: Shield,
      title: 'Healthier Home',
      description: 'Remove allergens, dust mites, and bacteria from deep within'
    },
    {
      icon: Sparkles,
      title: 'Fresh Start',
      description: 'Perfect for seasonal cleaning or after extended periods'
    },
    {
      icon: Award,
      title: 'Professional Grade',
      description: 'Industrial equipment and hospital-grade cleaning solutions'
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Initial Assessment',
      description: 'We evaluate your home and discuss priority areas and concerns'
    },
    {
      step: '2',
      title: 'Systematic Approach',
      description: 'Room-by-room deep cleaning following our comprehensive checklist'
    },
    {
      step: '3',
      title: 'Detail Focus',
      description: 'Special attention to overlooked areas and hard-to-reach spots'
    },
    {
      step: '4',
      title: 'Final Inspection',
      description: 'Quality check to ensure every area meets our high standards'
    }
  ];

  const whenToBook = [
    {
      title: 'Seasonal Cleaning',
      description: 'Spring and fall deep cleans to refresh your home'
    },
    {
      title: 'Moving In/Out',
      description: 'Start fresh in your new home or prepare for new occupants'
    },
    {
      title: 'After Renovations',
      description: 'Remove construction dust and debris thoroughly'
    },
    {
      title: 'Before Special Events',
      description: 'Ensure your home looks its absolute best for guests'
    },
    {
      title: 'Extended Neglect',
      description: 'When regular cleaning hasn\'t been possible for a while'
    },
    {
      title: 'Health Concerns',
      description: 'Reduce allergens for family members with sensitivities'
    }
  ];

  const faqs = [
    {
      question: 'How is deep cleaning different from standard cleaning?',
      answer: 'Deep cleaning includes everything in standard cleaning plus intensive work on areas that aren\'t typically covered in regular maintenance. This includes behind appliances, inside cabinets, baseboards, light fixtures, and more thorough cleaning of all surfaces.'
    },
    {
      question: 'How long does a deep clean take?',
      answer: 'Deep cleaning typically takes 4-8 hours depending on home size and condition. Larger homes or those that haven\'t been deep cleaned recently may require a full day or multiple team members.'
    },
    {
      question: 'Do I need to move furniture?',
      answer: 'No, our team will carefully move light furniture as needed. However, if you have heavy or valuable items you\'d prefer not moved, please let us know in advance and we\'ll work around them.'
    },
    {
      question: 'How often should I get a deep clean?',
      answer: 'We recommend a deep clean 2-4 times per year (seasonally), complemented by regular standard cleaning in between. However, frequency depends on your lifestyle, home size, and personal preferences.'
    },
    {
      question: 'Can I combine deep cleaning with regular service?',
      answer: 'Absolutely! Many clients schedule a deep clean initially, then maintain their home with regular bi-weekly or monthly standard cleaning. This is the most cost-effective approach.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <SEO 
        title="Deep Cleaning Service Cape Town - Thorough Home Cleaning"
        description="Professional deep cleaning service in Cape Town. Behind furniture, inside cabinets, oven cleaning, refrigerator cleaning, baseboards, and more. Perfect for spring cleaning or special occasions."
        keywords="deep cleaning Cape Town, thorough cleaning, spring cleaning, oven cleaning, cabinet cleaning, intensive cleaning, detailed home cleaning"
        canonical="https://shalean.co.za/services/deep-cleaning"
      />
      <ServiceStructuredData 
        name="Deep Cleaning Service"
        description="Comprehensive deep cleaning including all standard cleaning plus behind furniture, inside cabinets, oven and refrigerator cleaning"
        url="https://shalean.co.za/services/deep-cleaning"
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#475569]">
                <Droplets className="w-4 h-4" />
                Intensive Cleaning Service
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight">
                  Deep Cleaning
                </h1>
                <div className="w-16 h-[3px] bg-[#0C53ED]"></div>
              </div>
              
              <p className="text-xl text-[#475569] leading-relaxed">
                Thorough top-to-bottom cleaning that reaches every corner of your home. Perfect for seasonal refreshes, moving, or when your home needs extra attention beyond regular maintenance.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#475569]">
                  <Clock className="w-5 h-5 text-[#0C53ED]" />
                  <span>4-8 hours</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Target className="w-5 h-5 text-[#0C53ED]" />
                  <span>Every corner covered</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Award className="w-5 h-5 text-[#0C53ED]" />
                  <span>Professional equipment</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#0C53ED] text-white hover:brightness-110 shadow-lg text-lg px-8"
                  onClick={() => navigate('/booking/service/deep-cleaning')}
                >
                  Book Deep Cleaning
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
                Starting from <span className="text-2xl text-[#0C53ED]">R550</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={serviceDeepImage}
                  alt="Professional deep cleaning service - thorough cleaning behind furniture and appliances in Cape Town"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0F172A]">16+ Areas</div>
                    <div className="text-sm text-[#475569]">Deep Cleaned</div>
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
          <h2 className="text-4xl font-bold text-[#0F172A]">What's Included</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Comprehensive cleaning that goes far beyond the surface, reaching areas typically missed in regular cleaning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {included.map((item, index) => (
            <Card key={index} className="p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                <span className="text-[#475569]">{item}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-[#475569] text-center">
            <strong className="text-[#0F172A]">Professional-grade equipment included:</strong> HEPA filtration vacuums, 
            steam cleaners, and hospital-grade disinfectants for the deepest, most thorough clean possible.
          </p>
        </div>
      </section>

      {/* When to Book Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">When to Book Deep Cleaning</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Deep cleaning is ideal for specific situations and times of year
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whenToBook.map((item, index) => (
              <Card key={index} className="p-6 space-y-3 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="text-[#475569]">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-[#0F172A]">Why Choose Deep Cleaning?</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Experience the difference of a truly thorough, professional deep clean
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
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">Our Deep Cleaning Process</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              A systematic approach ensures nothing is missed
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
            Ready for the Deepest Clean?
          </h2>
          <p className="text-xl text-white/90">
            Experience the difference of a professional deep clean that reaches every corner of your home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0C53ED] hover:bg-gray-100 shadow-lg text-lg px-8"
              onClick={() => navigate('/booking/service/deep-cleaning')}
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

export default DeepCleaning;

