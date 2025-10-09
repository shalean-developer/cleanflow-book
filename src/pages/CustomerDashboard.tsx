import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  User,
  Plus,
  History,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CustomerSidebar } from '@/components/CustomerSidebar';

interface Booking {
  id: string;
  service_id: string;
  date: string;
  time: string;
  status: string;
  total_amount: number;
  address: string;
  services: { name: string } | null;
  service_areas: { name: string } | null;
  cleaners: { full_name: string } | null;
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name),
          service_areas (name),
          cleaners (full_name)
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const upcoming = data?.filter(b => new Date(b.date) >= now && b.status !== 'cancelled') || [];
      const past = data?.filter(b => new Date(b.date) < now || b.status === 'cancelled') || [];

      setBookings(data || []);
      setUpcomingBookings(upcoming);
      setPastBookings(past);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.services?.name || 'Cleaning Service'}</CardTitle>
            <CardDescription className="mt-1">
              {format(new Date(booking.date), 'PPP')} at {booking.time}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{booking.address || booking.service_areas?.name}</span>
        </div>
        {booking.cleaners && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{booking.cleaners.full_name}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-semibold text-primary">R {Number(booking.total_amount).toFixed(2)}</span>
          <Button variant="outline" size="sm" onClick={() => navigate(`/booking/confirmation?reference=${booking.id}`)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <CustomerSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CustomerSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b flex items-center px-6 bg-background">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-2xl font-bold">Customer Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Welcome Back!</h2>
                  <p className="text-muted-foreground">Manage your cleaning bookings</p>
                </div>
                <Button size="lg" onClick={() => navigate('/booking/service/select')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Upcoming Bookings
                    </CardTitle>
                    <Calendar className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{upcomingBookings.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Bookings
                    </CardTitle>
                    <History className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{bookings.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Member Since
                    </CardTitle>
                    <Star className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {user?.created_at ? format(new Date(user.created_at), 'MMM yyyy') : '-'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Bookings */}
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Upcoming Bookings
                </h3>
                {upcomingBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                      <Button onClick={() => navigate('/booking/service/select')}>
                        Book Your First Cleaning
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <History className="w-6 h-6 text-primary" />
                    Past Bookings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastBookings.slice(0, 6).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
