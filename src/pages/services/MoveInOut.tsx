import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Shield, 
  Sparkles,
  ChevronRight,
  Home,
  Award,
  Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ServiceStructuredData } from '@/components/StructuredData';
import serviceMoveImage from '@/assets/service-move-inout.jpg';

const MoveInOut = () => {
  const navigate = useNavigate();

  const included = [
    'All deep cleaning services included',
    'Complete sanitization of all surfaces',
    'Interior of all cabinets and closets',
    'Inside all drawers and shelving',
    'Complete kitchen appliance cleaning (inside & out)',
    'Refrigerator and freezer deep clean',
    'Oven, stove, and range hood degreasing',
    'Complete bathroom sanitization',
    'All tile and grout scrubbing',
    'Baseboard and trim detailed cleaning',
    'Interior window and track cleaning',
    'Light fixture and ceiling fan cleaning',
    'Door frames and handles sanitizing',
    'Wall spot cleaning and mark removal',
    'All flooring thoroughly cleaned',
    'Final walk-through inspection'
  ];

  const moveInBenefits = [
    'Start fresh in a completely sanitized space',
    'Peace of mind knowing every surface is clean',
    'Ready to unpack into pristine cabinets and closets',
    'Healthy environment for your family from day one'
  ];

  const moveOutBenefits = [
    'Maximize your security deposit return',
    'Meet lease cleaning requirements',
    'Leave a good impression on landlords',
    'Reduce stress during moving process'
  ];

  const benefits = [
    {
      icon: Key,
      title: 'Move-In Ready',
      description: 'Walk into a perfectly clean home, ready for your belongings'
    },
    {
      icon: Shield,
      title: 'Deposit Protection',
      description: 'Increase chances of full security deposit return'
    },
    {
      icon: Sparkles,
      title: 'Complete Clean',
      description: 'Every corner, cabinet, and closet thoroughly cleaned'
    },
    {
      icon: Award,
      title: 'Inspection Ready',
      description: 'Meets or exceeds landlord and property manager standards'
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Schedule Timing',
      description: 'Book for after move-out or before move-in for best results'
    },
    {
      step: '2',
      title: 'Empty Property',
      description: 'We clean more effectively in an empty or mostly empty space'
    },
    {
      step: '3',
      title: 'Deep Clean',
      description: 'Thorough cleaning of every area including often-forgotten spots'
    },
    {
      step: '4',
      title: 'Final Check',
      description: 'Detailed inspection to ensure inspection-ready condition'
    }
  ];

  const checklist = [
    {
      area: 'Kitchen',
      tasks: [
        'Inside and outside all cabinets',
        'All appliances (inside & out)',
        'Countertops and backsplash',
        'Sink and faucet detailed',
        'Floor scrubbed and sanitized'
      ]
    },
    {
      area: 'Bathrooms',
      tasks: [
        'Toilets completely sanitized',
        'Shower/tub and tile scrubbed',
        'Vanity and mirror cleaned',
        'Cabinet interiors wiped',
        'Floors deep cleaned'
      ]
    },
    {
      area: 'Living Areas',
      tasks: [
        'All surfaces dusted',
        'Baseboards and trim wiped',
        'Light fixtures cleaned',
        'Floors vacuumed and mopped',
        'Windows and sills cleaned'
      ]
    },
    {
      area: 'Bedrooms',
      tasks: [
        'Closets vacuumed and wiped',
        'All surfaces dusted',
        'Baseboards cleaned',
        'Floors deep cleaned',
        'Windows interior cleaned'
      ]
    }
  ];

  const faqs = [
    {
      question: 'When should I schedule move in/out cleaning?',
      answer: 'For move-out: Schedule after you\'ve removed all belongings but before the final inspection. For move-in: Schedule between when you get keys and when you move furniture in. An empty property allows for the most thorough cleaning.'
    },
    {
      question: 'How long does move in/out cleaning take?',
      answer: 'Typically 5-10 hours depending on property size and condition. Empty properties are faster to clean. We can often complete the service in one day, but larger homes may require a full team or two days.'
    },
    {
      question: 'Do I need to be present during the cleaning?',
      answer: 'No, you don\'t need to be present. Many clients provide access and we handle everything. We\'ll send photos upon completion and you can schedule a final walk-through at your convenience.'
    },
    {
      question: 'What if I\'m not getting my full deposit back due to cleaning?',
      answer: 'Our move-out cleaning meets professional standards required by most landlords and property managers. If there are issues, we\'ll return to address them at no additional charge within 48 hours.'
    },
    {
      question: 'Can you clean while movers are still working?',
      answer: 'We recommend scheduling cleaning after all belongings and furniture are removed for the most effective results. However, we can work around movers if necessary - just discuss timing when booking.'
    },
    {
      question: 'Do you provide a checklist or documentation?',
      answer: 'Yes! We provide a detailed cleaning checklist and can take before/after photos upon request. This documentation can be helpful for landlords and property managers.'
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <SEO 
        title="Move In/Out Cleaning Service Cape Town - End of Lease Cleaning"
        description="Professional move in/out cleaning service in Cape Town. Complete deep clean for tenants and landlords. Inside cabinets, appliances, walls, windows. Get your deposit back with our thorough cleaning."
        keywords="move out cleaning Cape Town, move in cleaning, end of lease cleaning, tenant cleaning, bond cleaning, deposit back cleaning, vacate cleaning"
        canonical="https://shalean.co.za/services/move-in-out"
      />
      <ServiceStructuredData 
        name="Move In/Out Cleaning Service"
        description="Complete move in/out cleaning including all deep cleaning services plus complete sanitization of all surfaces"
        url="https://shalean.co.za/services/move-in-out"
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#475569]">
                <Building2 className="w-4 h-4" />
                Move In/Out Specialist
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight">
                  Move In/Out Cleaning
                </h1>
                <div className="w-16 h-[3px] bg-[#0C53ED]"></div>
              </div>
              
              <p className="text-xl text-[#475569] leading-relaxed">
                Complete cleaning for seamless transitions. Whether you're moving into a new home or preparing to leave, 
                our thorough cleaning ensures the property is inspection-ready and perfectly clean.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#475569]">
                  <Clock className="w-5 h-5 text-[#0C53ED]" />
                  <span>5-10 hours</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Key className="w-5 h-5 text-[#0C53ED]" />
                  <span>Move-in ready</span>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Award className="w-5 h-5 text-[#0C53ED]" />
                  <span>Inspection approved</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#0C53ED] text-white hover:brightness-110 shadow-lg text-lg px-8"
                  onClick={() => navigate('/booking/service/move-in-out')}
                >
                  Book Move Cleaning
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
                Starting from <span className="text-2xl text-[#0C53ED]">R650</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={serviceMoveImage}
                  alt="Move in/out cleaning service - complete sanitization for tenants and landlords in Cape Town"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0F172A]">100%</div>
                    <div className="text-sm text-[#475569]">Inspection Pass</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Move-In vs Move-Out Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-[#0F172A]">Perfect for Both Moves</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Whether you're coming or going, we ensure the property is spotless
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Move-In */}
          <Card className="p-8 border-2 border-[#0C53ED] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A]">Moving In</h3>
            </div>
            <p className="text-[#475569]">
              Start your new chapter in a perfectly clean home. We ensure every surface is sanitized 
              and ready for your belongings.
            </p>
            <ul className="space-y-3">
              {moveInBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                  <span className="text-[#475569]">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Move-Out */}
          <Card className="p-8 border-2 border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A]">Moving Out</h3>
            </div>
            <p className="text-[#475569]">
              Leave your old place in pristine condition. Meet lease requirements and maximize 
              your security deposit return.
            </p>
            <ul className="space-y-3">
              {moveOutBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                  <span className="text-[#475569]">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">Comprehensive Cleaning Checklist</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Every area of the property receives detailed attention
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {included.map((item, index) => (
              <Card key={index} className="p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                  <span className="text-[#475569]">{item}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed Checklist by Area */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {checklist.map((area, index) => (
              <Card key={index} className="p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0C53ED] text-white flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  {area.area}
                </h3>
                <ul className="space-y-2">
                  {area.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start gap-2 text-[#475569]">
                      <CheckCircle className="w-4 h-4 text-[#0C53ED] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{task}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-[#0F172A]">Why Choose Our Move Cleaning?</h2>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto">
            Make your move smoother with professional cleaning you can trust
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

      {/* Process Section */}
      <section className="bg-gradient-to-br from-[#0C53ED]/5 via-white to-[#2A869E]/5 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-[#0F172A]">How It Works</h2>
            <p className="text-xl text-[#475569] max-w-3xl mx-auto">
              Simple steps to a perfectly clean property
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
            Ready for Your Move?
          </h2>
          <p className="text-xl text-white/90">
            Book professional move in/out cleaning and make your transition stress-free
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0C53ED] hover:bg-gray-100 shadow-lg text-lg px-8"
              onClick={() => navigate('/booking/service/move-in-out')}
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

export default MoveInOut;

