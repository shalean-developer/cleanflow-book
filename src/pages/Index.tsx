import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <Sparkles className="w-4 h-4" />
                Professional Cleaning Services in Cape Town
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Sparkling Clean Homes,
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Delivered with Care
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Book trusted, professional cleaners in minutes. From standard cleaning to deep cleans, 
              we've got you covered across Cape Town.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/booking/service/select')}
                className="text-lg px-8 py-6 h-auto"
              >
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground text-lg">Professional service you can trust</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: CheckCircle,
                title: 'Vetted Professionals',
                description: 'All our cleaners are background-checked and highly experienced',
              },
              {
                icon: Star,
                title: 'Top-Rated Service',
                description: '4.8+ average rating from hundreds of satisfied customers',
              },
              {
                icon: Calendar,
                title: 'Flexible Scheduling',
                description: 'Book one-time or recurring cleaning services that fit your schedule',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-xl border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for a Spotless Home?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Book your cleaning service in just a few clicks
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/booking/service/select')}
              className="text-lg px-8 py-6 h-auto"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
