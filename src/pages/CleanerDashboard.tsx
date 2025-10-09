import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  CheckCircle,
  DollarSign,
  Star,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  date: string;
  time: string;
  status: string;
  total_amount: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  user_id: string;
  services: { name: string } | null;
  service_areas: { name: string } | null;
}

const CleanerDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [cleanerProfile, setCleanerProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    upcomingJobs: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    const checkCleanerAccess = async () => {
      // Wait for auth to complete
      if (authLoading) return;
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check role from AuthContext instead of querying again
      if (userRole !== 'cleaner') {
        toast.error('Access denied. Cleaner privileges required.');
        navigate('/dashboard');
        return;
      }

      loadCleanerData();
    };

    checkCleanerAccess();
  }, [user, userRole, authLoading, navigate]);

  const loadCleanerData = async () => {
    try {
      // Get cleaner profile using user_id
      const { data: cleaner, error: cleanerError } = await supabase
        .from('cleaners')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (cleanerError) {
        console.error('Error fetching cleaner profile:', cleanerError);
      }

      if (!cleaner) {
        toast.error('No cleaner profile found. Please contact administrator.');
        setLoading(false);
        return;
      }

      setCleanerProfile(cleaner);

      // Get assignments using the cleaner's id
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name),
          service_areas (name)
        `)
        .eq('cleaner_id', cleaner.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setAssignments(bookings || []);

      // Calculate stats
      const now = new Date();
      const completed = bookings?.filter(b => b.status === 'confirmed' && new Date(b.date) < now).length || 0;
      const upcoming = bookings?.filter(b => new Date(b.date) >= now && b.status === 'confirmed').length || 0;
      const earnings = bookings?.filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

      setStats({
        totalJobs: bookings?.length || 0,
        completedJobs: completed,
        upcomingJobs: upcoming,
        totalEarnings: earnings,
      });
    } catch (error) {
      console.error('Error loading cleaner data:', error);
      toast.error('Failed to load assignments');
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

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{assignment.services?.name || 'Cleaning Job'}</CardTitle>
            <CardDescription className="mt-1">
              {format(new Date(assignment.date), 'PPP')} at {assignment.time}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(assignment.status)}>
            {assignment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{assignment.address || assignment.service_areas?.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Customer</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {assignment.bedrooms} bed • {assignment.bathrooms} bath
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-semibold text-primary">R {Number(assignment.total_amount).toFixed(2)}</span>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading || authLoading) {
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

  const upcomingAssignments = assignments.filter(a => 
    new Date(a.date) >= new Date() && a.status === 'confirmed'
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cleaner Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {cleanerProfile?.full_name || 'Cleaner'}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Jobs
              </CardTitle>
              <Calendar className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming
              </CardTitle>
              <Clock className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.upcomingJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R {stats.totalEarnings.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Assignments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Upcoming Assignments
          </h2>
          {upcomingAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming assignments</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Performance Overview
            </CardTitle>
            <CardDescription>Your ratings and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{cleanerProfile?.rating || '5.0'}</div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {stats.completedJobs} completed jobs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default CleanerDashboard;
