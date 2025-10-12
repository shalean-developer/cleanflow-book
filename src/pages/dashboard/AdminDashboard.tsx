import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Briefcase, ClipboardList, LogOut, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AdminBookingsTable } from "@/components/dashboard/admin/AdminBookingsTable";
import { AdminCleanersTable } from "@/components/dashboard/admin/AdminCleanersTable";
import { AdminApplicationsTable } from "@/components/dashboard/admin/AdminApplicationsTable";

type Booking = Tables<'bookings'> & {
  services: Tables<'services'> | null;
  cleaners: Tables<'cleaners'> | null;
};

export default function AdminDashboard() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cleaners, setCleaners] = useState<Tables<'cleaners'>[]>([]);
  const [applications, setApplications] = useState<Tables<'cleaner_applications'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    activeCleaners: 0,
    pendingApplications: 0,
    revenue: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    fetchAllData();
  }, [user, isAdmin, navigate]);

  const fetchAllData = async () => {
    try {
      console.log('Fetching admin dashboard data for user:', user?.id);
      console.log('Is admin:', isAdmin);
      
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          services(*),
          cleaners(*)
        `)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Bookings error:', bookingsError);
        throw bookingsError;
      }
      console.log('Bookings fetched:', bookingsData?.length || 0);

      // Fetch cleaners
      const { data: cleanersData, error: cleanersError } = await supabase
        .from('cleaners')
        .select('*')
        .order('created_at', { ascending: false });

      if (cleanersError) {
        console.error('Cleaners error:', cleanersError);
        throw cleanersError;
      }
      console.log('Cleaners fetched:', cleanersData?.length || 0);

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('cleaner_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (applicationsError) {
        console.error('Applications error:', applicationsError);
        throw applicationsError;
      }
      console.log('Applications fetched:', applicationsData?.length || 0);

      setBookings(bookingsData || []);
      setCleaners(cleanersData || []);
      setApplications(applicationsData || []);

      // Calculate stats
      const totalRevenue = (bookingsData || []).reduce((sum, booking) => {
        const pricing = booking.pricing as any;
        return sum + (pricing?.total || 0);
      }, 0);

      setStats({
        totalBookings: bookingsData?.length || 0,
        pendingBookings: bookingsData?.filter(b => b.status === 'pending').length || 0,
        activeCleaners: cleanersData?.length || 0,
        pendingApplications: applicationsData?.filter(a => a.status === 'pending').length || 0,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your business operations</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalBookings}</p>
                </div>
                <Calendar className="h-12 w-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                </div>
                <ClipboardList className="h-12 w-12 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cleaners</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeCleaners}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.pendingApplications}</p>
                </div>
                <Briefcase className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">R{stats.revenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="cleaners">Cleaners</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage customer bookings and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminBookingsTable bookings={bookings} cleaners={cleaners} onUpdate={fetchAllData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cleaners Tab */}
          <TabsContent value="cleaners">
            <Card>
              <CardHeader>
                <CardTitle>Cleaner Management</CardTitle>
                <CardDescription>View and manage your cleaning staff</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCleanersTable cleaners={cleaners} onUpdate={fetchAllData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Cleaner Applications</CardTitle>
                <CardDescription>Review and process new cleaner applications</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApplicationsTable applications={applications} onUpdate={fetchAllData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

