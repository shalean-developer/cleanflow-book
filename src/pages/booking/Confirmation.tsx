import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Home,
  BedDouble,
  Bath,
  Repeat,
  Mail,
  Phone,
  FileText,
  Printer,
  Download,
  ExternalLink,
  Shield,
  Share2,
  Copy,
  CheckCircle,
  Circle,
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrencyZAR } from '@/utils/pricing';
import { useToast } from '@/hooks/use-toast';

export default function Confirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const { toast } = useToast();
  const { reset } = useBookingStore();

  const { data: booking, isLoading, isError, error } = useQuery({
    queryKey: ['booking', reference],
    queryFn: async () => {
      if (!reference) return null;
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(name), cleaners(name)')
        .eq('payment_reference', reference)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Booking not found');
      return data;
    },
    enabled: !!reference,
  });

  // Fetch extras details to display proper names
  const { data: extras } = useQuery({
    queryKey: ['extras', booking?.extras],
    queryFn: async () => {
      if (!booking?.extras?.length) return [];
      const { data } = await supabase.from('extras').select('*').in('id', booking.extras);
      return data || [];
    },
    enabled: !!booking?.extras?.length,
  });

  useEffect(() => {
    if (!reference) {
      navigate('/');
    }
  }, [reference, navigate]);

  // Clean up booking store when user leaves confirmation page
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const pricing = booking?.pricing as any;

  // Format date helpers
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Timeline steps
  const timelineSteps = [
    { label: 'Confirmed', status: 'current' },
    { label: 'Cleaner Assigned', status: 'upcoming' },
    { label: 'On the Way', status: 'upcoming' },
    { label: 'Completed', status: 'upcoming' },
  ];

  // Add to calendar handler
  const handleAddToCalendar = () => {
    if (!booking) return;
    
    try {
      // Generate .ics file content
      const startDateTime = new Date(`${booking.date}T${booking.time}`);
      const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
      
      const formatICSDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Shalean//Booking//EN',
        'BEGIN:VEVENT',
        `UID:${booking.reference}@shalean.com`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(startDateTime)}`,
        `DTEND:${formatICSDate(endDateTime)}`,
        `SUMMARY:${booking.services?.name} - Shalean`,
        `DESCRIPTION:Cleaning service at ${booking.location}`,
        `LOCATION:${booking.location}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');
      
      // Create blob and download
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shalean-booking-${booking.reference}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Calendar Event Created',
        description: 'The booking has been added to your calendar.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create calendar event.',
        variant: 'destructive',
      });
    }
  };

  // Copy link handler
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link Copied',
        description: 'Booking link copied to clipboard.',
      });
    }).catch(() => {
      toast({
        title: 'Error',
        description: 'Failed to copy link.',
        variant: 'destructive',
      });
    });
  };
  
  // Print handler
  const handlePrint = () => {
    window.print();
    toast({
      title: 'Print',
      description: 'Opening print dialog...',
    });
  };
  
  // Email handler
  const handleEmailAgain = () => {
    toast({
      title: 'Email Sent',
      description: `Confirmation sent again to ${booking?.customer_email}`,
    });
    // In production, this would call an API to resend the email
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0C53ED] mx-auto mb-4" />
          <p className="text-[#475569]">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !booking) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
            Booking Not Found
          </h1>
          <p className="text-[#475569] mb-6">
            {error?.message || 'We couldn\'t find the booking you\'re looking for. Please check your confirmation email or contact support.'}
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-[#0C53ED] hover:bg-[#0C53ED]/90"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="w-full"
            >
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC]">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-6 w-full" role="main">
        {/* Success Hero Card */}
        <Card className="bg-white rounded-2xl border-gray-100 shadow-md p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-[#0C53ED] to-[#2A869E]"
            aria-hidden="true"
          >
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">
            Booking Confirmed!
          </h1>
          
          <p className="text-[#475569] mb-4" role="status">
            We've sent a confirmation to <span className="font-semibold text-[#0F172A]">{booking.customer_email}</span>
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] rounded-full border border-gray-200">
            <span className="text-xs text-[#475569] uppercase tracking-wider">Booking ID</span>
            <code className="text-sm font-mono font-semibold text-[#0C53ED] tabular-nums">
              {booking.reference}
            </code>
          </div>

          {/* Timeline */}
          <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
            {timelineSteps.map((step, idx) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  {step.status === 'current' ? (
                    <CheckCircle className="w-6 h-6 text-[#0C53ED] fill-[#0C53ED]" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                  <span className={`text-xs ${step.status === 'current' ? 'text-[#0C53ED] font-semibold' : 'text-[#475569]'}`}>
                    {step.label}
                  </span>
                </div>
                {idx < timelineSteps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-2 mb-6" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6 items-start">
          {/* Left Column - Details */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            {/* Booking Details Card */}
            <Card className="bg-white rounded-2xl border-gray-100 shadow-md hover:shadow-lg transition-shadow p-6">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0C53ED]" />
                Booking Details
              </h2>
              
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-[#475569] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm text-[#475569] mb-0.5">Service</dt>
                    <dd className="font-semibold text-[#0F172A]">{booking.services?.name}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#475569] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm text-[#475569] mb-0.5">Date</dt>
                    <dd className="font-semibold text-[#0F172A]">{formatDate(booking.date)}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#475569] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm text-[#475569] mb-0.5">Time</dt>
                    <dd className="font-semibold text-[#0F172A] tabular-nums">{booking.time}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Repeat className="w-5 h-5 text-[#475569] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm text-[#475569] mb-0.5">Frequency</dt>
                    <dd className="font-semibold text-[#0F172A] capitalize">{booking.frequency.replace('-', ' ')}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BedDouble className="w-5 h-5 text-[#475569] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm text-[#475569] mb-0.5">Bedrooms</dt>
                    <dd className="font-semibold text-[#0F172A] tabular-nums">{booking.bedrooms}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Bath className="w-5 h-5 text-[#475569] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm text-[#475569] mb-0.5">Bathrooms</dt>
                    <dd className="font-semibold text-[#0F172A] tabular-nums">{booking.bathrooms}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-[#475569] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <dt className="text-sm text-[#475569] mb-0.5">Address</dt>
                    <dd className="font-semibold text-[#0F172A] truncate" title={booking.location}>
                      {booking.location}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <User className="w-5 h-5 text-[#475569] mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-sm text-[#475569] mb-0.5">Cleaner</dt>
                    <dd className="font-semibold text-[#0F172A]">
                      {booking.cleaners?.name || "We'll assign the best cleaner for you"}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-[#475569] flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  You'll receive reminders before your appointment.
                </p>
              </div>
            </Card>

            {/* Next Steps Card */}
            <Card className="bg-white rounded-2xl border-gray-100 shadow-md hover:shadow-lg transition-shadow p-6">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6">Next Steps</h2>
              
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-4 hover:bg-[#F8FAFC] rounded-xl transition-all hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                  onClick={handleAddToCalendar}
                  aria-label={`Add to calendar for ${formatDate(booking.date)} at ${booking.time}`}
                >
                  <Calendar className="w-5 h-5 mr-3 text-[#0C53ED]" />
                  <span className="text-[#0F172A] font-medium">Add to calendar</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-4 hover:bg-[#F8FAFC] rounded-xl transition-all hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                  onClick={() => navigate('/')}
                  aria-label="Update booking details"
                >
                  <FileText className="w-5 h-5 mr-3 text-[#0C53ED]" />
                  <span className="text-[#0F172A] font-medium">Update booking details</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-4 hover:bg-[#F8FAFC] rounded-xl transition-all hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                  asChild
                >
                  <a href="/contact" aria-label="Contact support">
                    <Phone className="w-5 h-5 mr-3 text-[#0C53ED]" />
                    <span className="text-[#0F172A] font-medium">Contact support</span>
                  </a>
                </Button>
              </div>
            </Card>

            {/* Rating Placeholder Card */}
            <Card className="bg-gradient-to-br from-[#F8FAFC] to-white rounded-2xl border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">Rate your experience</h3>
                  <p className="text-sm text-[#475569]">After your cleaning is complete</p>
                </div>
                <div className="flex gap-1" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Receipt Summary */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <Card className="sticky top-6 bg-white rounded-2xl border-gray-100 shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-[#0C53ED]" />
                <h2 className="text-xl font-bold text-[#0F172A]">Payment & Receipt</h2>
              </div>

              {/* Payment Reference */}
              <div className="mb-6 p-4 bg-[#F8FAFC] rounded-xl">
                <div className="text-xs text-[#475569] uppercase tracking-wider mb-1">
                  Paystack Reference
                </div>
                <div className="font-mono text-sm text-[#0F172A] break-all tabular-nums">
                  {booking.payment_reference}
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#475569]">Service</span>
                  <span className="font-semibold text-[#0F172A] tabular-nums">
                    {pricing?.subtotal ? formatCurrencyZAR(Number(pricing.subtotal)) : '—'}
                  </span>
                </div>

                {extras && extras.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#0F172A]">Extras</div>
                    {extras.map((extra) => (
                      <div key={extra.id} className="flex justify-between text-sm pl-3">
                        <span className="text-[#475569]">{extra.name}</span>
                        <span className="font-semibold text-[#0F172A] tabular-nums">
                          {formatCurrencyZAR(Number(extra.price))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {pricing?.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#475569]">Frequency Discount</span>
                    <span className="font-semibold text-green-600 tabular-nums">
                      -{formatCurrencyZAR(Number(pricing.discount))}
                    </span>
                  </div>
                )}

                {pricing?.promoDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#475569]">Promo Discount</span>
                    <span className="font-semibold text-green-600 tabular-nums">
                      -{formatCurrencyZAR(Number(pricing.promoDiscount))}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-[#475569]">Service Fee</span>
                  <span className="font-semibold text-[#0F172A] tabular-nums">
                    {pricing?.fees ? formatCurrencyZAR(Number(pricing.fees)) : '—'}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#0F172A]">Total</span>
                  <span className="text-2xl font-bold text-[#0C53ED] tabular-nums">
                    {pricing?.total ? formatCurrencyZAR(Number(pricing.total)) : '—'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  className="w-full bg-[#0C53ED] hover:bg-[#0C53ED]/90 text-white rounded-xl h-11 transition-all hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                  onClick={handlePrint}
                  aria-label="Print invoice"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="ghost"
                    className="rounded-xl h-11 transition-all hover:translate-y-[-1px] hover:bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                    onClick={handleAddToCalendar}
                    aria-label="Add to calendar"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Calendar
                  </Button>

                  <Button 
                    variant="ghost"
                    className="rounded-xl h-11 transition-all hover:translate-y-[-1px] hover:bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                    onClick={handleEmailAgain}
                    aria-label="Email receipt again"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>

              {/* Security Caption */}
              <p className="text-xs text-center text-[#475569] mt-6 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Secure payments via Paystack
              </p>
            </Card>
          </div>
        </div>

        {/* Secondary Info Band */}
        <Card className="bg-[#F8FAFC] border-gray-100 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#475569]">Need to make changes?</span>
              <Button
                variant="link"
                className="h-auto p-0 text-[#0C53ED] hover:text-[#0C53ED]/80 font-semibold focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2 rounded"
                onClick={() => navigate('/')}
              >
                Manage Booking
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#475569]">Share:</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-white transition-all hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                onClick={handleCopyLink}
                aria-label="Copy booking link"
              >
                <Copy className="w-4 h-4 text-[#475569]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-white transition-all hover:translate-y-[-1px] focus-visible:ring-2 focus-visible:ring-[#0C53ED] focus-visible:ring-offset-2"
                aria-label="Share booking"
              >
                <Share2 className="w-4 h-4 text-[#475569]" />
              </Button>
            </div>
          </div>
        </Card>
        </main>
    </div>
  );
}
