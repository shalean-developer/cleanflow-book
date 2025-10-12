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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, Save, X } from "lucide-react";

type Service = Tables<'services'>;

interface EditingService {
  id: string;
  base_price: string;
  bedroom_price: string;
  bathroom_price: string;
  service_fee_rate: string;
}

export function AdminServicesPricing() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingService | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditing({
      id: service.id,
      base_price: String(service.base_price),
      bedroom_price: String(service.bedroom_price),
      bathroom_price: String(service.bathroom_price),
      service_fee_rate: String(service.service_fee_rate * 100), // Convert to percentage
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .update({
          base_price: parseFloat(editing.base_price),
          bedroom_price: parseFloat(editing.bedroom_price),
          bathroom_price: parseFloat(editing.bathroom_price),
          service_fee_rate: parseFloat(editing.service_fee_rate) / 100, // Convert back to decimal
        })
        .eq('id', editing.id)
        .select();

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      console.log('Service updated successfully:', data);
      
      toast({
        title: "Success",
        description: "Service pricing updated successfully.",
      });
      
      setDialogOpen(false);
      setEditing(null);
      fetchServices();
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update service pricing. Please ensure you have admin permissions.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setDialogOpen(false);
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
      <div>
        <h3 className="text-lg font-semibold mb-2">Service Pricing Configuration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manage base prices, room pricing, and service fees for each cleaning service.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Base Price (R)</TableHead>
              <TableHead>Bedroom Price (R)</TableHead>
              <TableHead>Bathroom Price (R)</TableHead>
              <TableHead>Service Fee (%)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No services found
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>R {Number(service.base_price).toFixed(2)}</TableCell>
                  <TableCell>R {Number(service.bedroom_price).toFixed(2)}</TableCell>
                  <TableCell>R {Number(service.bathroom_price).toFixed(2)}</TableCell>
                  <TableCell>{(Number(service.service_fee_rate) * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service Pricing</DialogTitle>
            <DialogDescription>
              Update pricing details for this service. All prices are in ZAR.
            </DialogDescription>
          </DialogHeader>
          
          {editing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="base_price">Base Price (R)</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editing.base_price}
                  onChange={(e) => setEditing({ ...editing, base_price: e.target.value })}
                  placeholder="e.g., 350.00"
                />
              </div>

              <div>
                <Label htmlFor="bedroom_price">Price per Bedroom (R)</Label>
                <Input
                  id="bedroom_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editing.bedroom_price}
                  onChange={(e) => setEditing({ ...editing, bedroom_price: e.target.value })}
                  placeholder="e.g., 50.00"
                />
              </div>

              <div>
                <Label htmlFor="bathroom_price">Price per Bathroom (R)</Label>
                <Input
                  id="bathroom_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editing.bathroom_price}
                  onChange={(e) => setEditing({ ...editing, bathroom_price: e.target.value })}
                  placeholder="e.g., 40.00"
                />
              </div>

              <div>
                <Label htmlFor="service_fee_rate">Service Fee (%)</Label>
                <Input
                  id="service_fee_rate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={editing.service_fee_rate}
                  onChange={(e) => setEditing({ ...editing, service_fee_rate: e.target.value })}
                  placeholder="e.g., 10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is a percentage of the total booking amount (e.g., 10 for 10%)
                </p>
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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

