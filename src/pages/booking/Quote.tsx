import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
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
import { 
  Refrigerator, 
  Flame, 
  FileBox, 
  AppWindow, 
  Paintbrush, 
  Shirt, 
  WashingMachine,
  User,
  Mail,
  MapPin,
  Home,
  Plus,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

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

export default function Quote() {
  const navigate = useNavigate();
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch extras from database
  const { data: extras = [], isLoading: extrasLoading, error: extrasError } = useQuery({
    queryKey: ['extras'],
    queryFn: async () => {
      console.log('Fetching extras...');
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) {
        console.error('Error fetching extras:', error);
        throw error;
      }
      
      console.log('Extras fetched successfully:', data);
      return data || [];
    },
  });

  // Log extras error if any
  if (extrasError) {
    console.error('Extras query error:', extrasError);
    toast.error('Failed to load additional services. Please refresh the page.');
  }

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

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />;
  };

  const onSubmit = async (data: QuoteFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Selected extras:', selectedExtras);
    
    setIsSubmitting(true);
    try {
      const quoteReference = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      console.log('Saving quote to database with reference:', quoteReference);
      
      // Save quote to database first
      const { data: savedQuote, error: dbError } = await supabase
        .from('quotes')
        .insert({
          reference: quoteReference,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          address_1: data.address1,
          address_2: data.address2 || '',
          city: data.city,
          postal: data.postal,
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseInt(data.bathrooms),
          extras: selectedExtras,
          special_instructions: data.instructions || '',
          status: 'pending',
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        toast.error(`Database error: ${dbError.message}`);
        throw new Error('Failed to save quote request');
      }

      console.log('Quote saved successfully:', savedQuote);

      // Try to send email confirmation (non-blocking, won't fail the quote submission)
      try {
        const quoteData = {
          id: quoteReference,
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

        await supabase.functions.invoke('send-quote-confirmation', {
          body: quoteData,
        });
      } catch (emailError) {
        console.warn('Email sending failed, but quote was saved:', emailError);
        // Continue anyway - quote is saved in database
      }

      toast.success('Quote request submitted successfully! We\'ll contact you within 24 hours.');
      navigate(`/quote/confirmation?id=${quoteReference}`);
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-[#0F172A] mb-3 md:mb-4">Request a Quote</h1>
          <p className="text-[#4B5563] text-base md:text-lg max-w-2xl mx-auto px-2">
            Fill in your details and we'll get back to you with a customized quote within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
          {/* Personal Details */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <legend className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-[#0C53ED]/10 rounded-lg">
                <User className="w-4 h-4 md:w-5 md:h-5 text-[#0C53ED]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A]">Personal Details</h2>
              <div className="hidden md:flex flex-1 h-px bg-gray-100 ml-4"></div>
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[#0F172A] font-medium text-sm md:text-base">
                  First Name <span className="text-[#0C53ED]">*</span>
                </Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  className="rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <div className="flex items-center gap-2 text-[#B91C1C] text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#0F172A] font-medium text-sm md:text-base">
                  Last Name <span className="text-[#0C53ED]">*</span>
                </Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className="rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <div className="flex items-center gap-2 text-[#B91C1C] text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName.message}
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Contact Details */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-delay:80ms]">
            <legend className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-[#0C53ED]/10 rounded-lg">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#0C53ED]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A]">Contact Details</h2>
              <div className="hidden md:flex flex-1 h-px bg-gray-100 ml-4"></div>
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0F172A] font-medium text-sm md:text-base">
                  Email Address <span className="text-[#0C53ED]">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base"
                  placeholder="your.email@example.com"
                />
                <p className="text-gray-500 text-xs md:text-sm">We'll use this to send your quote</p>
                {errors.email && (
                  <div className="flex items-center gap-2 text-[#B91C1C] text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#0F172A] font-medium text-sm md:text-base">
                  Phone / WhatsApp <span className="text-[#0C53ED]">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                    <Badge variant="outline" className="text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-50 text-gray-600 border-gray-200">
                      +27
                    </Badge>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md pl-12 md:pl-16 text-sm md:text-base"
                    placeholder="XX XXX XXXX"
                  />
                </div>
                <p className="text-gray-500 text-xs md:text-sm">Include WhatsApp for faster communication</p>
                {errors.phone && (
                  <div className="flex items-center gap-2 text-[#B91C1C] text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone.message}
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Location */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-delay:160ms]">
            <legend className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-[#0C53ED]/10 rounded-lg">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#0C53ED]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A]">Location</h2>
              <div className="hidden md:flex flex-1 h-px bg-gray-100 ml-4"></div>
            </legend>
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address1" className="text-[#0F172A] font-medium text-sm md:text-base">
                  Address Line 1 <span className="text-[#0C53ED]">*</span>
                </Label>
                <Input
                  id="address1"
                  {...register('address1')}
                  className="rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base"
                  placeholder="Street address, building name, etc."
                />
                {errors.address1 && (
                  <div className="flex items-center gap-2 text-[#B91C1C] text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address1.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2" className="text-[#0F172A] font-medium text-sm md:text-base">
                  Address Line 2
                </Label>
                <Input
                  id="address2"
                  {...register('address2')}
                  className="rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[#0F172A] font-medium text-sm md:text-base">
                    Suburb/City <span className="text-[#0C53ED]">*</span>
                  </Label>
                  <Input
                    id="city"
                    {...register('city')}
                    className="rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base"
                    placeholder="e.g. Sandton, Cape Town"
                  />
                  {errors.city && (
                    <div className="flex items-center gap-2 text-[#B91C1C] text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city.message}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal" className="text-[#0F172A] font-medium text-sm md:text-base">
                    Postal Code <span className="text-[#0C53ED]">*</span>
                  </Label>
                  <Input
                    id="postal"
                    {...register('postal')}
                    className="rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base"
                    placeholder="e.g. 2196"
                  />
                  {errors.postal && (
                    <div className="flex items-center gap-2 text-[#B91C1C] text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.postal.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Home Details */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-delay:240ms]">
            <legend className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-[#0C53ED]/10 rounded-lg">
                <Home className="w-4 h-4 md:w-5 md:h-5 text-[#0C53ED]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A]">Home Details</h2>
              <div className="hidden md:flex flex-1 h-px bg-gray-100 ml-4"></div>
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-[#0F172A] font-medium text-sm md:text-base">
                  Bedrooms
                </Label>
                <Select value={bedrooms} onValueChange={(value) => setValue('bedrooms', value)}>
                  <SelectTrigger className="rounded-xl border-gray-200 bg-white focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'bedroom' : 'bedrooms'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-[#0F172A] font-medium text-sm md:text-base">
                  Bathrooms
                </Label>
                <Select value={bathrooms} onValueChange={(value) => setValue('bathrooms', value)}>
                  <SelectTrigger className="rounded-xl border-gray-200 bg-white focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md text-sm md:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'bathroom' : 'bathrooms'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          {/* Additional Services */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-delay:320ms]">
            <legend className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-[#0C53ED]/10 rounded-lg">
                <Plus className="w-4 h-4 md:w-5 md:h-5 text-[#0C53ED]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A]">Additional Services</h2>
              <div className="hidden md:flex flex-1 h-px bg-gray-100 ml-4"></div>
            </legend>
            
            {extrasLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#0C53ED]" />
                <span className="ml-2 text-gray-600">Loading services...</span>
              </div>
            ) : extras.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No additional services available at the moment.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 md:gap-3">
                {extras.map((extra) => {
                  const isSelected = selectedExtras.includes(extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra.id)}
                      aria-pressed={isSelected}
                      className={`
                        inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-3 rounded-full border-2 text-xs md:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2
                        ${isSelected 
                          ? 'bg-[#EAF2FF] border-[#0C53ED]/30 text-[#0C53ED] shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'
                        }
                      `}
                    >
                      <span className="w-4 h-4 md:w-5 md:h-5">
                        {getIcon(extra.icon || 'Sparkles')}
                      </span>
                      <span>{extra.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
            
            <p className="text-gray-500 text-xs md:text-sm mt-3 md:mt-4">
              Select any additional services you'd like included in your cleaning
            </p>
          </fieldset>

          {/* Special Instructions */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-delay:400ms]">
            <legend className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-[#0C53ED]/10 rounded-lg">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-[#0C53ED]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A]">Special Instructions</h2>
              <div className="hidden md:flex flex-1 h-px bg-gray-100 ml-4"></div>
            </legend>
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-[#0F172A] font-medium text-sm md:text-base">
                Additional Notes
              </Label>
              <Textarea
                {...register('instructions')}
                placeholder="Any specific requirements, access instructions, or special notes..."
                className="min-h-24 md:min-h-28 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 focus:border-transparent transition-all duration-200 focus:shadow-md resize-none text-sm md:text-base"
                maxLength={1000}
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0 text-xs md:text-sm text-gray-500">
                <span>Optional - helps us provide the best service</span>
                <span className="text-gray-400">{1000 - (watch('instructions')?.length || 0)} characters left</span>
              </div>
              {errors.instructions && (
                <div className="flex items-center gap-2 text-[#B91C1C] text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.instructions.message}
                </div>
              )}
            </div>
          </fieldset>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0C53ED] text-white rounded-full py-3 md:py-3.5 text-sm md:text-base font-semibold shadow-lg hover:brightness-110 hover:-translate-y-0.5 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                <span className="hidden sm:inline">Submitting Quote Request...</span>
                <span className="sm:hidden">Submitting...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Request Quote</span>
                <span className="sm:hidden">Request Quote</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
