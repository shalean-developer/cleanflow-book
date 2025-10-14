import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show (responsive to screen size)
  const getPageNumbers = (isMobile: boolean = false) => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      const threshold = isMobile ? 2 : 3;
      
      if (currentPage > threshold) {
        pages.push('...');
      }

      // Show pages around current page
      const range = isMobile ? 0 : 1;
      const start = Math.max(2, currentPage - range);
      const end = Math.min(totalPages - 1, currentPage + range);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - (threshold - 1)) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-center sm:justify-between px-2 py-4">
        <div className="text-xs sm:text-sm text-gray-700 text-center">
          Showing <span className="font-medium">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 px-2 py-4">
      {/* Items info and per-page selector */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700 w-full sm:w-auto justify-between sm:justify-start">
        <div className="text-center sm:text-left whitespace-nowrap">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span>
        </div>
        
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
            >
              <SelectTrigger className="w-[65px] sm:w-[70px] h-7 sm:h-8 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 sm:h-9 px-2 sm:px-3"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>

        {/* Desktop page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers(false).map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="px-2">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="min-w-[40px] h-9"
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Mobile page numbers - simplified */}
        <div className="flex sm:hidden items-center gap-1">
          {getPageNumbers(true).map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="px-1">
                  <MoreHorizontal className="h-3 w-3 text-gray-400" />
                </div>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="min-w-[32px] h-8 px-2 text-xs"
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 sm:h-9 px-2 sm:px-3"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}
