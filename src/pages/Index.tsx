import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, CheckCircle, Star, Calendar, Home, Building2, Droplets, ClipboardCheck, Users, Award, Clock, Shield, BookOpen, Briefcase, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import luciaImage from '@/assets/lucia-pazvakavambwa.webp';
import normatterImage from '@/assets/normatter-mazhinji.webp';
import nyashaImage from '@/assets/nyasha-mudani.webp';
import blogCleaningTipsImage from '@/assets/blog-cleaning-tips.jpg';
import blogSpringCleaningImage from '@/assets/blog-spring-cleaning.jpg';
import blogEcoProductsImage from '@/assets/blog-eco-products.jpg';
import serviceStandardImage from '@/assets/service-standard-cleaning.jpg';
import serviceDeepImage from '@/assets/service-deep-cleaning.jpg';
import serviceMoveImage from '@/assets/service-move-inout.jpg';
import serviceSpecializedImage from '@/assets/service-specialized.jpg';
import cleaningTeamHero from '@/assets/cleaning-team-hero.jpg';
const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleQuickLogout = async () => {
    await signOut();
    window.location.reload();
  };
  const services = [{
    icon: Home,
    image: serviceStandardImage,
    title: 'Standard Cleaning',
    description: 'Regular home maintenance to keep your space fresh and tidy',
    features: ['Dusting & vacuuming', 'Kitchen & bathroom', 'Floor cleaning']
  }, {
    icon: Droplets,
    image: serviceDeepImage,
    title: 'Deep Cleaning',
    description: 'Thorough top-to-bottom cleaning for a spotless home',
    features: ['Behind appliances', 'Inside cabinets', 'Window cleaning']
  }, {
    icon: Building2,
    image: serviceMoveImage,
    title: 'Move In/Out',
    description: 'Complete cleaning for seamless transitions',
    features: ['Empty property focus', 'All surfaces sanitized', 'Ready for occupancy']
  }, {
    icon: Sparkles,
    image: serviceSpecializedImage,
    title: 'Specialized Services',
    description: 'Carpet, upholstery, and post-construction cleaning',
    features: ['Carpet shampooing', 'Furniture deep clean', 'Dust removal']
  }];
  const steps = [{
    number: '01',
    title: 'Choose Your Service',
    description: 'Select the cleaning package that fits your needs'
  }, {
    number: '02',
    title: 'Pick Date & Time',
    description: 'Book a slot that works with your schedule'
  }, {
    number: '03',
    title: 'Meet Your Cleaner',
    description: 'Get matched with a vetted professional'
  }, {
    number: '04',
    title: 'Enjoy Your Clean Home',
    description: 'Relax while we handle the rest'
  }];
  const team = [{
    name: 'Lucia Pazvakavambwa',
    role: 'Lead Cleaner',
    image: luciaImage,
    initials: 'LP',
    comment: 'Detail-oriented and reliable'
  }, {
    name: 'Normatter Mazhinji',
    role: 'Deep Clean Specialist',
    image: normatterImage,
    initials: 'NM',
    comment: 'Expert in deep cleaning'
  }, {
    name: 'Nyasha Mudani',
    role: 'Senior Cleaner',
    image: nyashaImage,
    initials: 'NM',
    comment: 'Thorough and professional'
  }];
  const benefits = [{
    icon: Shield,
    title: 'Fully Insured',
    description: 'All cleaners are insured and background-checked for your peace of mind'
  }, {
    icon: Award,
    title: 'Quality Guaranteed',
    description: "Not satisfied? We'll re-clean for free within 24 hours"
  }, {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book one-time or recurring services that fit your lifestyle'
  }, {
    icon: Users,
    title: 'Experienced Team',
    description: 'Our cleaners average 7+ years of professional experience'
  }];
  const blogPosts = [{
    title: '10 Tips for Maintaining a Clean Home',
    excerpt: 'Simple daily habits that make a big difference in keeping your home spotless',
    date: 'March 15, 2025',
    category: 'Tips & Tricks',
    image: blogCleaningTipsImage
  }, {
    title: 'Spring Cleaning Checklist',
    excerpt: 'Your complete guide to refreshing every corner of your home this season',
    date: 'March 10, 2025',
    category: 'Guides',
    image: blogSpringCleaningImage
  }, {
    title: 'Eco-Friendly Cleaning Products We Love',
    excerpt: 'Discover our favorite green cleaning solutions that are safe and effective',
    date: 'March 5, 2025',
    category: 'Products',
    image: blogEcoProductsImage
  }];
  const reviews = [{
    name: 'Jessica Miller',
    rating: 5,
    comment: 'Absolutely amazing service! My home has never looked better. The team was professional and thorough.',
    date: 'March 2025'
  }, {
    name: 'Robert Thompson',
    rating: 5,
    comment: "I've tried several cleaning services in Cape Town, and Shalean is by far the best. Reliable and detail-oriented.",
    date: 'February 2025'
  }, {
    name: 'Amanda Foster',
    rating: 5,
    comment: 'The deep cleaning service exceeded my expectations. Every corner sparkles! Highly recommend.',
    date: 'February 2025'
  }];
  return <div className="min-h-screen">
      <Header />
      
      {/* Temporary Quick Logout Button */}
      {user && (
        <div className="bg-yellow-100 border-b border-yellow-200 p-2 text-center">
          <Button onClick={handleQuickLogout} variant="destructive" size="sm">
            Emergency Logout ({user.email})
          </Button>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="inline-flex items-center gap-2 px-4 py-2" variant="outline">
              <Sparkles className="w-4 h-4" />
              Cape Town's Trusted Cleaning Experts
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Sparkling Clean Homes,
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                Every Time
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Professional cleaning services you can trust. Book vetted cleaners in minutes and 
              enjoy a spotless home without the hassle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" onClick={() => navigate('/booking/service/select')} className="text-lg px-8 h-auto shadow-lg hover:shadow-xl transition-shadow py-[12px]">
                Book Now
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/booking/quote')} className="text-lg px-8 h-auto py-[12px]">
                Get Free Quote
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">3+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="services" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Our Services</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive cleaning solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {services.map((service, i) => <Card key={i} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-40 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your home professionally cleaned in four easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {steps.map((step, i) => <div key={i} className="relative">
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Meet The Team</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Cleaning Experts</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experienced professionals dedicated to making your home shine
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, i) => <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/10">
                    <AvatarImage src={member.image} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{member.name}</CardTitle>
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-sm mt-1">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{member.comment}</Badge>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Our Promise</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quality service backed by trust and reliability
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, i) => <div key={i} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Apply to Work Section */}
      <section id="careers" className="py-24 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <Briefcase className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Join Our Team</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Looking for rewarding work with flexible hours? We're always looking for 
              passionate, reliable cleaners to join the Shalean family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="text-lg px-8 h-auto shadow-xl py-[12px]">
                Apply Now
                <ClipboardCheck className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-auto bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white py-[12px]">
                Learn More
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">Flexible</div>
                <div className="text-sm opacity-80">Schedule</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Competitive</div>
                <div className="text-sm opacity-80">Pay</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Supportive</div>
                <div className="text-sm opacity-80">Environment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <BookOpen className="w-3 h-3 mr-1" />
              Latest Posts
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cleaning Tips & News</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Expert advice and insights from our cleaning professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post, i) => <Card key={i} className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Read More →
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real feedback from real customers across Cape Town
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, i) => <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, idx) => <Star key={idx} className="w-5 h-5 fill-primary text-primary" />)}
                    </div>
                    <Quote className="w-8 h-8 text-primary/20" />
                  </div>
                  <CardDescription className="text-base text-foreground leading-relaxed">
                    "{review.comment}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-primary/10">
                      <AvatarFallback className="text-sm bg-primary/10 text-primary">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{review.name}</div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Team in Action Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-6">
              <Badge className="mb-2" variant="outline">Our Team in Action</Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Professional Service,
                <br />
                <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                  Delivered Every Time
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our experienced cleaning professionals take pride in delivering exceptional results. 
                With attention to detail and a commitment to excellence, we transform spaces into 
                spotless environments you'll love coming home to.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={() => navigate('/booking/service/select')}>
                  Book Our Team
                  <Calendar className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/booking/quote')}>
                  Get a Quote
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={cleaningTeamHero} 
                alt="Professional cleaning team at work"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;