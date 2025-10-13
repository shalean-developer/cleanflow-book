import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Home, CheckCircle, Shield, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      icon: Calendar,
      title: 'Choose Your Service',
      description: 'Select the cleaning package that fits your needs',
      details: [
        'Browse our service options',
        'Select date and time',
        'Customize your preferences',
        'Add any special requests'
      ]
    },
    {
      number: '02',
      icon: Clock,
      title: 'Pick Date & Time',
      description: 'Book a slot that works with your schedule',
      details: [
        'View available time slots',
        'Choose one-time or recurring',
        'Set your preferred frequency',
        'Flexible rescheduling options'
      ]
    },
    {
      number: '03',
      icon: Users,
      title: 'Meet Your Cleaner',
      description: 'Get matched with a vetted professional',
      details: [
        'View cleaner profiles and ratings',
        'Read verified reviews',
        'Choose your preferred cleaner',
        'Direct communication available'
      ]
    },
    {
      number: '04',
      icon: Home,
      title: 'Enjoy Your Clean Home',
      description: 'Relax while we handle the rest',
      details: [
        'Professional service guaranteed',
        'Quality inspection included',
        'Satisfaction guaranteed',
        'Rate your experience'
      ]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'All cleaners are insured and background-checked for your peace of mind'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: "Not satisfied? We'll re-clean for free within 24 hours"
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book one-time or recurring services that fit your lifestyle'
    },
    {
      icon: Users,
      title: 'Experienced Team',
      description: 'Our cleaners average 7+ years of professional experience'
    }
  ];

  return (
    <main className="bg-white">
      <SEO 
        title="How It Works - Easy Booking Process"
        description="Book professional cleaning services in Cape Town in 4 simple steps. Choose your service, pick a date, meet your cleaner, and enjoy your spotless home. Fully insured and quality guaranteed."
        keywords="how to book cleaning service, cleaning booking process, book cleaner Cape Town, schedule cleaning service, easy online booking"
        canonical="https://shalean.co.za/how-it-works"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#F8FAFC] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white border-gray-200 text-[#475569] hover:bg-gray-50" variant="outline">
              <Sparkles className="w-4 h-4" />
              Simple & Easy Process
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A]">
              How It <span className="bg-gradient-to-r from-[#0C53ED] to-[#2A869E] bg-clip-text text-transparent">Works</span>
            </h1>
            <p className="text-xl text-[#475569]">
              Get your home professionally cleaned in four simple steps
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section aria-label="How it works steps" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-16 relative">
            {/* Connector Line */}
            <div className="absolute left-8 md:left-24 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#0C53ED]/10 to-transparent hidden md:block"></div>
            
            {steps.map((step, i) => (
              <article 
                key={i} 
                aria-label={`Step ${step.number}: ${step.title}`}
                className={`group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 md:p-8 flex gap-6 items-start relative animate-fade-up ${
                  i % 2 === 0 ? 'md:ml-0' : 'md:ml-8 xl:ml-16'
                }`}
                style={{
                  animationDelay: `${i * 80}ms`
                }}
              >
                {/* Mobile Layout */}
                <div className="md:hidden w-full">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-r from-[#0C53ED] to-[#2A869E] rounded-full w-16 h-16 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl tabular-nums">{step.number}</span>
                    </div>
                    <div className="ml-4">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <step.icon className="w-4 h-4 text-[#0C53ED]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{step.title}</h3>
                    <p className="text-[#475569] mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-[#0C53ED] flex-shrink-0" />
                          <span className="text-[#475569] text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex w-full gap-6">
                  {/* Left Rail */}
                  <div className="w-24 flex-shrink-0">
                    <div className="bg-gradient-to-b from-[#0C53ED] to-[#2A869E] rounded-l-2xl p-6 flex flex-col items-center justify-center h-full min-h-[120px]">
                      <div className="text-white font-bold text-4xl mb-3 tabular-nums">{step.number}</div>
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <step.icon className="w-4 h-4 text-[#0C53ED]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{step.title}</h3>
                    <p className="text-[#475569] mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-[#0C53ED] flex-shrink-0" />
                          <span className="text-[#475569] text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Why Choose Shalean?</h2>
            <p className="text-[#475569] text-lg">
              Quality service backed by trust and reliability
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0C53ED]/10 text-[#0C53ED] mb-4 group-hover:bg-[#0C53ED]/20 transition-colors">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{benefit.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
                Ready to get started?
              </h2>
              <p className="text-[#475569] text-lg">
                Book your first cleaning in just a few minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/booking/service/select')}
                  className="bg-[#0C53ED] hover:bg-[#0C53ED]/90 text-white rounded-full shadow-lg focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                >
                  Book Now
                  <Calendar className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/booking/quote')}
                  className="border-[#0C53ED] text-[#0C53ED] hover:bg-[#0C53ED] hover:text-white rounded-full focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                >
                  Get Free Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HowItWorks;
