import { useState, useMemo } from "react";
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
import { Pagination } from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return bookings.slice(startIndex, endIndex);
  }, [bookings, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Debug logging
  console.log('AdminBookingsTable render:', {
    bookingsCount: bookings.length,
    cleanersCount: cleaners.length,
    sampleBooking: bookings[0] ? {
      id: bookings[0].id,
      cleaner_id: bookings[0].cleaner_id,
      status: bookings[0].status,
      cleaners: bookings[0].cleaners
    } : null,
    sampleCleaner: cleaners[0] ? {
      id: cleaners[0].id,
      name: (cleaners[0] as any).name,
      full_name: (cleaners[0] as any).full_name
    } : null,
    allBookings: bookings.map(b => ({
      id: b.id,
      cleaner_id: b.cleaner_id,
      status: b.status,
      hasCleanerData: !!b.cleaners
    }))
  });

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      console.log('Updating booking status:', { bookingId, status });
      
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      console.log('Booking status updated successfully, refreshing data...');

      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
      
      // Add a small delay to ensure database has updated
      setTimeout(() => {
        onUpdate();
      }, 500);
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
      console.log('Assigning cleaner:', { bookingId, cleanerId });
      
      const { error } = await supabase
        .from('bookings')
        .update({ cleaner_id: cleanerId })
        .eq('id', bookingId);

      if (error) throw error;

      console.log('Cleaner assigned successfully, refreshing data...');
      
      toast({
        title: "Cleaner Assigned",
        description: "Cleaner has been assigned to the booking.",
      });
      
      // Add a small delay to ensure database has updated
      setTimeout(() => {
        onUpdate();
      }, 500);
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
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Reference</TableHead>
              <TableHead className="whitespace-nowrap">Customer</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">Service</TableHead>
              <TableHead className="whitespace-nowrap">Date & Time</TableHead>
              <TableHead className="hidden lg:table-cell whitespace-nowrap">Location</TableHead>
              <TableHead className="hidden sm:table-cell whitespace-nowrap">Cleaner</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">Amount</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              paginatedBookings.map((booking) => {
                const pricing = booking.pricing as any;
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">{booking.reference}</TableCell>
                    <TableCell className="text-xs sm:text-sm max-w-[120px] truncate">{booking.customer_email}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">{booking.services?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="text-xs sm:text-sm">
                        <div className="whitespace-nowrap">{format(new Date(booking.date), 'MMM dd, yyyy')}</div>
                        <div className="text-gray-500">{booking.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm max-w-[150px] truncate">{booking.location}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Select
                        value={booking.cleaner_id || "unassigned"}
                        onValueChange={(value) => {
                          if (value !== "unassigned") {
                            assignCleaner(booking.id, value);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[120px] sm:w-[150px] text-xs sm:text-sm">
                          <SelectValue placeholder="Assign cleaner">
                            {(() => {
                              if (!booking.cleaner_id || booking.cleaner_id === "unassigned") {
                                return "Unassigned";
                              }
                              // Find the cleaner from the cleaners array
                              const assignedCleaner = cleaners.find(c => c.id === booking.cleaner_id);
                              if (assignedCleaner) {
                                return (assignedCleaner as any).name || (assignedCleaner as any).full_name || `Cleaner ${booking.cleaner_id.slice(0, 8)}`;
                              }
                              return `Cleaner ${booking.cleaner_id.slice(0, 8)}`;
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {cleaners.map((cleaner) => (
                            <SelectItem key={cleaner.id} value={cleaner.id}>
                              {(cleaner as any).name || (cleaner as any).full_name || `Cleaner ${cleaner.id.slice(0, 8)}`}
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
                        <SelectTrigger className="w-[100px] sm:w-[130px] text-xs sm:text-sm">
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
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">R{pricing?.total?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Assigned Cleaner</p>
                                  <p className="text-sm">
                                    {(() => {
                                      if (!selectedBooking.cleaner_id) {
                                        return 'Unassigned';
                                      }
                                      // Find the cleaner from the cleaners array
                                      const assignedCleaner = cleaners.find(c => c.id === selectedBooking.cleaner_id);
                                      if (assignedCleaner) {
                                        return (assignedCleaner as any).name || (assignedCleaner as any).full_name || `Cleaner ${selectedBooking.cleaner_id.slice(0, 8)}`;
                                      }
                                      return `Cleaner ${selectedBooking.cleaner_id.slice(0, 8)}`;
                                    })()}
                                  </p>
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

      {bookings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={bookings.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}

