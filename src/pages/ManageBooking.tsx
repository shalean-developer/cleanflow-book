import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, MapPin, DollarSign, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ManageBooking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingRef, setBookingRef] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!bookingRef || !email) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both booking reference and email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name, slug),
          profiles (full_name, email)
        `)
        .eq('reference', bookingRef)
        .eq('customer_email', email)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: 'Booking Not Found',
          description: 'No booking found with the provided reference and email',
          variant: 'destructive',
        });
        return;
      }

      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to retrieve booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">
            Manage Your Booking
          </h1>
          <p className="text-lg text-[#475569]">
            Enter your booking reference and email to view or modify your booking
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Booking</CardTitle>
            <CardDescription>
              Enter the booking reference from your confirmation email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Booking Reference
                </label>
                <Input
                  type="text"
                  placeholder="e.g., SHAL-1234567"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-[#0C53ED] hover:brightness-110"
              >
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? 'Searching...' : 'Find Booking'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        {booking && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Booking Details</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : booking.status === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                </span>
              </CardTitle>
              <CardDescription>
                Reference: {booking.reference}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#0C53ED] mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0F172A]">Customer</p>
                    <p className="text-[#475569]">{booking.profiles?.full_name}</p>
                    <p className="text-[#475569]">{booking.customer_email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#0C53ED] mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0F172A]">Service Date</p>
                    <p className="text-[#475569]">{formatDate(booking.service_date)}</p>
                  </div>
                </div>

                {booking.service_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#0C53ED] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0F172A]">Service Time</p>
                      <p className="text-[#475569]">{booking.service_time}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#0C53ED] mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0F172A]">Address</p>
                    <p className="text-[#475569]">
                      {booking.address}, {booking.suburb}
                    </p>
                  </div>
                </div>

                {booking.total_price && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-[#0C53ED] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0F172A]">Total Price</p>
                      <p className="text-[#475569]">{formatCurrency(booking.total_price)}</p>
                    </div>
                  </div>
                )}

                {booking.special_instructions && (
                  <div className="pt-4 border-t">
                    <p className="font-medium text-[#0F172A] mb-2">Special Instructions</p>
                    <p className="text-[#475569]">{booking.special_instructions}</p>
                  </div>
                )}

                <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => navigate('/contact')}
                    className="flex-1 bg-[#0C53ED]"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-[#475569] mb-4">
            Can't find your booking or need help?
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageBooking;

