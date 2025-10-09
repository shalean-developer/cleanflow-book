import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';

interface Extra {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function BookingQuote() {
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('1');
  const [extras, setExtras] = useState<Extra[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Contact information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('id, name, icon, description')
        .eq('active', true);

      if (error) throw error;
      setExtras(data || []);
    } catch (error) {
      console.error('Error fetching extras:', error);
      toast.error('Failed to load extra services');
    }
  };

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const handleSubmit = () => {
    // Validate contact information
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    const quote = {
      fullName,
      email,
      phone,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      extras: selectedExtras,
      specialInstructions
    };
    console.log('Quote:', quote);
    toast.success('Quote request submitted! We will contact you shortly.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Get Your Cleaning Quote</h1>
          <p className="text-muted-foreground">Tell us about your property and needs</p>
        </div>

        <Card className="p-8 shadow-large">
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Your Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="fullName" className="text-base mb-2 block">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-base mb-2 block">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-base mb-2 block">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Property Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bedrooms" className="text-base mb-2 block">Number of Bedrooms</Label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger id="bedrooms" className="w-full">
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bathrooms" className="text-base mb-2 block">Number of Bathrooms</Label>
                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger id="bathrooms" className="w-full">
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={String(num)}>
                          {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Extra Services */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Extra Services</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {extras.map(extra => {
                  const IconComponent = (Icons as any)[extra.icon] || Icons.Sparkles;
                  const isSelected = selectedExtras.includes(extra.id);

                  return (
                    <Card
                      key={extra.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleExtraToggle(extra.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleExtraToggle(extra.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-primary/20' : 'bg-muted'
                            }`}>
                              <IconComponent className={`w-4 h-4 ${
                                isSelected ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <h3 className="font-semibold text-sm">{extra.name}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">{extra.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <Label htmlFor="instructions" className="text-base mb-2 block">
                Special Instructions (Optional)
              </Label>
              <Textarea
                id="instructions"
                placeholder="Any specific requirements or areas of focus?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full md:w-auto px-12"
              >
                Request Quote
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
