import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Briefcase, ClipboardList, LogOut, TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AdminBookingsTable } from "@/components/dashboard/admin/AdminBookingsTable";
import { AdminCleanersTable } from "@/components/dashboard/admin/AdminCleanersTable";
import { AdminApplicationsTable } from "@/components/dashboard/admin/AdminApplicationsTable";
import { AdminPricingManager } from "@/components/dashboard/admin/AdminPricingManager";
import { AdminPaymentsTable } from "@/components/dashboard/admin/AdminPaymentsTable";
import { useBookingsPage, useApplicationStats } from "@/hooks/useDashboardData";
import { useAdminStats } from "@/hooks/useAdminStats";

type Booking = Tables<'bookings'> & {
  services: Tables<'services'> | null;
  cleaners: Tables<'cleaners'> | null;
};

type Payment = Tables<'payments'> & {
  bookings: (Tables<'bookings'> & {
    services: Tables<'services'> | null;
  }) | null;
};

export default function AdminDashboard() {
  const { user, profile, isAdmin, signOut, loading: authLoading } = useAuth();
  
  // Use new data hooks for reliable Supabase data fetching
  const { rows: bookings, loading: bookingsLoading, refresh: refreshBookings } = useBookingsPage(50);
  const { data: adminStats, loading: adminStatsLoading, error: adminStatsError } = useAdminStats();
  const { stats: applicationStats, loading: applicationStatsLoading } = useApplicationStats();
  
  // Keep separate state for cleaners, applications, and payments (fetched separately)
  const [cleaners, setCleaners] = useState<Tables<'cleaners'>[]>([]);
  const [applications, setApplications] = useState<Tables<'cleaner_applications'>[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Combined loading state
  const loading = authLoading || bookingsLoading || adminStatsLoading || detailsLoading;

  useEffect(() => {
    console.log('AdminDashboard useEffect - authLoading:', authLoading, 'user:', user?.id, 'isAdmin:', isAdmin);
    
    // Wait for authentication to finish loading
    if (authLoading) {
      console.log('Authentication still loading...');
      return;
    }
    
    // Don't show access denied if user is null (logged out)
    if (!user) {
      console.log('No user, redirecting to home');
      navigate('/');
      return;
    }
    
    if (!isAdmin) {
      console.log('User is not admin, showing access denied');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    console.log('User is admin, fetching additional data');
    fetchAdditionalData();
  }, [authLoading, user, isAdmin, navigate]);

  const fetchAdditionalData = async () => {
    try {
      console.log('Fetching additional admin dashboard data for user:', user?.id);
      
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

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          bookings(
            *,
            services(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Payments error:', paymentsError);
        throw paymentsError;
      }
      console.log('Payments fetched:', paymentsData?.length || 0);

      setCleaners(cleanersData || []);
      setApplications(applicationsData || []);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching additional data:', error);
      toast({
        title: "Error",
        description: "Failed to load some dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDetailsLoading(false);
    }
  };
  
  // Callback to refresh all data
  const fetchAllData = () => {
    refreshBookings();
    fetchAdditionalData();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate immediately without waiting for auth state to change
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still navigate even if signOut fails
      navigate('/');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
          {/* Debug info */}
          <div className="mt-4 p-4 bg-white rounded-lg shadow text-left text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Auth Loading: {authLoading ? 'Yes' : 'No'}</p>
            <p>User ID: {user?.id || 'Not logged in'}</p>
            <p>User Email: {user?.email || 'N/A'}</p>
            <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
            <p>Profile Role: {profile?.role || 'No role in profile'}</p>
            <p>Component Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Admin Stats Loading: {adminStatsLoading ? 'Yes' : 'No'}</p>
            <p>Admin Stats Error: {adminStatsError?.message || 'None'}</p>
            <p>Admin Stats Data: {adminStats ? JSON.stringify(adminStats) : 'No data'}</p>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-primary">{adminStats?.total_bookings ?? 0}</p>
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
                  <p className="text-3xl font-bold text-yellow-600">{adminStats?.pending ?? 0}</p>
                </div>
                <ClipboardList className="h-12 w-12 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payments</p>
                  <p className="text-3xl font-bold text-emerald-600">{adminStats?.successful_payments ?? 0}</p>
                  <p className="text-xs text-gray-500">{adminStats?.successful_payments ?? 0} successful</p>
                </div>
                <DollarSign className="h-12 w-12 text-emerald-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cleaners</p>
                  <p className="text-3xl font-bold text-blue-600">{adminStats?.active_cleaners ?? 0}</p>
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
                  <p className="text-3xl font-bold text-purple-600">{applicationStats?.total ?? 0}</p>
                  <p className="text-xs text-gray-500">{applicationStats?.pending ?? 0} pending</p>
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
                  <p className="text-2xl font-bold text-green-600">R{(adminStats?.total_revenue ?? 0).toFixed(2)}</p>
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
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="cleaners">Cleaners</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage customer bookings and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Debug info */}
                <div className="mb-4 p-4 bg-blue-50 rounded text-sm">
                  <p><strong>Debug Info:</strong></p>
                  <p>Bookings count: {bookings.length}</p>
                  <p>Cleaners count: {cleaners.length}</p>
                  <p>First booking: {bookings[0] ? `${bookings[0].reference} - ${bookings[0].status}` : 'None'}</p>
                  <p>First cleaner: {cleaners[0] ? `${(cleaners[0] as any).name || (cleaners[0] as any).full_name || 'No name'}` : 'None'}</p>
                </div>
                <AdminBookingsTable bookings={bookings} cleaners={cleaners} onUpdate={fetchAllData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions ({payments.length})</CardTitle>
                <CardDescription>View all payment transactions and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payment records found
                  </div>
                ) : (
                  <AdminPaymentsTable payments={payments} />
                )}
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
                <CardTitle>Cleaner Applications ({applications.length})</CardTitle>
                <CardDescription>Review and process new cleaner applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-blue-50 rounded">
                  <p><strong>Debug Info:</strong></p>
                  <p>Applications in state: {applications.length}</p>
                  <p>First application: {applications[0] ? `${applications[0].first_name} ${applications[0].last_name}` : 'N/A'}</p>
                </div>
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No applications found
                  </div>
                ) : (
                  <AdminApplicationsTable applications={applications} onUpdate={fetchAllData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <AdminPricingManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

