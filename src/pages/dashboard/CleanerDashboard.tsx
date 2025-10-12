// @ts-nocheck - Disabling type checking due to Supabase deep type instantiation issues
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, LogOut, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CleanerJobCard } from "@/components/dashboard/cleaner/CleanerJobCard";

type Booking = Tables<'bookings'> & {
  services: Tables<'services'> | null;
};

export default function CleanerDashboard() {
  const { user, profile, isCleaner, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cleanerProfile, setCleanerProfile] = useState<Tables<'cleaners'> | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper to avoid type instantiation issues
  const queryCleaners = async (userId: string) => {
    const result = await supabase
      .from('cleaners')
      .select('*')
      .eq('user_id', userId);
    return result as any;
  };

  const queryBookings = async (cleanerId: string) => {
    const result = await supabase
      .from('bookings')
      .select('*, services(*)')
      .eq('cleaner_id', cleanerId)
      .order('date', { ascending: true });
    return result as any;
  };

  useEffect(() => {
    if (!user || !isCleaner) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    fetchCleanerData();
  }, [user, isCleaner, navigate]);

  const fetchCleanerData = async () => {
    if (!user?.id) return;
    
    try {
      // First, get the cleaner profile using helper function
      const cleanersResponse = await queryCleaners(user.id);
      
      const cleanerData = cleanersResponse.data?.[0] as Tables<'cleaners'> | null;
      const cleanerError = cleanersResponse.error;

      if (cleanerError || !cleanerData) {
        console.error('Error fetching cleaner profile:', cleanerError);
        toast({
          title: "Error",
          description: "Could not find cleaner profile. Please contact admin.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      setCleanerProfile(cleanerData);

      // Then get all bookings assigned to this cleaner
      const bookingsResponse = await queryBookings(cleanerData.id);

      const bookingsData = bookingsResponse.data as Booking[] | null;
      const bookingsError = bookingsResponse.error;

      if (bookingsError) throw bookingsError;

      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load your jobs. Please try again.",
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

  const upcomingJobs = bookings.filter(b => 
    new Date(b.date) >= new Date() && b.status !== 'cancelled' && b.status !== 'completed'
  );
  
  const completedJobs = bookings.filter(b => 
    b.status === 'completed'
  );

  const todayJobs = upcomingJobs.filter(b => 
    format(new Date(b.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!cleanerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No cleaner profile found. Please contact admin.</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {cleanerProfile.name}!
            </h1>
            <p className="text-gray-600 mt-1">View your assigned jobs and schedule</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Jobs</p>
                  <p className="text-3xl font-bold text-primary">{todayJobs.length}</p>
                </div>
                <Calendar className="h-12 w-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Jobs</p>
                  <p className="text-3xl font-bold text-blue-600">{upcomingJobs.length}</p>
                </div>
                <Clock className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedJobs.length}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {cleanerProfile.rating?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center text-yellow-600 opacity-20 text-4xl">
                  ★
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Today's Jobs Tab */}
          <TabsContent value="today" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Jobs scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                {todayJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs today</h3>
                    <p className="text-gray-600">You have no jobs scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayJobs.map((booking) => (
                      <CleanerJobCard key={booking.id} booking={booking} onUpdate={fetchCleanerData} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Jobs Tab */}
          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Jobs</CardTitle>
                <CardDescription>Your scheduled jobs</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming jobs</h3>
                    <p className="text-gray-600">You have no jobs scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingJobs.map((booking) => (
                      <CleanerJobCard key={booking.id} booking={booking} onUpdate={fetchCleanerData} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Jobs Tab */}
          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Jobs</CardTitle>
                <CardDescription>Your job history</CardDescription>
              </CardHeader>
              <CardContent>
                {completedJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No completed jobs</h3>
                    <p className="text-gray-600">Completed jobs will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedJobs.map((booking) => (
                      <CleanerJobCard key={booking.id} booking={booking} onUpdate={fetchCleanerData} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Your cleaner information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg">{cleanerProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <p className="text-lg">{cleanerProfile.rating?.toFixed(1) || 'Not yet rated'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service Areas</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cleanerProfile.service_areas.map((area, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

