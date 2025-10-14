import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Calendar, 
  Home as HomeIcon, 
  Award, 
  Clock, 
  Shield, 
  CheckCircle,
  Star,
  Users,
  ClipboardCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import cleaningTeamHero from '@/assets/cleaning-team-hero.jpg';

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Standard Cleaning',
      description: 'Regular maintenance cleaning to keep your home fresh and tidy',
      icon: HomeIcon,
      price: 'From R350',
      features: ['Dusting & vacuuming', 'Bathroom cleaning', 'Kitchen surfaces', 'Floor cleaning']
    },
    {
      title: 'Deep Cleaning',
      description: 'Comprehensive cleaning for every corner and surface of your home',
      icon: Award,
      price: 'From R500',
      features: ['Everything in standard', 'Inside appliances', 'Window cleaning', 'Detailed scrubbing']
    },
    {
      title: 'Move In/Out',
      description: 'Complete property cleaning for moving day',
      icon: Users,
      price: 'Custom pricing',
      features: ['Empty property clean', 'Deep sanitization', 'All surfaces', 'Ready for handover']
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Choose Service',
      description: 'Select the cleaning package that fits your needs',
      icon: ClipboardCheck
    },
    {
      number: '2',
      title: 'Pick Date & Time',
      description: 'Book a slot that works with your schedule',
      icon: Calendar
    },
    {
      number: '3',
      title: 'Meet Your Cleaner',
      description: 'Get matched with a vetted professional',
      icon: Users
    },
    {
      number: '4',
      title: 'Enjoy Clean Home',
      description: 'Relax while we handle the rest',
      icon: HomeIcon
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'All cleaners are insured and background-checked'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: "Not satisfied? We'll re-clean for free within 24 hours"
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book one-time or recurring services'
    },
    {
      icon: Users,
      title: 'Experienced Team',
      description: '7+ years of professional experience'
    }
  ];

  const reviews = [
    {
      name: 'Jessica Miller',
      rating: 5,
      comment: 'Absolutely amazing service! My home has never looked better.',
      date: 'March 2025'
    },
    {
      name: 'Robert Thompson',
      rating: 5,
      comment: 'Best cleaning service in Cape Town. Reliable and detail-oriented.',
      date: 'February 2025'
    },
    {
      name: 'Amanda Foster',
      rating: 5,
      comment: 'The deep cleaning exceeded my expectations. Highly recommend!',
      date: 'February 2025'
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Shalean Cleaning Services | Professional Home Cleaning in Cape Town"
        description="⭐ Top-rated cleaning service in Cape Town! Professional cleaners for homes, offices & Airbnb. Standard, deep, move-in/out cleaning. Same-day booking available."
        canonical="https://shalean.co.za/"
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#0C53ED] to-[#2A869E]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 px-4 py-2 bg-white/20 text-white border-white/30 rounded-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Top-Rated Cleaning Service
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Professional Cleaning Services
              <br />
              <span className="text-white/90">in Cape Town</span>
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Trusted by hundreds of families. Same-day booking available. 
              Professional, reliable, and affordable cleaning for your home or office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/booking/service/select')}
                className="bg-white text-[#0C53ED] hover:bg-white/90 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Book Now
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/booking/quote')}
                className="border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
              >
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our Cleaning Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional cleaning solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center mb-4">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {service.description}
                  </CardDescription>
                  <div className="text-[#0C53ED] font-bold text-xl mb-4">
                    {service.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-[#0C53ED] group-hover:text-white transition-all"
                    onClick={() => navigate('/services')}
                  >
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-[#EAF2FF] text-[#0C53ED] border-[#0C53ED]/20 rounded-full">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get your home professionally cleaned in four easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center shadow-lg">
                    <div className="text-white text-2xl font-bold">{step.number}</div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-[#0C53ED]/10">
                    <step.icon className="w-5 h-5 text-[#0C53ED]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose Shalean?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Quality service backed by trust and reliability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2" variant="outline">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real feedback from real customers across Cape Town
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-[#0C53ED] text-[#0C53ED]" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "{review.comment}"
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center text-white font-semibold text-sm">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Photo Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <Badge className="inline-flex px-4 py-2" variant="outline">
                Our Team
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Professional Service,
                <br />
                <span className="bg-gradient-to-r from-[#0C53ED] to-[#2A869E] bg-clip-text text-transparent">
                  Delivered Every Time
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our experienced cleaning professionals take pride in delivering exceptional results. 
                With attention to detail and a commitment to excellence, we transform spaces into 
                spotless environments you'll love coming home to.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/booking/service/select')}
                  className="bg-[#0C53ED] hover:bg-[#0C53ED]/90 text-white rounded-full"
                >
                  Book Our Team
                  <Calendar className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/our-team')}
                  className="rounded-full"
                >
                  Meet The Team
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={cleaningTeamHero} 
                  alt="Professional Shalean cleaning team at work" 
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0C53ED]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Book Your Cleaning?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers in Cape Town. 
            Same-day booking available. Professional service guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/booking/service/select')}
              className="bg-white text-[#0C53ED] hover:bg-white/90 rounded-full shadow-lg"
            >
              Book Now
              <Calendar className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/contact-us')}
              className="border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

