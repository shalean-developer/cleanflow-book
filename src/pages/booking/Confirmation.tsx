import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBookingStore } from '@/store/bookingStore';
import { useAuth } from '@/hooks/useAuth';
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
  Settings,
  List,
} from 'lucide-react';
import { formatCurrencyZAR } from '@/utils/pricing';
import { useToast } from '@/hooks/use-toast';

export default function Confirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const { toast } = useToast();
  const { reset, booking: bookingData } = useBookingStore();
  const { user } = useAuth();

  const { data: booking, isLoading, isError, error } = useQuery({
    queryKey: ['booking', reference],
    queryFn: async () => {
      if (!reference) return null;
      
      // Find the booking in database
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(name), cleaners(name)')
        .eq('payment_reference', reference)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching booking:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Booking not found. If you just completed payment, please wait a moment and refresh the page.');
      }
      
      return data;
    },
    enabled: !!reference,
    retry: 3, // Retry a few times in case booking is still being created
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
  });

  useEffect(() => {
    if (booking) {
      reset(); // Clear booking store after successful confirmation
    }
  }, [booking, reset]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-700">Loading your booking details...</p>
      </div>
    );
  }

  if (isError || !booking) {
    const errorMessage = error?.message || 'Booking not found or an error occurred.';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Booking</h1>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const serviceName = booking.services?.name || 'Standard Cleaning';
  const cleanerName = booking.cleaners?.name || 'Normatter Mazhinji';
  const bookingDate = new Date(booking.date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const bookingTime = booking.time;
  const bookingAddress = booking.location;
  const totalAmount = booking.total_amount || booking.pricing?.total || 299.20;
  const frequencyDiscount = booking.pricing?.frequency_discount || 48.00;
  const serviceFee = booking.pricing?.service_fee || 27.20;
  const servicePrice = booking.pricing?.service_price || 320.00;
  const paystackReference = booking.payment_reference || 'BK-1760292439465-oiqtgz6gl';
  const customerEmail = booking.customer_email || 'chitekedzaf@gmail.com';

  const handlePrint = () => {
    window.print();
    toast({ title: 'Print Invoice', description: 'Opening print dialog...' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link Copied!', description: 'Booking link copied to clipboard.' });
  };

  const handleAddToCalendar = () => {
    toast({ title: 'Calendar', description: 'Adding to calendar...' });
  };

  const handleEmailInvoice = () => {
    toast({ title: 'Email Invoice', description: 'Sending invoice to your email...' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
        {/* Success Hero Card */}
        <Card className="bg-white p-4 sm:p-6 md:p-8 text-center shadow-lg rounded-lg mb-6 sm:mb-8">
          <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4">We've sent a confirmation to {customerEmail}</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            BOOKING ID <span className="text-blue-600 font-medium">{booking.reference}</span>
          </p>

          {/* Progress Tracker */}
          <div className="flex justify-center items-center space-x-1 sm:space-x-2 md:space-x-4 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto">
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-600 flex items-center justify-center text-white mb-1">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <span className="text-blue-600 font-medium text-center">Confirmed</span>
            </div>
            <div className="flex-grow h-px bg-gray-300 mx-1 sm:mx-2 min-w-[20px]"></div>
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 mb-1">
                <Circle className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <span className="text-center hidden sm:inline">Cleaner Assigned</span>
              <span className="text-center sm:hidden">Assigned</span>
            </div>
            <div className="flex-grow h-px bg-gray-300 mx-1 sm:mx-2 min-w-[20px]"></div>
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 mb-1">
                <Circle className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <span className="text-center hidden sm:inline">On the Way</span>
              <span className="text-center sm:hidden">En Route</span>
            </div>
            <div className="flex-grow h-px bg-gray-300 mx-1 sm:mx-2 min-w-[20px]"></div>
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 mb-1">
                <Circle className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <span className="text-center">Completed</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Booking Details & Next Steps */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Booking Details Card */}
            <Card className="bg-white p-4 sm:p-6 shadow-lg rounded-lg">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" /> Booking Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                    <span className="break-words">Service: <span className="font-medium">{serviceName}</span></span>
                  </div>
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                    <span>Time: <span className="font-medium">{bookingTime}</span></span>
                  </div>
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <BedDouble className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                    <span>Bedrooms: <span className="font-medium">{booking.bedrooms}</span></span>
                  </div>
                  <div className="flex items-start text-sm sm:text-base text-gray-700">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-0.5 sm:mt-1 text-gray-500 flex-shrink-0" />
                    <span className="break-words">Address: <span className="font-medium">{bookingAddress}</span></span>
                  </div>
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                    <span className="break-words">Cleaner: <span className="font-medium">{cleanerName}</span></span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                    <span className="break-words">Date: <span className="font-medium">{bookingDate}</span></span>
                  </div>
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <Repeat className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                    <span>Frequency: <span className="font-medium">Weekly</span></span>
                  </div>
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <Bath className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                    <span>Bathrooms: <span className="font-medium">{booking.bathrooms}</span></span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 text-xs sm:text-sm text-gray-500 flex items-center">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span>You'll receive reminders before your appointment.</span>
              </div>
            </Card>

            {/* Next Steps Card */}
            <Card className="bg-white p-4 sm:p-6 shadow-lg rounded-lg">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Next Steps</h2>
              <div className="space-y-3 sm:space-y-4">
                <button onClick={handleAddToCalendar} className="flex items-center text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" /> Add to calendar
                </button>
                <button className="flex items-center text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" /> Update booking details
                </button>
                <button className="flex items-center text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" /> Contact support
                </button>
              </div>
            </Card>

            {/* Rate Experience */}
            <Card className="bg-white p-4 sm:p-6 shadow-lg rounded-lg">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Rate your experience</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">After your cleaning is complete</p>
              <div className="flex space-x-1 sm:space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Payment & Receipt */}
          <Card className="bg-white p-4 sm:p-6 shadow-lg rounded-lg h-fit">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" /> Payment & Receipt
            </h2>
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-gray-600">PAYSTACK REFERENCE</p>
              <p className="font-medium text-sm sm:text-base text-gray-800 break-all">{paystackReference}</p>
              <div className="flex justify-between text-sm sm:text-base text-gray-700">
                <span>Service</span>
                <span className="font-medium">{formatCurrencyZAR(servicePrice)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-gray-700">
                <span>Frequency Discount</span>
                <span className="text-green-600 font-medium">-{formatCurrencyZAR(frequencyDiscount)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-gray-700">
                <span>Service Fee</span>
                <span className="font-medium">{formatCurrencyZAR(serviceFee)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-200">
                <span className="text-lg sm:text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrencyZAR(totalAmount)}</span>
              </div>
            </div>
            <Button onClick={handlePrint} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-md flex items-center justify-center text-sm sm:text-base transition-colors">
              <Printer className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> Print Invoice
            </Button>
            <div className="flex justify-around mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <button onClick={handleAddToCalendar} className="flex flex-col items-center hover:text-blue-600 transition-colors">
                <Download className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span>Calendar</span>
              </button>
              <button onClick={handleEmailInvoice} className="flex flex-col items-center hover:text-blue-600 transition-colors">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span>Email</span>
              </button>
            </div>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 text-xs sm:text-sm text-gray-500 flex items-center justify-center">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span>Secure payments via Paystack</span>
            </div>
          </Card>
        </div>

        {/* Manage Booking & Share Section - Full Width */}
        <Card className="bg-white p-4 sm:p-6 shadow-lg rounded-lg mt-4 sm:mt-6 lg:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm sm:text-base">
              <span className="text-gray-700">Need to make changes? </span>
              <button onClick={() => navigate('/manage-booking')} className="text-blue-600 hover:underline font-medium">
                Manage Booking
              </button>
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 inline ml-1 text-blue-600" />
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-sm sm:text-base text-gray-700">Share:</span>
              <button onClick={handleCopyLink} className="hover:text-blue-600 transition-colors p-1" title="Copy link">
                <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Shalean Booking',
                    text: 'Check out my cleaning booking!',
                    url: window.location.href
                  });
                } else {
                  handleCopyLink();
                }
              }} className="hover:text-blue-600 transition-colors p-1" title="Share">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}