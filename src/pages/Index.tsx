import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, CheckCircle, Star, Calendar, Home, Droplets, ClipboardCheck, Users, Award, Clock, Shield, BookOpen, Briefcase, Quote, Building2 } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useNavigate } from 'react-router-dom';
import { NewCustomerPromoModal } from '@/components/booking/NewCustomerPromoModal';
import { HeroApiIntegration } from '@/components/HeroApiIntegration';
import luciaImage from '@/assets/lucia-pazvakavambwa.webp';
import normatterImage from '@/assets/normatter-mazhinji.webp';
import nyashaImage from '@/assets/nyasha-mudani.webp';
import blogCleaningTipsImage from '@/assets/blog-cleaning-tips.jpg';
import blogSpringCleaningImage from '@/assets/blog-spring-cleaning.jpg';
import blogEcoProductsImage from '@/assets/blog-eco-products.jpg';
import cleaningTeamHero from '@/assets/cleaning-team-hero.jpg';
import serviceStandardImage from '@/assets/service-standard-cleaning.jpg';
import serviceDeepImage from '@/assets/service-deep-cleaning.jpg';
import serviceMoveImage from '@/assets/service-move-inout.jpg';
import serviceSpecializedImage from '@/assets/service-specialized.jpg';
const Index = () => {
  const navigate = useNavigate();
  const { elementRef: howItWorksRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '-50px'
  });
  const steps = [{
    number: '01',
    icon: ClipboardCheck,
    title: 'Choose Your Service',
    description: 'Select the cleaning package that fits your needs'
  }, {
    number: '02',
    icon: Calendar,
    title: 'Pick Date & Time',
    description: 'Book a slot that works with your schedule'
  }, {
    number: '03',
    icon: Users,
    title: 'Meet Your Cleaner',
    description: 'Get matched with a vetted professional'
  }, {
    number: '04',
    icon: Home,
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
    title: '6 Cleaning Mistakes That Can Frustrate Your Cleaning Efforts',
    excerpt: 'One-time cleaning services understand the frustration that comes with dust invading the tranquility of a pristine home. This unwelcome guest finds its way into every corner, making your cleaning efforts feel futile.',
    category: 'Cleaning Tips',
    icon: Sparkles,
    image: blogCleaningTipsImage
  }, {
    title: 'How Often Should You Get Your House Cleaned?',
    excerpt: 'Whether it\'s to give your home a fresh, clean feeling or enjoy great company during any given moment of the day, there are plenty of reasons to get your house professionally cleaned.',
    category: 'Home Care',
    icon: Home,
    image: blogSpringCleaningImage
  }, {
    title: 'Professional Mopping Tips',
    excerpt: 'Mopping is a common chore for many people in the home or office. It is an effortless house cleaning task that can remove dirt, grime, and germs from surfaces. However, it can be frustrating to get the best results.',
    category: 'Professional Tips',
    icon: Droplets,
    image: blogEcoProductsImage
  }];
  const services = [{
    icon: Home,
    image: serviceStandardImage,
    title: 'Standard Cleaning',
    description: 'Regular home maintenance to keep your space fresh and tidy',
    price: 'From R350'
  }, {
    icon: Droplets,
    image: serviceDeepImage,
    title: 'Deep Cleaning',
    description: 'Thorough top-to-bottom cleaning for a spotless home',
    price: 'From R550'
  }, {
    icon: Building2,
    image: serviceMoveImage,
    title: 'Move In/Out Cleaning',
    description: 'Complete cleaning for seamless transitions',
    price: 'From R650'
  }, {
    icon: Sparkles,
    image: serviceSpecializedImage,
    title: 'Specialized Services',
    description: 'Carpet, upholstery, and post-construction cleaning',
    price: 'Custom Quote'
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
  return <div>
      {/* Hero Section */}
      <HeroApiIntegration />

      {/* Our Services Section */}
      <section className="py-24" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              Our Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
              Choose from our comprehensive range of professional cleaning solutions designed to meet your specific needs and keep your space spotless.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <Card 
                key={i} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border-0 shadow-lg animate-fade-up"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationFillMode: 'both'
                }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full text-white" style={{ backgroundColor: '#0C53ED' }}>
                      <service.icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">{service.price}</Badge>
                  </div>
                  <CardDescription className="text-gray-600 leading-relaxed mt-3">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full group-hover:text-blue-600 transition-colors"
                    onClick={() => navigate('/booking/service/select')}
                  >
                    Book Now →
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
                {/* Connecting line for desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 z-0" />
                )}
                
                {/* Step Card */}
                <div className={`
                  relative z-10 bg-white rounded-2xl p-6 shadow-medium hover:shadow-large 
                  transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2
                  ${isIntersecting ? 'animate-fade-up' : 'opacity-0 translate-y-8'}
                  ${i % 2 === 0 && isIntersecting ? 'lg:animate-slide-in-left' : i % 2 === 1 && isIntersecting ? 'lg:animate-slide-in-right' : ''}
                `}
                style={{
                  animationDelay: `${i * 0.2}s`
                }}>
                  {/* Icon Circle with Gradient */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                      <div className="text-white text-xl font-bold">{step.number}</div>
                    </div>
                    {/* Step Icon */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-primary/10">
                      <step.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#180D39] relative inline-block">
              Our Cleaning Experts
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] rounded-full"></div>
            </h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
              Experienced professionals dedicated to making your home shine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, i) => (
              <Card 
                key={i} 
                className={`text-center bg-white shadow-lg hover:shadow-xl hover:-translate-y-2 hover:border-[#0C53ED]/30 border-2 border-transparent rounded-xl transition-all duration-300 ease-out group ${
                  i === 0 ? 'animate-fade-up-delay-1' : 
                  i === 1 ? 'animate-fade-up-delay-2' : 
                  'animate-fade-up-delay-3'
                }`}
              >
                <CardHeader className="pb-4">
                  {/* Profile Photo with Gradient Ring */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0C53ED] to-[#2A869E] p-1 group-hover:p-1.5 transition-all duration-300">
                      <Avatar className="w-full h-full border-4 border-white shadow-lg">
                        <AvatarImage src={member.image} className="object-cover" />
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-[#0C53ED]/10 to-[#2A869E]/10 text-[#0C53ED]">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  {/* Name with improved hierarchy */}
                  <CardTitle className="text-xl font-bold text-[#180D39] mb-3">
                    {member.name}
                  </CardTitle>
                  
                  {/* Star Rating */}
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-[#0C53ED] text-[#0C53ED]" />
                    ))}
                  </div>
                  
                  {/* Divider Line */}
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#0C53ED]/30 to-transparent mx-auto mb-3"></div>
                  
                  {/* Role */}
                  <CardDescription className="text-[#64748B] font-medium text-base">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Pill-style tagline */}
                  <Badge 
                    variant="secondary" 
                    className="bg-[#EAF2FF] text-[#0C53ED] border-[#0C53ED]/20 hover:bg-[#D1E7FF] transition-colors duration-200 px-4 py-2 text-sm font-medium rounded-full"
                  >
                    {member.comment}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-32 bg-[#F8FAFC] dark:bg-[#0B1220]">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Block */}
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 text-[#4B5563] border-gray-200 dark:bg-white/10 dark:text-white/70 dark:border-white/20">
              Our Promise
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#180D39] dark:text-white relative inline-block">
              Why Choose Us?
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#0C53ED] rounded-full"></div>
            </h2>
            <p className="text-[#4B5563] dark:text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Quality service backed by trust and reliability
            </p>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, i) => (
              <article 
                key={i} 
                role="article"
                className="group bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-100 dark:border-white/10 shadow-md hover:shadow-lg hover:-translate-y-[2px] hover:border-[#0C53ED]/20 hover:ring-2 hover:ring-[#0C53ED]/10 transition-all duration-300 ease-out p-8 text-center h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0C53ED] animate-fade-up-scale"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                {/* Icon Badge */}
                <div className="relative w-14 h-14 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#0C53ED] to-[#2A869E] flex items-center justify-center shadow-sm">
                    <benefit.icon 
                      className="w-7 h-7 text-white" 
                      style={{ strokeWidth: '1.75' }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-[#180D39] dark:text-white mb-4">
                  {benefit.title}
                </h3>
                
                {/* Divider */}
                <div className="w-10 h-[2px] bg-[#0C53ED]/30 mx-auto mb-4"></div>
                
                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 dark:text-white/70 leading-relaxed max-w-[28ch] mx-auto">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Apply to Work Section */}
      <section id="careers" className="relative py-20 md:py-28 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C53ED] to-[#2A869E]" />
        
        {/* Grain/Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            {/* Icon Badge */}
            <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg animate-float">
              <Briefcase className="w-9 h-9 text-white" aria-hidden="true" />
            </div>
            
            {/* Heading & Subheading */}
            <div className="space-y-6 animate-fade-up">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Join Our Team
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-[70ch] mx-auto leading-relaxed">
                Looking for rewarding work with flexible hours? We're always looking for 
                passionate, reliable cleaners to join the Shalean family.
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-up-delay-1">
              <Button 
                size="lg" 
                className="bg-white text-[#0C53ED] hover:bg-white/95 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 text-lg px-8 py-3 h-auto transition-all duration-300"
              >
                Apply Now
                <ClipboardCheck className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/50 rounded-full backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 text-lg px-8 py-3 h-auto transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
            
            {/* Benefits Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-up-delay-2">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-white p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="text-xl font-bold mb-1">Flexible</div>
                <div className="text-sm text-white/80">Schedule</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-white p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="text-xl font-bold mb-1">Competitive</div>
                <div className="text-sm text-white/80">Pay</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-white p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="text-xl font-bold mb-1">Supportive</div>
                <div className="text-sm text-white/80">Environment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 bg-[#F8FAFC] dark:bg-[#0B1220]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* Latest Posts Badge */}
            <Badge className="mb-6 inline-flex items-center px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-sm text-[#475569] dark:text-white/70 rounded-full">
              <BookOpen className="w-3 h-3 mr-1.5" />
              Latest Posts
            </Badge>
            
            {/* Main Title with Accent Underline */}
            <div className="relative mb-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                Cleaning Tips & News
              </h2>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#0C53ED] rounded-full"></div>
            </div>
            
            {/* Subheading */}
            <p className="text-[#475569] dark:text-white/70 text-lg max-w-[68ch] mx-auto leading-relaxed">
              Expert advice and insights from our cleaning professionals
            </p>
          </div>
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, i) => (
              <article 
                key={i} 
                className="group cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#0C53ED] rounded-2xl"
              >
                <a 
                  href="#" 
                  className="block h-full bg-white dark:bg-[#0B1220] border border-gray-100 dark:border-white/10 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:border-[#0C53ED]/20 dark:hover:border-white/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Image Container with Category Chip */}
                  <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Category Chip Overlay */}
                    <div className="absolute top-4 left-4">
                      <Badge className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-white/90 dark:bg-white/10 backdrop-blur-sm text-[#475569] dark:text-white/70 border border-white/20 dark:border-white/10 rounded-full shadow-sm">
                        {post.icon && <post.icon className="w-3 h-3 mr-1.5" />}
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 flex flex-col h-full">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white line-clamp-2 mb-3 group-hover:text-[#0C53ED] transition-colors duration-200">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-sm text-[#475569] dark:text-white/70 line-clamp-3 mb-6 flex-grow">
                      {post.excerpt}
                    </p>
                    
                    {/* Divider and Read More */}
                    <div className="mt-auto">
                      <div className="border-t border-gray-100 dark:border-white/10 mb-4"></div>
                      <span className="text-sm font-medium text-[#0C53ED] hover:underline transition-all duration-200 inline-flex items-center">
                        Read More →
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">What Our Clients Say</h2>
            <div className="w-16 h-1 bg-[#0C53ED] mx-auto mt-2 rounded-full"></div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mt-6">
              Real feedback from real customers across Cape Town
            </p>
          </div>
          
          {/* Desktop/Tablet Grid */}
          <div className="hidden md:grid xl:grid-cols-3 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {reviews.map((review, i) => (
              <blockquote 
                key={i} 
                className="group rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0B1220] p-6 md:p-7 shadow-md hover:translate-y-[-2px] hover:shadow-lg hover:border-[#0C53ED]/20 dark:hover:border-[#0C53ED]/30 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0C53ED]"
                style={{ 
                  animationDelay: `${i * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1" aria-label={`${review.rating} star rating`}>
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-[#0C53ED] text-[#0C53ED]" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] bg-clip-text text-transparent opacity-40" />
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-white/90 leading-relaxed text-lg">
                    "{review.comment}"
                  </p>
                </div>
                
                <div className="w-10 h-[2px] bg-[#0C53ED]/20 mb-4"></div>
                
                <footer className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0C53ED] to-[#2A869E] flex items-center justify-center text-white font-semibold text-sm ring-2 ring-[#0C53ED]/20 ring-offset-2">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{review.name}</div>
                    <div className="text-sm text-gray-500 dark:text-white/70">{review.date}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {reviews.map((review, i) => (
                <blockquote 
                  key={i} 
                  className="flex-none w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0B1220] p-6 shadow-md snap-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0C53ED]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1" aria-label={`${review.rating} star rating`}>
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-5 h-5 fill-[#0C53ED] text-[#0C53ED]" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] bg-clip-text text-transparent opacity-40" />
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-white/90 leading-relaxed text-lg line-clamp-5">
                      "{review.comment}"
                    </p>
                  </div>
                  
                  <div className="w-10 h-[2px] bg-[#0C53ED]/20 mb-4"></div>
                  
                  <footer className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0C53ED] to-[#2A869E] flex items-center justify-center text-white font-semibold text-sm ring-2 ring-[#0C53ED]/20 ring-offset-2">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{review.name}</div>
                      <div className="text-sm text-gray-500 dark:text-white/70">{review.date}</div>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team in Action Section */}
      <section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, transparent 100%)'
        }}
        aria-label="Hero"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8 order-2 lg:order-1">
              {/* Badge */}
              <Badge 
                className="inline-flex items-center rounded-full border border-gray-200 bg-white text-sm px-3 py-1 text-[#4B5563] shadow-xs dark:border-white/20 dark:bg-white/10 dark:text-white/70"
                variant="outline"
              >
                Our Team in Action
              </Badge>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#180D39] dark:text-white">
                  Professional Service,
                  <br />
                  <span className="bg-gradient-to-r from-[#0C53ED] to-[#2A869E] bg-clip-text text-transparent">
                    Delivered Every Time
                  </span>
                </h1>
                {/* Decorative underline - visible on md+ */}
                <div className="hidden md:block w-16 h-[3px] bg-[#0C53ED] rounded-full"></div>
              </div>

              {/* Body Text */}
              <p className="text-gray-600 md:text-lg leading-relaxed max-w-[65ch] dark:text-white/80">
                Our experienced cleaning professionals take pride in delivering exceptional results. 
                With attention to detail and a commitment to excellence, we transform spaces into 
                spotless environments you'll love coming home to.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/booking/service/select')}
                  className="bg-[#0C53ED] hover:brightness-110 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0C53ED]"
                >
                  Book Our Team
                  <Calendar className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/booking/quote')}
                  className="bg-white border-gray-200 text-[#180D39] hover:border-[#0C53ED]/30 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0C53ED] dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:border-white/30"
                >
                  Get a Quote
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
                {/* Image with aspect ratios */}
                <img 
                  src={cleaningTeamHero} 
                  alt="Professional cleaning team at work" 
                  className="w-full aspect-[4/3] md:aspect-[16/10] object-cover transition-transform duration-700 hover:scale-[1.02] group-hover:scale-105"
                  style={{
                    animation: 'fadeInScale 0.8s ease-out forwards'
                  }}
                />
                
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                
                {/* Optional caption chip */}
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-white/90 backdrop-blur-sm text-[#4B5563] border border-white/20 rounded-full shadow-sm dark:bg-white/10 dark:text-white/70 dark:border-white/20">
                    Shalean crew on site
                  </div>
                </div>
              </div>
              
              {/* Decorative corner glows */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-radial from-[#0C53ED]/10 to-transparent rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-radial from-[#2A869E]/8 to-transparent rounded-full pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      <NewCustomerPromoModal />
    </div>;
};
export default Index;