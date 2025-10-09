import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import * as Icons from 'lucide-react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Extra {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
}

interface ServiceArea {
  id: string;
  name: string;
}

export default function BookingQuote() {
  const navigate = useNavigate();
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('1');
  const [extras, setExtras] = useState<Extra[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Contact information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Service and location
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [openLocationPopover, setOpenLocationPopover] = useState(false);

  useEffect(() => {
    fetchExtras();
    fetchServices();
    fetchServiceAreas();
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

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, description')
        .eq('active', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    }
  };

  const fetchServiceAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .select('id, name')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setServiceAreas(data || []);
    } catch (error) {
      console.error('Error fetching service areas:', error);
      toast.error('Failed to load service areas');
    }
  };

  // Filter locations based on search (minimum 3 characters)
  const filteredLocations = locationSearch.length >= 3
    ? serviceAreas.filter(area =>
        area.name.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : [];

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const handleSubmit = async () => {
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
    if (!selectedService) {
      toast.error('Please select a service type');
      return;
    }
    if (!selectedLocation) {
      toast.error('Please select your location');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get selected service name
      const serviceName = services.find(s => s.id === selectedService)?.name || 'Cleaning Service';
      
      // Get selected location name
      const locationName = serviceAreas.find(a => a.id === selectedLocation)?.name || locationSearch;

      // Get selected extras names for the email
      const selectedExtrasNames = extras
        .filter(extra => selectedExtras.includes(extra.id))
        .map(extra => extra.name)
        .join(', ');

      const quoteMessage = `
Service Type: ${serviceName}
Location: ${locationName}

Property Details:
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
${selectedExtrasNames ? `- Extra Services: ${selectedExtrasNames}` : ''}
${specialInstructions ? `\nSpecial Instructions:\n${specialInstructions}` : ''}
      `.trim();

      // Send quote confirmation email
      const { error } = await supabase.functions.invoke('send-quote-confirmation', {
        body: {
          name: fullName,
          email: email,
          phone: phone,
          service: serviceName,
          message: quoteMessage
        }
      });

      if (error) {
        console.error('Error sending quote confirmation:', error);
        toast.error('Failed to send confirmation email');
        return;
      }

      toast.success('Quote request submitted successfully!');
      
      // Navigate to confirmation page
      navigate('/booking/quote/confirmation');
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote request');
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Service Type and Location */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Service Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="service" className="text-base mb-2 block">
                    Service Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger id="service" className="w-full">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location" className="text-base mb-2 block">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Popover open={openLocationPopover} onOpenChange={setOpenLocationPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openLocationPopover}
                        className="w-full justify-between"
                      >
                        {selectedLocation
                          ? serviceAreas.find(area => area.id === selectedLocation)?.name
                          : "Type 3 letters to search..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="Type at least 3 letters..." 
                          value={locationSearch}
                          onValueChange={setLocationSearch}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {locationSearch.length < 3 
                              ? "Type at least 3 letters to search" 
                              : "No locations found"}
                          </CommandEmpty>
                          {locationSearch.length >= 3 && (
                            <CommandGroup>
                              {filteredLocations.map(area => (
                                <CommandItem
                                  key={area.id}
                                  value={area.name}
                                  onSelect={() => {
                                    setSelectedLocation(area.id);
                                    setLocationSearch(area.name);
                                    setOpenLocationPopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedLocation === area.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {area.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Request Quote'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
