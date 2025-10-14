import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { AvailabilitySelector, TimeSlot } from "@/components/ui/availability-selector";
import { Loader2, Upload, X } from "lucide-react";

interface CleanerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cleaner?: Tables<'cleaners'> | null;
  onSuccess: () => void;
}

// Remove this interface since we're using TimeSlot from availability-selector

export function CleanerDialog({ open, onOpenChange, cleaner, onSuccess }: CleanerDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [serviceAreaOptions, setServiceAreaOptions] = useState<Option[]>([]);
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    avatar_url: "",
    rating: "5.0",
  });

  useEffect(() => {
    // Fetch service areas from database
    const fetchServiceAreas = async () => {
      try {
        const { data, error } = await supabase
          .from('service_areas')
          .select('id, name')
          .eq('active', true)
          .order('name');

        if (error) {
          console.error('Supabase error fetching service areas:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn('No service areas found in database');
          toast({
            title: "No Service Areas",
            description: "No service areas found. Please contact administrator.",
            variant: "destructive",
          });
          return;
        }

        const options: Option[] = data.map(area => ({
          value: area.name,
          label: area.name,
        }));

        setServiceAreaOptions(options);
        console.log(`Loaded ${options.length} service areas`);
      } catch (error: any) {
        console.error('Error fetching service areas:', error);
        toast({
          title: "Error Loading Service Areas",
          description: error.message || "Failed to load service areas. Please check the database migration.",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchServiceAreas();
    }
  }, [open, toast]);

  useEffect(() => {
    if (cleaner) {
      // Parse availability from JSONB to TimeSlot array
      let availabilitySlots: TimeSlot[] = [];
      if (cleaner.availability) {
        try {
          const avail = cleaner.availability as any;
          if (Array.isArray(avail)) {
            availabilitySlots = avail.map((slot: any) => ({
              day: slot.day || "",
              start: slot.start || "",
              end: slot.end || "",
            }));
          }
        } catch (e) {
          console.error('Error parsing availability:', e);
          availabilitySlots = [];
        }
      }

      setFormData({
        name: cleaner.name || "",
        avatar_url: cleaner.avatar_url || "",
        rating: cleaner.rating?.toString() || "5.0",
      });
      setSelectedServiceAreas(Array.isArray(cleaner.service_areas) ? cleaner.service_areas : []);
      setAvailabilitySlots(availabilitySlots);
      setPreviewUrl(cleaner.avatar_url || "");
    } else {
      // Default availability template for new cleaners
      const defaultAvailability = [
        { day: "Monday", start: "08:00", end: "17:00" },
        { day: "Tuesday", start: "08:00", end: "17:00" },
        { day: "Wednesday", start: "08:00", end: "17:00" },
        { day: "Thursday", start: "08:00", end: "17:00" },
        { day: "Friday", start: "08:00", end: "17:00" },
      ];
      
      setFormData({
        name: "",
        avatar_url: "",
        rating: "5.0",
      });
      setSelectedServiceAreas([]);
      setAvailabilitySlots(defaultAvailability);
      setPreviewUrl("");
    }
    setSelectedFile(null);
  }, [cleaner, open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, WebP, or GIF).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData({ ...formData, avatar_url: "" });
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return formData.avatar_url || null;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Delete old avatar if updating and it's in our bucket
      if (cleaner?.avatar_url && cleaner.avatar_url.includes('cleaner-avatars')) {
        try {
          const oldPath = cleaner.avatar_url ? cleaner.avatar_url.split('/').pop() : null;
          if (oldPath) {
            await supabase.storage
              .from('cleaner-avatars')
              .remove([oldPath]);
          }
        } catch (error) {
          console.warn('Could not delete old avatar:', error);
        }
      }

      // Upload new image
      const { data, error } = await supabase.storage
        .from('cleaner-avatars')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cleaner-avatars')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if selected
      let avatarUrl = formData.avatar_url;
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        avatarUrl = uploadedUrl;
      }

      // Validate availability slots
      if (availabilitySlots.length === 0) {
        toast({
          title: "Availability Required",
          description: "Please add at least one time slot for availability.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Validate service areas
      if (selectedServiceAreas.length === 0) {
        toast({
          title: "Service Areas Required",
          description: "Please select at least one service area.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Validate rating
      const rating = parseFloat(formData.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        toast({
          title: "Invalid Rating",
          description: "Rating must be between 0 and 5.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const cleanerData = {
        name: formData.name.trim(),
        avatar_url: avatarUrl?.trim() || null,
        rating: rating,
        service_areas: selectedServiceAreas,
        availability: availabilitySlots,
      };

      if (cleaner) {
        // Update existing cleaner
        const { error } = await supabase
          .from("cleaners")
          .update(cleanerData)
          .eq("id", cleaner.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Cleaner updated successfully.",
        });
      } else {
        // Create new cleaner
        const { error } = await supabase
          .from("cleaners")
          .insert([cleanerData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Cleaner added successfully.",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving cleaner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save cleaner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cleaner ? "Edit Cleaner" : "Add New Cleaner"}</DialogTitle>
          <DialogDescription>
            {cleaner
              ? "Update the cleaner's information below."
              : "Fill in the details to add a new cleaner to your team."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label>Avatar Photo (optional)</Label>
            
            {/* Preview */}
            {previewUrl && (
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewUrl} />
                  <AvatarFallback>
                    {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="url">Provide URL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-2">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="avatar-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP or GIF (MAX. 2MB)</p>
                    </div>
                    <Input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                {selectedFile && (
                  <p className="text-sm text-green-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="url" className="space-y-2">
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => {
                    setFormData({ ...formData, avatar_url: e.target.value });
                    setPreviewUrl(e.target.value);
                    setSelectedFile(null);
                  }}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500">
                  Provide a direct URL to the cleaner's profile photo
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating *</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              required
              placeholder="5.0"
            />
            <p className="text-xs text-gray-500">Rating between 0 and 5</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_areas">Service Areas *</Label>
            <MultiSelect
              options={serviceAreaOptions}
              selected={selectedServiceAreas}
              onChange={setSelectedServiceAreas}
              placeholder="Search and select service areas..."
              disabled={loading || uploading}
            />
            <p className="text-xs text-gray-500">
              Select the areas where the cleaner operates. Type to search.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability *</Label>
            <AvailabilitySelector
              value={availabilitySlots}
              onChange={setAvailabilitySlots}
            />
            <p className="text-xs text-gray-500">
              Add time slots when the cleaner is available to work. Use the quick presets or add custom slots.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? "Uploading..." : cleaner ? "Update Cleaner" : "Add Cleaner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

