import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format } from "date-fns";
import { Eye, Edit } from "lucide-react";

type Booking = Tables<'bookings'> & {
  services: Tables<'services'> | null;
  cleaners: Tables<'cleaners'> | null;
};

interface AdminBookingsTableProps {
  bookings: Booking[];
  cleaners: Tables<'cleaners'>[];
  onUpdate: () => void;
}

export function AdminBookingsTable({ bookings, cleaners, onUpdate }: AdminBookingsTableProps) {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive"
      });
    }
  };

  const assignCleaner = async (bookingId: string, cleanerId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ cleaner_id: cleanerId })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Cleaner Assigned",
        description: "Cleaner has been assigned to the booking.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error assigning cleaner:', error);
      toast({
        title: "Error",
        description: "Failed to assign cleaner.",
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Cleaner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const pricing = booking.pricing as any;
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.reference}</TableCell>
                    <TableCell>{booking.customer_email}</TableCell>
                    <TableCell>{booking.services?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(booking.date), 'MMM dd, yyyy')}</div>
                        <div className="text-gray-500">{booking.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{booking.location}</TableCell>
                    <TableCell>
                      <Select
                        value={booking.cleaner_id || "unassigned"}
                        onValueChange={(value) => {
                          if (value !== "unassigned") {
                            assignCleaner(booking.id, value);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Assign cleaner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {cleaners.map((cleaner) => (
                            <SelectItem key={cleaner.id} value={cleaner.id}>
                              {cleaner.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={booking.status || "pending"}
                        onValueChange={(value) => updateBookingStatus(booking.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>R{pricing?.total?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                              Reference: {booking.reference}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedBooking && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Customer Email</p>
                                  <p className="text-sm">{selectedBooking.customer_email}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Phone</p>
                                  <p className="text-sm">{selectedBooking.phone_number || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Service</p>
                                  <p className="text-sm">{selectedBooking.services?.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                                  <p className="text-sm">
                                    {format(new Date(selectedBooking.date), 'MMMM dd, yyyy')} at {selectedBooking.time}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Location</p>
                                  <p className="text-sm">{selectedBooking.location}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Frequency</p>
                                  <p className="text-sm capitalize">{selectedBooking.frequency}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Bedrooms</p>
                                  <p className="text-sm">{selectedBooking.bedrooms}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Bathrooms</p>
                                  <p className="text-sm">{selectedBooking.bathrooms}</p>
                                </div>
                              </div>
                              {selectedBooking.special_instructions && (
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Special Instructions</p>
                                  <p className="text-sm">{selectedBooking.special_instructions}</p>
                                </div>
                              )}
                              {selectedBooking.extras && selectedBooking.extras.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Extras</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedBooking.extras.map((extra, index) => (
                                      <Badge key={index} variant="secondary">{extra}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

