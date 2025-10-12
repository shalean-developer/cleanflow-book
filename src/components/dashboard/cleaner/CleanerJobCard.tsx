import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Home, Bath, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Booking = Tables<'bookings'> & {
  services: Tables<'services'> | null;
};

interface CleanerJobCardProps {
  booking: Booking;
  onUpdate: () => void;
}

export function CleanerJobCard({ booking, onUpdate }: CleanerJobCardProps) {
  const { toast } = useToast();

  const handleMarkComplete = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Job Completed",
        description: "Job has been marked as completed.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error completing job:', error);
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    
    const statusText = status || 'pending';
    return (
      <Badge className={statusColors[statusText as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </Badge>
    );
  };

  const pricing = booking.pricing as any;
  const canComplete = booking.status !== 'cancelled' && booking.status !== 'completed';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.services?.name || 'Cleaning Service'}
            </h3>
            <p className="text-sm text-gray-600">Ref: {booking.reference}</p>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{format(new Date(booking.date), 'MMMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{booking.time}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{booking.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Home className="h-4 w-4 mr-2" />
            <span className="text-sm">{booking.bedrooms} BR, {booking.bathrooms} BA</span>
          </div>
        </div>

        {booking.special_instructions && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Special Instructions:</p>
              <p className="text-sm text-blue-700">{booking.special_instructions}</p>
            </div>
          </div>
        )}

        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="text-sm font-medium">{booking.customer_email}</p>
            {booking.phone_number && (
              <p className="text-sm text-gray-600">{booking.phone_number}</p>
            )}
          </div>
          
          {canComplete && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Mark Complete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark Job as Complete?</DialogTitle>
                  <DialogDescription>
                    This will mark the job as completed. Make sure you've finished all the tasks.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Service:</strong> {booking.services?.name}</p>
                    <p className="text-sm"><strong>Location:</strong> {booking.location}</p>
                    <p className="text-sm"><strong>Date:</strong> {format(new Date(booking.date), 'MMMM dd, yyyy')}</p>
                    <p className="text-sm"><strong>Time:</strong> {booking.time}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {}}>
                    Cancel
                  </Button>
                  <Button onClick={handleMarkComplete} className="bg-green-600 hover:bg-green-700">
                    Confirm Complete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {booking.extras && booking.extras.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-600 mb-2">Additional Services:</p>
            <div className="flex flex-wrap gap-2">
              {booking.extras.map((extra, index) => (
                <Badge key={index} variant="secondary">{extra}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

