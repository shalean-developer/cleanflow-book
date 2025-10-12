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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download, CheckCircle, XCircle } from "lucide-react";

interface AdminApplicationsTableProps {
  applications: Tables<'cleaner_applications'>[];
  onUpdate: () => void;
}

export function AdminApplicationsTable({ applications, onUpdate }: AdminApplicationsTableProps) {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Tables<'cleaner_applications'> | null>(null);

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('cleaner_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Application status has been updated to ${status}.`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.first_name} {application.last_name}
                  </TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{application.phone}</TableCell>
                  <TableCell>{application.years_experience} years</TableCell>
                  <TableCell>
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={application.status}
                      onValueChange={(value) => updateApplicationStatus(application.id, value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                              {application.first_name} {application.last_name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-sm">{selectedApplication.first_name} {selectedApplication.last_name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-sm">{selectedApplication.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-sm">{selectedApplication.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                    <p className="text-sm">{new Date(selectedApplication.date_of_birth).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">ID/Passport</p>
                                    <p className="text-sm">{selectedApplication.id_number_or_passport}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold mb-3">Address</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Address Line 1</p>
                                    <p className="text-sm">{selectedApplication.address_line1}</p>
                                  </div>
                                  {selectedApplication.address_line2 && (
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Address Line 2</p>
                                      <p className="text-sm">{selectedApplication.address_line2}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Suburb/City</p>
                                    <p className="text-sm">{selectedApplication.suburb_city}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Postal Code</p>
                                    <p className="text-sm">{selectedApplication.postal_code}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold mb-3">Work Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Years of Experience</p>
                                    <p className="text-sm">{selectedApplication.years_experience} years</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Earliest Start Date</p>
                                    <p className="text-sm">{new Date(selectedApplication.earliest_start_date).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Preferred Start Time</p>
                                    <p className="text-sm">{selectedApplication.start_time}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Frequency</p>
                                    <p className="text-sm capitalize">{selectedApplication.frequency}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Own Transport</p>
                                    <p className="text-sm">{selectedApplication.has_own_transport ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Work Permit</p>
                                    <p className="text-sm">{selectedApplication.has_work_permit ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Comfortable with Pets</p>
                                    <p className="text-sm">{selectedApplication.comfortable_with_pets ? 'Yes' : 'No'}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold mb-3">Skills & Areas</h3>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedApplication.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary">{skill}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Preferred Areas</p>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedApplication.areas.map((area, index) => (
                                        <Badge key={index} variant="secondary">{area}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Available Days</p>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedApplication.available_days.map((day, index) => (
                                        <Badge key={index} variant="secondary">{day}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Languages</p>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedApplication.languages.map((lang, index) => (
                                        <Badge key={index} variant="secondary">{lang}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold mb-3">References</h3>
                                <div className="space-y-3">
                                  <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm font-medium">Reference 1</p>
                                    <p className="text-sm text-gray-600">{selectedApplication.ref1_name}</p>
                                    <p className="text-sm text-gray-600">{selectedApplication.ref1_phone}</p>
                                    <p className="text-sm text-gray-600 capitalize">{selectedApplication.ref1_relationship}</p>
                                  </div>
                                  {selectedApplication.ref2_name && (
                                    <div className="p-3 bg-gray-50 rounded-md">
                                      <p className="text-sm font-medium">Reference 2</p>
                                      <p className="text-sm text-gray-600">{selectedApplication.ref2_name}</p>
                                      <p className="text-sm text-gray-600">{selectedApplication.ref2_phone}</p>
                                      <p className="text-sm text-gray-600 capitalize">{selectedApplication.ref2_relationship}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold mb-3">Documents</h3>
                                <div className="space-y-2">
                                  {selectedApplication.cv_url && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={selectedApplication.cv_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download CV
                                      </a>
                                    </Button>
                                  )}
                                  {selectedApplication.id_doc_url && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={selectedApplication.id_doc_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download ID Document
                                      </a>
                                    </Button>
                                  )}
                                  {selectedApplication.proof_of_address_url && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={selectedApplication.proof_of_address_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Proof of Address
                                      </a>
                                    </Button>
                                  )}
                                  {selectedApplication.certificate_url && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={selectedApplication.certificate_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Certificates
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  onClick={() => {
                                    updateApplicationStatus(selectedApplication.id, 'approved');
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => {
                                    updateApplicationStatus(selectedApplication.id, 'rejected');
                                  }}
                                  variant="destructive"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

