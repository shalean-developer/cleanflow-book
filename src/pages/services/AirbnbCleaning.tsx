import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Building, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Shield, 
  Sparkles,
  ChevronRight,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ServiceStructuredData } from '@/components/StructuredData';
import serviceStandardImage from '@/assets/service-standard-cleaning.jpg';

const AirbnbCleaning = () => {
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
      icon: Zap,
      title: 'Quick Turnaround',
      description: 'Fast and efficient service between guest checkouts and check-ins'
    },
    {
      icon: Shield,
      title: 'Reliable Service',
      description: 'Professional cleaners trained specifically for short-term rentals'
    },
    {
      icon: Sparkles,
      title: 'Guest-Ready',
      description: 'Consistently clean and welcoming for every new guest arrival'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: "5-star standards to help you maintain excellent guest reviews"
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Guest Checkout',
      description: 'Coordinate with us when your guest checks out'
    },
    {
      step: '2',
      title: 'We Clean',
      description: 'Our team arrives and completes the full turnaround clean'
    },
    {
      step: '3',
      title: 'Quality Check',
      description: 'Final inspection to ensure everything is guest-ready'
    },
    {
      step: '4',
      title: 'Guest Check-in',
      description: 'Your property is spotless and ready for the next arrival'
    }
  ];

  const faqs = [
    {
      question: 'How long does an Airbnb turnaround cleaning take?',
      answer: 'Typically 1.5-3 hours depending on property size and the level of cleaning required. We work efficiently to ensure your property is ready for the next guest.'
    },
    {
      question: 'Can you handle same-day turnarounds?',
      answer: 'Yes! We specialize in quick turnarounds between guests. Book as soon as you know your checkout/check-in times, and we\'ll coordinate to have your property guest-ready.'
    },
    {
      question: 'Do you restock amenities?',
      answer: 'Yes, if you provide the supplies. We can restock toiletries, coffee, tea, and other guest amenities. Just let us know what you need during booking.'
    },
    {
      question: 'What if a guest leaves the property very messy?',
      answer: 'We\'ll assess the situation and can provide deep cleaning services if needed. Additional charges may apply for excessive cleaning beyond standard turnarounds.'
    },
    {
      question: 'Can you handle linen changes?',
      answer: 'Absolutely! We change all linens, make beds with fresh sheets, and can even handle laundry services. Add this to your booking or request a custom package.'
    },
    {
      question: 'Do you offer scheduled recurring cleans?',
      answer: 'Yes! For multiple properties or frequent turnovers, we can set up a regular schedule and priority booking to ensure your properties are always guest-ready.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <SEO 
        title="Airbnb Cleaning Service Cape Town - Professional Turnover Cleaning"
        description="Fast and reliable Airbnb turnover cleaning in Cape Town. Same-day service, linen changes, restocking, thorough cleaning between guests. Perfect for short-term rental hosts."
        keywords="Airbnb cleaning Cape Town, vacation rental cleaning, turnover cleaning, short term rental cleaning, guest house cleaning, holiday home cleaning"
        canonical="https://shalean.co.za/services/airbnb-cleaning"
      />
      <ServiceStructuredData 
        name="Airbnb Turnover Cleaning Service"
        description="Fast and reliable Airbnb turnover cleaning including linen changes, restocking, and thorough cleaning between guests"
        url="https://shalean.co.za/services/airbnb-cleaning"
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#475569]">
                <Building className="w-4 h-4" />
                Short-Term Rental Specialists
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight">
                  Airbnb Cleaning
                </h1>
                <div className="w-16 h-[3px] bg-[#0C53ED]"></div>
              </div>
              
              <p className="text-xl text-[#475569] leading-relaxed">
                Professional turnaround cleaning for short-term rentals. Quick, thorough service to keep your property guest-ready and your reviews glowing.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#475569]">
                  <Clock className="w-5 h-5 text-[#0C53ED]" />
                  <span>1.5-3 hours</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Zap className="w-5 h-5 text-[#0C53ED]" />
                  <span>Same-day available</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Award className="w-5 h-5 text-[#0C53ED]" />
                  <span>Guest-ready guaranteed</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#0C53ED] text-white hover:brightness-110 shadow-lg text-lg px-8"
                  onClick={() => navigate('/booking/service/airbnb-cleaning')}
                >
                  Book Airbnb Cleaning
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
                  src={serviceStandardImage}
                  alt="Airbnb turnover cleaning service - fast and reliable cleaning between guests in Cape Town"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0F172A]">5-Star</div>
                    <div className="text-sm text-[#475569]">Ready Every Time</div>
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
            Complete turnaround cleaning to ensure your property is guest-ready for every arrival
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
            <strong className="text-[#0F172A]">Need linen changes or restocking?</strong> We can customize your Airbnb cleaning package. 
            Add special instructions during booking or contact us for a tailored solution.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">Why Choose Our Airbnb Cleaning?</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Specialized service designed for short-term rental hosts
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
          <h2 className="text-4xl font-bold text-[#0F172A]">Turnaround Process</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Seamless coordination between guest stays
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
            <h2 className="text-4xl font-bold text-[#0F172A]">Flexible Pricing Options</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Transparent pricing for short-term rental hosts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 space-y-4 border-2 border-gray-200">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#0F172A]">Per Booking</h3>
                <div className="text-3xl font-bold text-[#0C53ED]">R550+</div>
                <p className="text-sm text-[#475569]">Pay as you go for each turnaround</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-2 border-[#0C53ED] relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0C53ED] text-white">
                Best Value
              </Badge>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#0F172A]">10+ Cleanings/Month</h3>
                <div className="text-3xl font-bold text-[#0C53ED]">R495+</div>
                <p className="text-sm text-[#475569]">Save 10% with volume pricing</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-2 border-gray-200">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#0F172A]">Multiple Properties</h3>
                <div className="text-3xl font-bold text-[#0C53ED]">Custom</div>
                <p className="text-sm text-[#475569]">Special rates for property managers</p>
              </div>
            </Card>
          </div>

          <p className="text-center text-[#475569] mt-8">
            Final price depends on property size and specific requirements.
            <br />
            <Button 
              variant="link" 
              className="text-[#0C53ED] hover:underline p-0 h-auto"
              onClick={() => navigate('/booking/quote')}
            >
              Get a custom quote →
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
            Ready to Maximize Your Airbnb Reviews?
          </h2>
          <p className="text-xl text-white/90">
            Book professional turnaround cleaning and keep your guests happy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0C53ED] hover:bg-gray-100 shadow-lg text-lg px-8"
              onClick={() => navigate('/booking/service/airbnb-cleaning')}
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

export default AirbnbCleaning;

