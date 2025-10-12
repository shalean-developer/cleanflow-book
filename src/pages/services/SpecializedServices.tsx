import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Shield, 
  ChevronRight,
  Armchair,
  Wind,
  HardHat,
  Award,
  Waves
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import serviceSpecializedImage from '@/assets/service-specialized.jpg';

const SpecializedServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Armchair,
      title: 'Carpet & Upholstery Cleaning',
      description: 'Deep steam cleaning that removes dirt, stains, and allergens from carpets, rugs, and furniture',
      features: [
        'Hot water extraction method',
        'Stain removal treatment',
        'Odor elimination',
        'Fast drying techniques',
        'Pet stain and odor removal',
        'Scotchgard protection available'
      ],
      ideal: ['High-traffic areas', 'Homes with pets', 'Allergy sufferers', 'Before special events']
    },
    {
      icon: HardHat,
      title: 'Post-Construction Cleaning',
      description: 'Thorough removal of construction dust, debris, and residue after renovations or new builds',
      features: [
        'Fine dust removal from all surfaces',
        'Window and glass cleaning',
        'Floor cleaning and polishing',
        'Paint splatter removal',
        'Hardware and fixture cleaning',
        'Final inspection ready'
      ],
      ideal: ['After renovations', 'New construction', 'Remodeling projects', 'Property flips']
    },
    {
      icon: Wind,
      title: 'Air Duct & Vent Cleaning',
      description: 'Professional cleaning of HVAC systems to improve air quality and system efficiency',
      features: [
        'Complete duct system cleaning',
        'Vent and register cleaning',
        'Filter replacement',
        'Mold and bacteria treatment',
        'Allergen removal',
        'System inspection'
      ],
      ideal: ['Allergy concerns', 'Musty odors', 'New home purchase', 'Every 3-5 years']
    },
    {
      icon: Waves,
      title: 'Pressure Washing',
      description: 'High-pressure cleaning for exterior surfaces, driveways, patios, and more',
      features: [
        'Driveway and walkway cleaning',
        'Patio and deck restoration',
        'Siding and brick cleaning',
        'Fence cleaning',
        'Gutter exterior cleaning',
        'Mold and mildew removal'
      ],
      ideal: ['Spring cleaning', 'Before selling', 'Annual maintenance', 'After winter']
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Specialized Equipment',
      description: 'Professional-grade tools and machinery for optimal results'
    },
    {
      icon: Shield,
      title: 'Trained Experts',
      description: 'Technicians certified in specialized cleaning techniques'
    },
    {
      icon: Sparkles,
      title: 'Deep Restoration',
      description: 'Restore items and surfaces to like-new condition'
    },
    {
      icon: Wind,
      title: 'Healthier Environment',
      description: 'Remove allergens, dust, and contaminants effectively'
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Assessment',
      description: 'We evaluate the specific cleaning needs and recommend the best approach'
    },
    {
      step: '2',
      title: 'Preparation',
      description: 'Protect surrounding areas and prepare surfaces for specialized treatment'
    },
    {
      step: '3',
      title: 'Specialized Cleaning',
      description: 'Use professional equipment and techniques for deep, thorough cleaning'
    },
    {
      step: '4',
      title: 'Quality Check',
      description: 'Inspect results and ensure complete satisfaction with the service'
    }
  ];

  const faqs = [
    {
      question: 'How do I know which specialized service I need?',
      answer: 'Not sure? Request a free quote and consultation. We\'ll assess your needs and recommend the most appropriate service. You can also combine multiple specialized services in one visit.'
    },
    {
      question: 'How long do specialized services take?',
      answer: 'Time varies by service type and size of area. Carpet cleaning typically takes 2-4 hours, post-construction cleaning 4-8 hours, and pressure washing 2-6 hours. We\'ll provide a time estimate with your quote.'
    },
    {
      question: 'Do you have the necessary equipment?',
      answer: 'Yes! We bring all professional-grade equipment including steam cleaners, industrial vacuums, pressure washers, and specialized tools. You don\'t need to provide anything.'
    },
    {
      question: 'Are your cleaning products safe for pets and children?',
      answer: 'Absolutely. We use eco-friendly, non-toxic cleaning solutions that are safe for your entire family, including pets. All products are approved for residential use.'
    },
    {
      question: 'How often should I book specialized services?',
      answer: 'It depends on the service: Carpet cleaning every 6-12 months, air duct cleaning every 3-5 years, pressure washing annually, and post-construction as needed. We\'ll recommend a schedule based on your specific situation.'
    },
    {
      question: 'Can I combine specialized services with regular cleaning?',
      answer: 'Yes! Many clients add specialized services to their regular cleaning schedule. This can be more cost-effective and convenient. Ask about our combination packages when booking.'
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
                <Sparkles className="w-4 h-4" />
                Professional Equipment & Expertise
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight">
                  Specialized Services
                </h1>
                <div className="w-16 h-[3px] bg-[#0C53ED]"></div>
              </div>
              
              <p className="text-xl text-[#475569] leading-relaxed">
                Professional carpet, upholstery, and post-construction cleaning services. When your home needs 
                more than standard cleaning, our specialized services deliver exceptional results.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#475569]">
                  <Clock className="w-5 h-5 text-[#0C53ED]" />
                  <span>Custom duration</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Award className="w-5 h-5 text-[#0C53ED]" />
                  <span>Professional equipment</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Shield className="w-5 h-5 text-[#0C53ED]" />
                  <span>Certified technicians</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#0C53ED] text-white hover:brightness-110 shadow-lg text-lg px-8"
                  onClick={() => navigate('/booking/service/specialized-services')}
                >
                  Book Specialized Service
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
                <span className="text-2xl text-[#0C53ED]">Custom pricing</span>
                <span className="text-base font-normal text-[#475569]">based on service type</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={serviceSpecializedImage}
                  alt="Specialized Cleaning Services"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0F172A]">Expert</div>
                    <div className="text-sm text-[#475569]">Technicians</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-[#0F172A]">Our Specialized Services</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Professional solutions for cleaning challenges that require specialized equipment and expertise
          </p>
        </div>

        <div className="space-y-8">
          {services.map((service, index) => (
            <Card key={index} className="p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Icon and Description */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-[#0F172A]">{service.title}</h3>
                      <p className="text-[#475569]">{service.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid sm:grid-cols-2 gap-3 ml-0 sm:ml-[72px]">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                        <span className="text-[#475569] text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Ideal For */}
                <div className="bg-[#F8FAFC] rounded-xl p-6 space-y-4">
                  <h4 className="font-semibold text-[#0F172A]">Ideal for:</h4>
                  <ul className="space-y-2">
                    {service.ideal.map((item, idealIndex) => (
                      <li key={idealIndex} className="flex items-center gap-2 text-[#475569] text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0C53ED]"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">Why Choose Specialized Services?</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Professional results that go beyond what standard cleaning can achieve
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

      {/* Process Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-[#0F172A]">Our Process</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Systematic approach to specialized cleaning
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

      {/* When to Book Section */}
      <section className="bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">When to Book</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Common situations where specialized cleaning makes a difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              'After home renovations or construction',
              'Before or after moving',
              'Seasonal deep cleaning',
              'Preparing for special events',
              'Selling your home',
              'New home purchase',
              'Stubborn stains or odors',
              'Allergy or health concerns',
              'Regular maintenance schedule'
            ].map((situation, index) => (
              <Card key={index} className="p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                  <span className="text-[#475569]">{situation}</span>
                </div>
              </Card>
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
            Need Specialized Cleaning?
          </h2>
          <p className="text-xl text-white/90">
            Get a custom quote for professional cleaning services tailored to your specific needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0C53ED] hover:bg-gray-100 shadow-lg text-lg px-8"
              onClick={() => navigate('/booking/quote')}
            >
              Get Free Quote
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

export default SpecializedServices;

