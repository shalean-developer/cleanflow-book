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
        <Button onClick={handleAddCleaner}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Cleaner
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cleaner</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Service Areas</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cleaners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No cleaners found
                </TableCell>
              </TableRow>
            ) : (
              cleaners.map((cleaner) => (
                <TableRow key={cleaner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={cleaner.avatar_url || undefined} />
                        <AvatarFallback>
                          {cleaner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{cleaner.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{cleaner.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cleaner.service_areas.slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {cleaner.service_areas.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{cleaner.service_areas.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {cleaner.created_at ? new Date(cleaner.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCleaner(cleaner)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(cleaner)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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

