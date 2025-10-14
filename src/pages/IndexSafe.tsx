import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, CheckCircle, Star, Calendar, Home, Droplets, ClipboardCheck, Users, Award, Clock, Shield, BookOpen, Briefcase, Quote, Building2 } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { SEO } from '@/components/SEO';
import { LocalBusinessStructuredData } from '@/components/StructuredData';
import luciaImage from '@/assets/lucia-pazvakavambwa.webp';
import normatterImage from '@/assets/normatter-mazhinji.webp';
import nyashaImage from '@/assets/nyasha-mudani.webp';
import cleaningTeamHero from '@/assets/cleaning-team-hero.jpg';
import { getRecentPosts } from '@/data/blogPosts';
import { serviceGroups } from '@/data/services';

const IndexSafe = () => {
  const { elementRef: howItWorksRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '-50px'
  });

  const steps = [
    {
      number: '01',
      icon: ClipboardCheck,
      title: 'Choose Your Service',
      description: 'Select the cleaning package that fits your needs'
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Pick Date & Time',
      description: 'Book a slot that works with your schedule'
    },
    {
      number: '03',
      icon: Users,
      title: 'Meet Your Cleaner',
      description: 'Get matched with a vetted professional'
    },
    {
      number: '04',
      icon: Home,
      title: 'Enjoy Your Clean Home',
      description: 'Relax while we handle the rest'
    }
  ];

  const team = [
    {
      name: 'Lucia Pazvakavambwa',
      role: 'Lead Cleaner',
      image: luciaImage,
      initials: 'LP',
      comment: 'Detail-oriented and reliable'
    },
    {
      name: 'Normatter Mazhinji',
      role: 'Deep Clean Specialist',
      image: normatterImage,
      initials: 'NM',
      comment: 'Expert in deep cleaning'
    },
    {
      name: 'Nyasha Mudani',
      role: 'Senior Cleaner',
      image: nyashaImage,
      initials: 'NM',
      comment: 'Thorough and professional'
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

  const blogPosts = getRecentPosts(3);
  const reviews = [
    {
      name: 'Jessica Miller',
      rating: 5,
      comment: 'Absolutely amazing service! My home has never looked better. The team was professional and thorough.',
      date: 'March 2025'
    },
    {
      name: 'Robert Thompson',
      rating: 5,
      comment: "I've tried several cleaning services in Cape Town, and Shalean is by far the best. Reliable and detail-oriented.",
      date: 'February 2025'
    },
    {
      name: 'Amanda Foster',
      rating: 5,
      comment: 'The deep cleaning service exceeded my expectations. Every corner sparkles! Highly recommend.',
      date: 'February 2025'
    }
  ];

  return (
    <div>
      <SEO 
        title="Shalean Cleaning Services | Trusted Home Cleaning in Cape Town"
        description="⭐ Top-rated cleaning service in Cape Town! Professional cleaners for homes, offices & Airbnb. Standard, deep, move-in/out cleaning. Same-day booking available. Call +27 87 153 5250"
        keywords="cleaning services Cape Town, professional cleaners Cape Town, home cleaning, deep cleaning, move out cleaning, Airbnb cleaning, maid services, office cleaning, Claremont cleaners, affordable cleaning service, residential cleaning, top rated cleaners, same day cleaning"
        canonical="https://shalean.co.za/"
      />
      <LocalBusinessStructuredData 
        areaServed={['Cape Town', 'Claremont', 'Rondebosch', 'Newlands', 'Constantia', 'Observatory', 'Woodstock', 'Sea Point']}
      />
      
      {/* Hero Section - Simplified */}
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

      {/* Our Services Section */}
      <section className="py-24" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Our Cleaning Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              Choose a category, then pick the service that fits your home.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceGroups.map((group, i) => (
              <Card 
                key={group.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border-0 shadow-lg animate-fade-up"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationFillMode: 'both'
                }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={group.services[0].image} 
                    alt={`${group.title} - Professional cleaning service in Cape Town`} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full text-white" style={{ backgroundColor: '#0C53ED' }}>
                      <group.icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-2">
                    {group.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    {group.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{group.services.length} service{group.services.length !== 1 ? 's' : ''}</span>
                    <span>
                      {group.services.some(s => s.priceLabel.includes('Custom')) 
                        ? 'Custom pricing' 
                        : `From ${group.services.find(s => !s.priceLabel.includes('Custom'))?.priceLabel.split(' ')[1] || 'R350'}`
                      }
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full group-hover:text-blue-600 transition-colors"
                  >
                    View Services →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-[#EAF2FF] text-primary border-primary/20 rounded-full font-medium">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              How It Works
              <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your home professionally cleaned in four easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className={`
                  relative z-10 bg-white rounded-2xl p-6 shadow-medium hover:shadow-large 
                  transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2
                  ${isIntersecting ? 'animate-fade-up' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  animationDelay: `${i * 0.2}s`
                }}>
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                      <div className="text-white text-xl font-bold">{step.number}</div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-primary/10">
                      <step.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
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

export default IndexSafe;
