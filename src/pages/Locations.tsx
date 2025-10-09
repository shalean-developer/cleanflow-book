import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Locations = () => {
  const navigate = useNavigate();

  const serviceAreas = [
    {
      area: 'City Bowl',
      suburbs: [
        'Gardens',
        'Tamboerskloof',
        'Oranjezicht',
        'Vredehoek',
        'Cape Town CBD',
        'De Waterkant'
      ]
    },
    {
      area: 'Atlantic Seaboard',
      suburbs: [
        'Sea Point',
        'Bantry Bay',
        'Clifton',
        'Camps Bay',
        'Fresnaye',
        'Green Point'
      ]
    },
    {
      area: 'Southern Suburbs',
      suburbs: [
        'Newlands',
        'Claremont',
        'Rondebosch',
        'Kenilworth',
        'Bishopscourt',
        'Constantia'
      ]
    },
    {
      area: 'Northern Suburbs',
      suburbs: [
        'Durbanville',
        'Bellville',
        'Parow',
        'Goodwood',
        'Brackenfell',
        'Kraaifontein'
      ]
    },
    {
      area: 'West Coast',
      suburbs: [
        'Milnerton',
        'Table View',
        'Bloubergstrand',
        'Parklands',
        'Sunset Beach',
        'Big Bay'
      ]
    },
    {
      area: 'False Bay',
      suburbs: [
        'Muizenberg',
        'Kalk Bay',
        'Fish Hoek',
        'Simon\'s Town',
        'St James',
        'Lakeside'
      ]
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
              <MapPin className="w-4 h-4" />
              Serving Cape Town
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold">
              Service <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Locations</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We proudly serve homes and businesses across Cape Town and surrounding areas
            </p>
          </div>
        </div>
      </section>

      {/* Service Areas Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Where We Clean</h2>
            <p className="text-muted-foreground text-lg">
              Professional cleaning services available in the following areas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {serviceAreas.map((location, i) => (
              <Card key={i} className="hover:shadow-lg transition-all border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{location.area}</CardTitle>
                  </div>
                  <CardDescription>Available suburbs:</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {location.suburbs.map((suburb, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{suburb}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Info */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Don't see your area?
                </CardTitle>
                <CardDescription className="text-base">
                  We're constantly expanding our service areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If your location isn't listed above, don't worry! We're actively expanding our coverage 
                  throughout Cape Town. Contact us to check if we can accommodate your area, or join our 
                  waitlist to be notified when we expand to your neighborhood.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button onClick={() => navigate('#contact')}>
                    Contact Us
                  </Button>
                  <Button variant="outline">
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to book a cleaning?
            </h2>
            <p className="text-muted-foreground text-lg">
              Schedule your service today and experience the Shalean difference
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

export default Locations;
