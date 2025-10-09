import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  ClipboardList,
  Settings,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeCleaners: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleData?.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        navigate('/dashboard');
        return;
      }

      loadDashboardStats();
    };

    checkAdminAccess();
  }, [user, navigate]);

  const loadDashboardStats = async () => {
    try {
      // Get total bookings
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'confirmed');

      const totalRevenue = revenueData?.reduce((sum, booking) => 
        sum + Number(booking.total_amount), 0) || 0;

      // Get active cleaners
      const { count: cleanersCount } = await supabase
        .from('cleaners')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);

      // Get total customers
      const { count: customersCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      setStats({
        totalBookings: bookingsCount || 0,
        totalRevenue: totalRevenue,
        activeCleaners: cleanersCount || 0,
        totalCustomers: customersCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      description: 'All time bookings',
      color: 'text-blue-600',
    },
    {
      title: 'Total Revenue',
      value: `R ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: 'Total earnings',
      color: 'text-green-600',
    },
    {
      title: 'Active Cleaners',
      value: stats.activeCleaners,
      icon: Users,
      description: 'Currently active',
      color: 'text-purple-600',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: TrendingUp,
      description: 'Registered users',
      color: 'text-orange-600',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Bookings',
      description: 'View and manage all bookings',
      icon: ClipboardList,
      action: () => toast.info('Feature coming soon'),
    },
    {
      title: 'Manage Cleaners',
      description: 'Add or edit cleaner profiles',
      icon: Users,
      action: () => toast.info('Feature coming soon'),
    },
    {
      title: 'View Reports',
      description: 'Access detailed analytics',
      icon: BarChart3,
      action: () => toast.info('Feature coming soon'),
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      action: () => toast.info('Feature coming soon'),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your cleaning service business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <CardHeader>
                  <action.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Activity feed coming soon
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
