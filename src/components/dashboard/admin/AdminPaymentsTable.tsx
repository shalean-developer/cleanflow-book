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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Eye, CreditCard } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";

type Payment = Tables<'payments'> & {
  bookings: (Tables<'bookings'> & {
    services: Tables<'services'> | null;
  }) | null;
};

interface AdminPaymentsTableProps {
  payments: Payment[];
}

export function AdminPaymentsTable({ payments }: AdminPaymentsTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return payments.slice(startIndex, endIndex);
  }, [payments, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getStatusBadge = (status: string | null) => {
    const statusColors = {
      success: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    
    const statusText = status || 'pending';
    return (
      <Badge className={statusColors[statusText as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    const currencySymbol = currency === 'ZAR' ? 'R' : currency || '';
    return `${currencySymbol}${(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Payment Ref</TableHead>
              <TableHead className="hidden sm:table-cell whitespace-nowrap">Booking Ref</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">Customer</TableHead>
              <TableHead className="hidden lg:table-cell whitespace-nowrap">Service</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">Provider</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="hidden lg:table-cell whitespace-nowrap">Paid At</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              paginatedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <span className="font-mono text-xs">
                        {payment.reference?.substring(0, 12)}...
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-mono text-xs">
                    {payment.bookings?.reference || 'N/A'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs sm:text-sm max-w-[120px] truncate">{payment.bookings?.customer_email || 'N/A'}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs sm:text-sm">{payment.bookings?.services?.name || 'N/A'}</TableCell>
                  <TableCell className="font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="capitalize text-xs">
                      {payment.provider || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {payment.paid_at ? (
                      <div className="text-xs sm:text-sm">
                        <div className="whitespace-nowrap">{format(new Date(payment.paid_at), 'MMM dd, yyyy')}</div>
                        <div className="text-gray-500 text-xs">
                          {format(new Date(payment.paid_at), 'HH:mm')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Payment Details</DialogTitle>
                          <DialogDescription>
                            Full payment information
                          </DialogDescription>
                        </DialogHeader>
                        {selectedPayment && (
                          <div className="space-y-6">
                            {/* Payment Information */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Payment Reference</p>
                                  <p className="text-sm font-mono break-all">{selectedPayment.reference}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Payment ID</p>
                                  <p className="text-sm font-mono text-xs break-all">{selectedPayment.id}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Amount</p>
                                  <p className="text-xl font-bold text-green-600">
                                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Status</p>
                                  <div className="mt-1">
                                    {getStatusBadge(selectedPayment.status)}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Provider</p>
                                  <p className="text-sm capitalize">{selectedPayment.provider || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Currency</p>
                                  <p className="text-sm">{selectedPayment.currency || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Created At</p>
                                  <p className="text-sm">
                                    {format(new Date(selectedPayment.created_at), 'MMM dd, yyyy HH:mm')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Paid At</p>
                                  <p className="text-sm">
                                    {selectedPayment.paid_at 
                                      ? format(new Date(selectedPayment.paid_at), 'MMM dd, yyyy HH:mm')
                                      : 'Not paid yet'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Booking Information */}
                            {selectedPayment.bookings && (
                              <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-3">Associated Booking</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Booking Reference</p>
                                    <p className="text-sm font-mono">{selectedPayment.bookings.reference}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Customer Email</p>
                                    <p className="text-sm">{selectedPayment.bookings.customer_email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Service</p>
                                    <p className="text-sm">{selectedPayment.bookings.services?.name || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Booking Status</p>
                                    <Badge variant="outline" className="capitalize">
                                      {selectedPayment.bookings.status || 'N/A'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Booking Date</p>
                                    <p className="text-sm">
                                      {format(new Date(selectedPayment.bookings.date), 'MMM dd, yyyy')}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Booking Time</p>
                                    <p className="text-sm">{selectedPayment.bookings.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Assigned Cleaner</p>
                                    <p className="text-sm">
                                      {selectedPayment.bookings.cleaner_id 
                                        ? (selectedPayment.bookings.cleaners 
                                            ? (selectedPayment.bookings.cleaners as any).name || (selectedPayment.bookings.cleaners as any).full_name || `Cleaner ${selectedPayment.bookings.cleaner_id.slice(0, 8)}`
                                            : `Cleaner ${selectedPayment.bookings.cleaner_id.slice(0, 8)}`)
                                        : 'Unassigned'
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {payments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={payments.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Summary Stats */}
      {payments.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Successful</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'success').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </p>
          </div>
          <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Failed</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">
              {payments.filter(p => p.status === 'failed').length}
            </p>
          </div>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Amount</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-600">
              R{payments
                .filter(p => p.status === 'success')
                .reduce((sum, p) => sum + (p.amount || 0), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

