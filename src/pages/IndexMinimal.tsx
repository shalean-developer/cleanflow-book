import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, Star, Calendar, Home, Users, Award, Clock, Shield } from 'lucide-react';
import { SEO } from '@/components/SEO';
import cleaningTeamHero from '@/assets/cleaning-team-hero.jpg';

const IndexMinimal = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Service',
      description: 'Select the cleaning package that fits your needs'
    },
    {
      number: '02', 
      title: 'Pick Date & Time',
      description: 'Book a slot that works with your schedule'
    },
    {
      number: '03',
      title: 'Meet Your Cleaner',
      description: 'Get matched with a vetted professional'
    },
    {
      number: '04',
      title: 'Enjoy Your Clean Home',
      description: 'Relax while we handle the rest'
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
    <div>
      <SEO 
        title="Shalean Cleaning Services | Trusted Home Cleaning in Cape Town"
        description="⭐ Top-rated cleaning service in Cape Town! Professional cleaners for homes, offices & Airbnb. Same-day booking available."
      />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C53ED] to-[#2A869E]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 px-4 py-2 bg-white/20 text-white border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Top-Rated Service
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Cleaning
              <br />
              <span className="text-white/90">in Cape Town</span>
            </h1>
            <p className="text-xl mb-8 text-white/80">
              Trusted by hundreds of families. Same-day booking available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#0C53ED] hover:bg-white/90 rounded-full"
              >
                Book Now
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Our Cleaning Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional cleaning services for your home and office
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden">
                <img 
                  src={cleaningTeamHero} 
                  alt="Standard Cleaning Service" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 rounded-full bg-[#0C53ED] flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Standard Cleaning
                </CardTitle>
                <CardDescription>
                  Regular home cleaning to keep your space spotless
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  View Details →
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden">
                <img 
                  src={cleaningTeamHero} 
                  alt="Deep Cleaning Service" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 rounded-full bg-[#0C53ED] flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Deep Cleaning
                </CardTitle>
                <CardDescription>
                  Comprehensive cleaning for every corner and surface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  View Details →
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative overflow-hidden">
                <img 
                  src={cleaningTeamHero} 
                  alt="Move In/Out Cleaning" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 rounded-full bg-[#0C53ED] flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Move In/Out
                </CardTitle>
                <CardDescription>
                  Complete cleaning for moving day preparation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  View Details →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-[#EAF2FF] text-primary border-primary/20 rounded-full">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your home professionally cleaned in four easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg mb-6">
                  <div className="text-white text-xl font-bold">{step.number}</div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#180D39]">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Quality service backed by trust and reliability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#180D39] mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0C53ED]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Book Your Cleaning?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers in Cape Town
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#0C53ED] hover:bg-white/90 rounded-full"
          >
            Book Now
            <Calendar className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default IndexMinimal;
