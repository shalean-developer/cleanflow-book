import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, Plus, Save, X, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Extra = Tables<'extras'>;

interface EditingExtra {
  id?: string;
  name: string;
  description: string;
  base_price: string;
  icon: string;
  active: boolean;
}

export function AdminExtrasPricing() {
  const { toast } = useToast();
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingExtra | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .order('name');

      if (error) throw error;
      setExtras(data || []);
    } catch (error) {
      console.error('Error fetching extras:', error);
      toast({
        title: "Error",
        description: "Failed to load extras.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (extra: Extra) => {
    setEditing({
      id: extra.id,
      name: extra.name,
      description: extra.description || '',
                  base_price: String(extra.base_price || 0),
      icon: extra.icon || '',
      active: extra.active,
    });
    setIsNew(false);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditing({
      name: '',
      description: '',
      base_price: '0',
      icon: '',
      active: true,
    });
    setIsNew(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      const extraData = {
        name: editing.name,
        description: editing.description,
        base_price: parseFloat(editing.base_price),
        icon: editing.icon,
        active: editing.active,
      };

      if (isNew) {
        const { data, error } = await supabase
          .from('extras')
          .insert(extraData)
          .select();
        
        if (error) {
          console.error('Error details:', error);
          throw error;
        }
        
        console.log('Extra created successfully:', data);
        
        toast({
          title: "Success",
          description: "New extra created successfully.",
        });
      } else {
        const { data, error } = await supabase
          .from('extras')
          .update(extraData)
          .eq('id', editing.id!)
          .select();

        if (error) {
          console.error('Error details:', error);
          throw error;
        }

        console.log('Extra updated successfully:', data);

        toast({
          title: "Success",
          description: "Extra updated successfully.",
        });
      }
      
      setDialogOpen(false);
      setEditing(null);
      setIsNew(false);
      fetchExtras();
    } catch (error: any) {
      console.error('Error saving extra:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save extra. Please ensure you have admin permissions.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this extra? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('extras')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Extra deleted successfully.",
      });
      
      fetchExtras();
    } catch (error: any) {
      console.error('Error deleting extra:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete extra. It may be in use or you may lack permissions.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setDialogOpen(false);
    setIsNew(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">Extras Pricing Configuration</h3>
          <p className="text-sm text-gray-600 mb-4">
            Manage add-on services and their pricing.
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Extra
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price (R)</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No extras found
                </TableCell>
              </TableRow>
            ) : (
              extras.map((extra) => (
                <TableRow key={extra.id}>
                  <TableCell className="font-medium">{extra.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{extra.description}</TableCell>
                  <TableCell>R {Number(extra.base_price || 0).toFixed(2)}</TableCell>
                  <TableCell>{extra.icon || '-'}</TableCell>
                  <TableCell>
                    {extra.active ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(extra)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(extra.id)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Create New Extra' : 'Edit Extra'}</DialogTitle>
            <DialogDescription>
              {isNew ? 'Add a new extra service option.' : 'Update the details of this extra service.'}
            </DialogDescription>
          </DialogHeader>
          
          {editing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g., Oven Cleaning"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Brief description of the service"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="base_price">Price (R) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editing.base_price}
                  onChange={(e) => setEditing({ ...editing, base_price: e.target.value })}
                  placeholder="e.g., 150.00"
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                <Input
                  id="icon"
                  value={editing.icon}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  placeholder="e.g., Sparkles, Droplets, Wind"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a Lucide React icon name (optional)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={editing.active}
                  onCheckedChange={(checked) => setEditing({ ...editing, active: checked })}
                />
                <Label htmlFor="active">Active (visible to customers)</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {isNew ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

