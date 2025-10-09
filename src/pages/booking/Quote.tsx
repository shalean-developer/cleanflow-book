import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Refrigerator, Flame, FileBox, AppWindow, Paintbrush, Shirt, WashingMachine } from 'lucide-react';

const quoteSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone number is required').max(20),
  address1: z.string().min(1, 'Address is required').max(200),
  address2: z.string().max(200).optional(),
  city: z.string().min(1, 'Suburb/City is required').max(100),
  postal: z.string().min(1, 'Postal code is required').max(10),
  bedrooms: z.string(),
  bathrooms: z.string(),
  instructions: z.string().max(1000).optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const EXTRAS = [
  { id: 'inside-fridge', label: 'Inside Fridge', icon: Refrigerator },
  { id: 'inside-oven', label: 'Inside Oven', icon: Flame },
  { id: 'inside-cabinets', label: 'Inside Cabinets', icon: FileBox },
  { id: 'interior-windows', label: 'Interior Windows', icon: AppWindow },
  { id: 'interior-walls', label: 'Interior Walls', icon: Paintbrush },
  { id: 'ironing', label: 'Ironing', icon: Shirt },
  { id: 'laundry', label: 'Laundry', icon: WashingMachine },
];

export default function Quote() {
  const navigate = useNavigate();
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      bedrooms: '2',
      bathrooms: '1',
    },
  });

  const bedrooms = watch('bedrooms');
  const bathrooms = watch('bathrooms');

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const quoteId = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const quoteData = {
        id: quoteId,
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
        location: {
          address1: data.address1,
          address2: data.address2 || '',
          city: data.city,
          postal: data.postal,
        },
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        extras: selectedExtras,
        instructions: data.instructions || '',
      };

      const { error } = await supabase.functions.invoke('send-quote-confirmation', {
        body: quoteData,
      });

      if (error) throw error;

      toast.success('Quote request sent successfully!');
      navigate(`/quote/confirmation?id=${quoteId}`);
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Request a Quote</h1>
            <p className="text-muted-foreground">
              Fill in your details and we'll get back to you with a customized quote within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Details */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className="mt-1"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className="mt-1"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone / WhatsApp *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    {...register('phone')}
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address1">Address Line 1 *</Label>
                  <Input
                    id="address1"
                    {...register('address1')}
                    className="mt-1"
                  />
                  {errors.address1 && (
                    <p className="text-sm text-destructive mt-1">{errors.address1.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input
                    id="address2"
                    {...register('address2')}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Suburb/City *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      className="mt-1"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postal">Postal Code *</Label>
                    <Input
                      id="postal"
                      {...register('postal')}
                      className="mt-1"
                    />
                    {errors.postal && (
                      <p className="text-sm text-destructive mt-1">{errors.postal.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Home Details */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Home Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select value={bedrooms} onValueChange={(value) => setValue('bedrooms', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select value={bathrooms} onValueChange={(value) => setValue('bathrooms', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Extras */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Additional Services</h2>
              <div className="flex flex-wrap gap-2">
                {EXTRAS.map((extra) => {
                  const Icon = extra.icon;
                  const isSelected = selectedExtras.includes(extra.id);
                  return (
                    <Badge
                      key={extra.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer px-4 py-2 text-sm"
                      onClick={() => toggleExtra(extra.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {extra.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
              <Textarea
                {...register('instructions')}
                placeholder="Any specific requirements or notes..."
                className="min-h-[120px]"
                maxLength={1000}
              />
              {errors.instructions && (
                <p className="text-sm text-destructive mt-1">{errors.instructions.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Request Quote'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
