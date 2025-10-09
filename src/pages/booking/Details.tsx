import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { StickySummary } from '@/components/booking/StickySummary';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NewCustomerPromoModal } from '@/components/booking/NewCustomerPromoModal';
import { ServiceChangeValidator } from '@/components/booking/ServiceChangeValidator';

export default function Details() {
  const navigate = useNavigate();
  const { booking, setDetails } = useBookingStore();
  
  const [bedrooms, setBedrooms] = useState(booking.bedrooms);
  const [bathrooms, setBathrooms] = useState(booking.bathrooms);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(booking.extras);
  const [specialInstructions, setSpecialInstructions] = useState(booking.specialInstructions || '');

  const { data: extras } = useQuery({
    queryKey: ['extras'],
    queryFn: async () => {
      const { data } = await supabase.from('extras').select('*').order('name');
      return data || [];
    },
  });

  useEffect(() => {
    if (!booking.serviceId) {
      navigate('/booking/service/select');
    }
  }, [booking.serviceId, navigate]);

  const handleContinue = () => {
    setDetails(bedrooms, bathrooms, selectedExtras, specialInstructions);
    navigate('/booking/schedule');
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : <LucideIcons.Sparkles className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
                <p className="text-muted-foreground">Tell us about your space and any extras you need</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Room Details</CardTitle>
                  <CardDescription>Select the number of bedrooms and bathrooms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Select value={bedrooms.toString()} onValueChange={(v) => setBedrooms(Number(v))}>
                        <SelectTrigger id="bedrooms">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Select value={bathrooms.toString()} onValueChange={(v) => setBathrooms(Number(v))}>
                        <SelectTrigger id="bathrooms">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Extra Services</CardTitle>
                  <CardDescription>Select any additional services you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {extras?.map((extra) => (
                      <div
                        key={extra.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                        onClick={() => toggleExtra(extra.id)}
                      >
                        <Checkbox
                          id={extra.id}
                          checked={selectedExtras.includes(extra.id)}
                          onCheckedChange={() => toggleExtra(extra.id)}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          {getIcon(extra.icon || 'Sparkles')}
                          <Label htmlFor={extra.id} className="flex-1 cursor-pointer">
                            {extra.name}
                          </Label>
                          <span className="text-sm font-medium">R{Number(extra.price).toFixed(0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                  <CardDescription>Any specific requirements or notes for the cleaner? (Optional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="E.g., Please use pet-friendly products, pay special attention to the kitchen..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>

              <Button onClick={handleContinue} size="lg" className="w-full md:w-auto">
                Continue to Schedule
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="lg:block hidden">
              <StickySummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ServiceChangeValidator />
      <NewCustomerPromoModal />
    </div>
  );
}
