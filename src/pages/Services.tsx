import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Droplets, Building2, Sparkles, CheckCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import serviceStandardImage from '@/assets/service-standard-cleaning.jpg';
import serviceDeepImage from '@/assets/service-deep-cleaning.jpg';
import serviceMoveImage from '@/assets/service-move-inout.jpg';
import serviceSpecializedImage from '@/assets/service-specialized.jpg';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Home,
      image: serviceStandardImage,
      title: 'Standard Cleaning',
      description: 'Regular home maintenance to keep your space fresh and tidy',
      features: [
        'Dusting all surfaces',
        'Vacuuming and mopping floors',
        'Kitchen cleaning and sanitizing',
        'Bathroom cleaning and disinfecting',
        'Trash removal',
        'Making beds and tidying rooms'
      ],
      price: 'From R350'
    },
    {
      icon: Droplets,
      image: serviceDeepImage,
      title: 'Deep Cleaning',
      description: 'Thorough top-to-bottom cleaning for a spotless home',
      features: [
        'Behind and under furniture',
        'Inside cabinets and drawers',
        'Baseboards and crown molding',
        'Window cleaning (interior)',
        'Appliance deep clean',
        'Light fixture cleaning'
      ],
      price: 'From R550'
    },
    {
      icon: Building2,
      image: serviceMoveImage,
      title: 'Move In/Out Cleaning',
      description: 'Complete cleaning for seamless transitions',
      features: [
        'Empty property focus',
        'All surfaces sanitized',
        'Cabinet and closet cleaning',
        'Wall spot cleaning',
        'Full kitchen and bathroom detail',
        'Ready for occupancy'
      ],
      price: 'From R650'
    },
    {
      icon: Sparkles,
      image: serviceSpecializedImage,
      title: 'Specialized Services',
      description: 'Carpet, upholstery, and post-construction cleaning',
      features: [
        'Carpet shampooing and stain removal',
        'Upholstery deep cleaning',
        'Post-construction dust removal',
        'High-traffic area restoration',
        'Odor elimination',
        'Fabric protection treatment'
      ],
      price: 'Custom Quote'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
              <img src="/favicon.png" alt="Shalean Logo" className="w-6 h-6" />
              <span>Shalean</span>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="inline-flex items-center gap-2 px-4 py-2" variant="outline">
              <Sparkles className="w-4 h-4" />
              Professional Cleaning Services
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold">
              Our <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose from our comprehensive range of cleaning solutions designed to meet your specific needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <Card key={i} className="hover:shadow-xl transition-all border-2 hover:border-primary/20 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-56 object-cover"
                />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <service.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{service.title}</CardTitle>
                        <Badge variant="secondary" className="mt-2">{service.price}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base mt-4">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/booking/service/select')}
                  >
                    Book This Service
                    <Calendar className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Not sure which service you need?
            </h2>
            <p className="text-muted-foreground text-lg">
              Get a free, personalized quote based on your specific requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate('/booking/quote')}>
                Get Free Quote
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/booking/service/select')}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
