import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Home, CheckCircle, Shield, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
              Simple & Easy Process
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold">
              How It <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Works</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Get your home professionally cleaned in four simple steps
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {steps.map((step, i) => (
              <Card key={i} className="overflow-hidden border-2 hover:border-primary/20 transition-all">
                <div className="grid md:grid-cols-[200px_1fr] gap-0">
                  <div className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-8 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold mb-4">{step.number}</div>
                    <step.icon className="w-12 h-12" />
                  </div>
                  <div className="p-8">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl">{step.title}</CardTitle>
                      <CardDescription className="text-base">{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Shalean?</h2>
            <p className="text-muted-foreground text-lg">
              Quality service backed by trust and reliability
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg">
              Book your first cleaning in just a few minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate('/booking/service/select')}>
                Book Now
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/booking/quote')}>
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
