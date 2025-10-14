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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Pencil, Trash2, Plus } from "lucide-react";
import { CleanerDialog } from "./CleanerDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/ui/pagination";

interface AdminCleanersTableProps {
  cleaners: Tables<'cleaners'>[];
  onUpdate: () => void;
}

export function AdminCleanersTable({ cleaners, onUpdate }: AdminCleanersTableProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState<Tables<'cleaners'> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cleanerToDelete, setCleanerToDelete] = useState<Tables<'cleaners'> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(cleaners.length / itemsPerPage);
  const paginatedCleaners = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return cleaners.slice(startIndex, endIndex);
  }, [cleaners, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleAddCleaner = () => {
    setSelectedCleaner(null);
    setDialogOpen(true);
  };

  const handleEditCleaner = (cleaner: Tables<'cleaners'>) => {
    setSelectedCleaner(cleaner);
    setDialogOpen(true);
  };

  const handleDeleteClick = (cleaner: Tables<'cleaners'>) => {
    setCleanerToDelete(cleaner);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cleanerToDelete) return;

    try {
      const { error } = await supabase
        .from("cleaners")
        .delete()
        .eq("id", cleanerToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cleaner deleted successfully.",
      });

      onUpdate();
    } catch (error: any) {
      console.error("Error deleting cleaner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete cleaner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCleanerToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddCleaner} className="text-xs sm:text-sm h-8 sm:h-10">
          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Add New Cleaner</span>
          <span className="sm:hidden">Add Cleaner</span>
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Cleaner</TableHead>
              <TableHead className="whitespace-nowrap">Rating</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">Service Areas</TableHead>
              <TableHead className="hidden sm:table-cell whitespace-nowrap">Joined</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCleaners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No cleaners found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCleaners.map((cleaner) => (
                <TableRow key={cleaner.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={cleaner.avatar_url || undefined} />
                        <AvatarFallback className="text-xs sm:text-sm">
                          {cleaner.name ? cleaner.name.split(' ').map(n => n[0]).join('') : 'N/A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{cleaner.name || 'Unnamed Cleaner'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-xs sm:text-sm">{cleaner.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(cleaner.service_areas || []).slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {(cleaner.service_areas || []).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{(cleaner.service_areas || []).length - 3} more
                        </Badge>
                      )}
                      {(cleaner.service_areas || []).length === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          No areas
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                    {cleaner.created_at ? new Date(cleaner.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCleaner(cleaner)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(cleaner)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {cleaners.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={cleaners.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      <CleanerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cleaner={selectedCleaner}
        onSuccess={onUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {cleanerToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

