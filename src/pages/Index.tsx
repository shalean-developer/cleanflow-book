import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, CheckCircle, Star, Calendar, LogIn, User, Home, Building2, Droplets, ClipboardCheck, Users, Award, Clock, Shield, BookOpen, Briefcase, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
const Index = () => {
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const services = [{
    icon: Home,
    title: 'Standard Cleaning',
    description: 'Regular home maintenance to keep your space fresh and tidy',
    features: ['Dusting & vacuuming', 'Kitchen & bathroom', 'Floor cleaning']
  }, {
    icon: Droplets,
    title: 'Deep Cleaning',
    description: 'Thorough top-to-bottom cleaning for a spotless home',
    features: ['Behind appliances', 'Inside cabinets', 'Window cleaning']
  }, {
    icon: Building2,
    title: 'Move In/Out',
    description: 'Complete cleaning for seamless transitions',
    features: ['Empty property focus', 'All surfaces sanitized', 'Ready for occupancy']
  }, {
    icon: Sparkles,
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
    name: 'Sarah Johnson',
    role: 'Lead Cleaner',
    image: '',
    initials: 'SJ',
    experience: '8 years'
  }, {
    name: 'Michael Chen',
    role: 'Deep Clean Specialist',
    image: '',
    initials: 'MC',
    experience: '6 years'
  }, {
    name: 'Emma Davis',
    role: 'Senior Cleaner',
    image: '',
    initials: 'ED',
    experience: '5 years'
  }, {
    name: 'James Wilson',
    role: 'Team Supervisor',
    image: '',
    initials: 'JW',
    experience: '10 years'
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
    category: 'Tips & Tricks'
  }, {
    title: 'Spring Cleaning Checklist',
    excerpt: 'Your complete guide to refreshing every corner of your home this season',
    date: 'March 10, 2025',
    category: 'Guides'
  }, {
    title: 'Eco-Friendly Cleaning Products We Love',
    excerpt: 'Discover our favorite green cleaning solutions that are safe and effective',
    date: 'March 5, 2025',
    category: 'Products'
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Sparkles className="w-6 h-6 text-primary" />
              <span>Shalean</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
              <a href="#team" className="text-sm font-medium hover:text-primary transition-colors">Team</a>
              <a href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">Reviews</a>
              <a href="#blog" className="text-sm font-medium hover:text-primary transition-colors">Blog</a>
            </div>
            <div className="flex items-center gap-3">
              {user ? <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </> : <Button size="sm" onClick={() => navigate('/auth')}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>}
            </div>
          </div>
        </nav>
      </header>
      
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
                <div className="text-3xl font-bold text-primary">10+</div>
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
            {services.map((service, i) => <Card key={i} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, i) => <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/10">
                    <AvatarImage src={member.image} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="text-base">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{member.experience} experience</Badge>
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
            {benefits.map((benefit, i) => {})}
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
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all" />
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

      {/* Final CTA Section */}
      <section className="py-24 bg-muted/30">
        
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Shalean Cleaning</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional cleaning services across Cape Town. Quality you can trust.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#services" className="hover:text-primary transition-colors">Standard Cleaning</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Deep Cleaning</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Move In/Out</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Specialized Services</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#team" className="hover:text-primary transition-colors">Our Team</a></li>
                <li><a href="#careers" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#reviews" className="hover:text-primary transition-colors">Reviews</a></li>
                <li><a href="#blog" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Cape Town, South Africa</li>
                <li>info@shalean.co.za</li>
                <li>+27 21 123 4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Shalean Cleaning Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;