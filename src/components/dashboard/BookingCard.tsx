import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, DollarSign } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Booking = Tables<'bookings'> & {
  services: Tables<'services'> | null;
  cleaners: Tables<'cleaners'> | null;
};

interface BookingCardProps {
  booking: Booking;
  onUpdate: () => void;
}

export function BookingCard({ booking, onUpdate }: BookingCardProps) {
  const { toast } = useToast();

  const handleCancelBooking = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
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
  const canCancel = booking.status !== 'cancelled' && 
                   booking.status !== 'completed' && 
                   new Date(booking.date) > new Date();

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
          
          {booking.cleaners && (
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">{booking.cleaners.name}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <div className="flex items-center text-gray-900 font-semibold">
            <DollarSign className="h-5 w-5 mr-1" />
            <span>R{pricing?.total?.toFixed(2) || '0.00'}</span>
          </div>
          
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Cancel Booking
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will cancel your booking and you may need to rebook if you change your mind.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelBooking}>
                    Yes, cancel booking
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {booking.special_instructions && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Special Instructions:</span> {booking.special_instructions}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

