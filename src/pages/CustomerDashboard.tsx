import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  MapPin, 
  User,
  Plus,
  History,
  ListChecks,
  CalendarClock,
  RefreshCw,
  Repeat
} from 'lucide-react';
import { format, parseISO, isPast, isFuture } from 'date-fns';
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
  created_at: string;
  services: { name: string } | null;
  service_areas: { name: string } | null;
  cleaners: { full_name: string; photo_url?: string } | null;
}

// Utility functions
const formatBookingDate = (date: string, time: string) => {
  try {
    const dateTime = parseISO(`${date}T${time}`);
    return format(dateTime, "EEE, dd MMM yyyy • hh:mm a");
  } catch {
    return `${format(parseISO(date), "EEE, dd MMM yyyy")} • ${time}`;
  }
};

const formatPrice = (amount: number) => {
  return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const normalizeStatus = (status: string): 'pending' | 'confirmed' | 'cancelled' => {
  const normalized = status.toLowerCase();
  if (normalized === 'confirmed') return 'confirmed';
  if (normalized === 'cancelled') return 'cancelled';
  return 'pending';
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [memberSince, setMemberSince] = useState<string>('');
  
  // Filters
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  
  // Pagination
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadBookings();
    loadServices();
    loadMemberSince();
  }, [user, navigate]);

  const loadMemberSince = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user?.id)
        .single();
      
      if (data?.created_at) {
        setMemberSince(format(parseISO(data.created_at), 'MMM yyyy'));
      }
    } catch (error) {
      console.error('Error loading member since:', error);
    }
  };

  const loadServices = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('id, name')
        .eq('active', true);
      
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name),
          service_areas (name),
          cleaners (full_name, photo_url)
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Upcoming: future bookings with pending or confirmed status
      const upcoming = data?.filter(b => {
        const bookingDate = new Date(b.date);
        const status = normalizeStatus(b.status);
        return bookingDate >= today && (status === 'pending' || status === 'confirmed');
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
      
      // Past: past bookings or any cancelled
      const past = data?.filter(b => {
        const bookingDate = new Date(b.date);
        const status = normalizeStatus(b.status);
        return bookingDate < today || status === 'cancelled';
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

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
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'cancelled':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Apply filters
  const filteredUpcoming = upcomingBookings.filter(b => {
    if (selectedService !== 'all' && b.service_id !== selectedService) return false;
    if (selectedStatus !== 'all' && normalizeStatus(b.status) !== selectedStatus) return false;
    return true;
  });

  const filteredPast = pastBookings.filter(b => {
    if (selectedService !== 'all' && b.service_id !== selectedService) return false;
    if (selectedStatus !== 'all' && normalizeStatus(b.status) !== selectedStatus) return false;
    return true;
  });

  const paginatedUpcoming = filteredUpcoming.slice(0, upcomingPage * itemsPerPage);
  const paginatedPast = filteredPast.slice(0, pastPage * itemsPerPage);
  const hasMoreUpcoming = filteredUpcoming.length > paginatedUpcoming.length;
  const hasMorePast = filteredPast.length > paginatedPast.length;

  const BookingCard = ({ booking, isPast = false }: { booking: Booking; isPast?: boolean }) => {
    const status = normalizeStatus(booking.status);
    
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{booking.services?.name || 'Cleaning Service'}</CardTitle>
              <CardDescription className="mt-1.5 text-xs">
                {formatBookingDate(booking.date, booking.time)}
              </CardDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(booking.status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{booking.address || booking.service_areas?.name || 'Address not provided'}</span>
            </div>
            {booking.cleaners && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {booking.cleaners.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{booking.cleaners.full_name}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center pt-3 border-t gap-2">
            <span className="font-semibold text-lg text-primary">{formatPrice(booking.total_amount)}</span>
            <div className="flex gap-2">
              {!isPast && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toast.info('Reschedule feature coming soon')}
                  className="hover:bg-primary/10"
                >
                  <CalendarClock className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/booking/confirmation?reference=${booking.id}`)}
              >
                View
              </Button>
              {isPast && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate('/booking/service/select')}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <CustomerSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 border-b flex items-center px-6 bg-background">
              <SidebarTrigger />
              <div className="ml-4">
                <Skeleton className="h-8 w-48" />
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto">
                <LoadingSkeleton />
              </div>
            </main>
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
          <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
            </div>
            <Button size="lg" onClick={() => navigate('/booking/service/select')} className="hidden sm:flex">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">Welcome Back!</h2>
                  <p className="text-muted-foreground">Manage your cleaning bookings</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
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
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Bookings
                    </CardTitle>
                    <ListChecks className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{bookings.length}</div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Member Since
                    </CardTitle>
                    <User className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold">
                      {memberSince || '-'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Service</label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          {services.map(service => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <div className="flex gap-2 flex-wrap">
                        {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                          <Button
                            key={status}
                            variant={selectedStatus === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedStatus(status)}
                            className="capitalize"
                          >
                            {status === 'all' ? 'All' : status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Bookings */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Upcoming Bookings
                </h3>
                {paginatedUpcoming.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {paginatedUpcoming.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                    {hasMoreUpcoming && (
                      <div className="mt-6 text-center">
                        <Button 
                          variant="outline" 
                          onClick={() => setUpcomingPage(prev => prev + 1)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Load More
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h4 className="text-lg font-semibold mb-2">No Upcoming Bookings</h4>
                      <p className="text-muted-foreground mb-6">Start your cleaning journey today!</p>
                      <Button onClick={() => navigate('/booking/service/select')} size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Your First Cleaning
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Past Bookings */}
              {filteredPast.length > 0 && (
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                    <History className="w-6 h-6 text-primary" />
                    Past Bookings
                  </h3>
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {paginatedPast.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} isPast />
                      ))}
                    </div>
                    {hasMorePast && (
                      <div className="mt-6 text-center">
                        <Button 
                          variant="outline" 
                          onClick={() => setPastPage(prev => prev + 1)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Load More
                        </Button>
                      </div>
                    )}
                  </>
                </div>
              )}
            </div>
          </main>

          {/* Mobile CTA */}
          <div className="sm:hidden fixed bottom-4 right-4 z-50">
            <Button 
              size="lg" 
              onClick={() => navigate('/booking/service/select')}
              className="rounded-full shadow-lg w-14 h-14 p-0"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
