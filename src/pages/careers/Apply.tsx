import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  Map,
  Users,
  Upload as UploadIcon,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/careers/SectionCard";
import { FileInput } from "@/components/careers/FileInput";
import { MultiSelectChips } from "@/components/careers/MultiSelectChips";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Form validation schema
const applicationSchema = z.object({
  // Personal Details
  first_name: z.string().min(2, "First name must be at least 2 characters").max(60),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(\+?27|0)\d{9}$/, "Invalid South African phone number"),
  id_number_or_passport: z.string().min(6).max(20),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  has_work_permit: z.boolean(),

  // Address
  address_line1: z.string().min(3, "Address is required"),
  address_line2: z.string().optional(),
  suburb_city: z.string().min(2, "Suburb/City is required"),
  postal_code: z.string().regex(/^\d{4}$/, "Postal code must be 4 digits"),
  has_own_transport: z.boolean(),

  // Experience & Skills
  years_experience: z.number().min(0).max(30),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  comfortable_with_pets: z.boolean(),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  other_language: z.string().optional(),

  // Availability
  available_days: z.array(z.string()).min(1, "Select at least one day"),
  start_time: z.string().min(1, "Start time is required"),
  frequency: z.string().min(1, "Frequency is required"),
  earliest_start_date: z.string().min(1, "Start date is required"),

  // Preferred Working Areas
  areas: z.array(z.string()).min(1, "Select at least one area"),
  other_area: z.string().optional(),

  // References
  ref1_name: z.string().min(2, "Reference name is required"),
  ref1_phone: z.string().regex(/^(\+?27|0)\d{9}$/, "Invalid phone number"),
  ref1_relationship: z.string().min(2, "Relationship is required"),
  ref2_name: z.string().optional(),
  ref2_phone: z.string().optional(),
  ref2_relationship: z.string().optional(),

  // Files
  cv_file: z.any().refine((file) => file instanceof File, "CV is required"),
  id_doc_file: z.any().refine((file) => file instanceof File, "ID document is required"),
  proof_of_address_file: z.any().refine((file) => file instanceof File, "Proof of address is required"),
  certificate_file: z.any().optional(),

  // Consent
  consent_background_check: z.boolean().refine((val) => val === true, "You must consent to background checks"),
  consent_terms: z.boolean().refine((val) => val === true, "You must accept the terms"),

  // Honeypot
  bot_trap: z.string().max(0).optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const SKILLS_OPTIONS = [
  "Standard Cleaning",
  "Deep Cleaning",
  "Move In/Out",
  "Airbnb",
  "Windows",
  "Ironing",
  "Laundry",
  "Eco-friendly",
];

const LANGUAGES_OPTIONS = ["English", "Afrikaans", "isiXhosa", "Shona", "Other"];

const DAYS_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AREAS_OPTIONS = [
  "City Bowl",
  "Southern Suburbs",
  "Northern Suburbs",
  "Table View",
  "Parklands",
  "Century City",
  "Claremont",
  "Wynberg",
  "Muizenberg",
  "Fish Hoek",
  "Rondebosch",
  "Retreat",
  "Other",
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 13; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 13) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

export default function Apply() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(true);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [idDocFile, setIdDocFile] = useState<File | null>(null);
  const [proofOfAddressFile, setProofOfAddressFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      has_work_permit: false,
      has_own_transport: false,
      comfortable_with_pets: false,
      years_experience: 0,
      consent_background_check: false,
      consent_terms: false,
      bot_trap: "",
    },
  });

  // Sync multi-select states with form
  React.useEffect(() => {
    setValue("skills", skills);
  }, [skills, setValue]);

  React.useEffect(() => {
    setValue("languages", languages);
  }, [languages, setValue]);

  React.useEffect(() => {
    setValue("available_days", availableDays);
  }, [availableDays, setValue]);

  React.useEffect(() => {
    setValue("areas", areas);
  }, [areas, setValue]);

  React.useEffect(() => {
    setValue("cv_file", cvFile);
  }, [cvFile, setValue]);

  React.useEffect(() => {
    setValue("id_doc_file", idDocFile);
  }, [idDocFile, setValue]);

  React.useEffect(() => {
    setValue("proof_of_address_file", proofOfAddressFile);
  }, [proofOfAddressFile, setValue]);

  React.useEffect(() => {
    setValue("certificate_file", certificateFile);
  }, [certificateFile, setValue]);

  const uploadFile = async (file: File, applicationId: string, fileType: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${fileType}_${Date.now()}.${fileExt}`;
    const filePath = `${applicationId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("applications")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("applications").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmit = async (data: ApplicationFormData) => {
    // Check honeypot
    if (data.bot_trap) {
      toast.error("Invalid submission detected");
      return;
    }

    if (!canSubmit) {
      toast.error("Please wait before submitting again");
      return;
    }

    setIsSubmitting(true);
    setCanSubmit(false);

    // Rate limit: disable for 5 seconds
    setTimeout(() => setCanSubmit(true), 5000);

    try {
      // Validate files
      const files = [
        { file: cvFile, name: "CV" },
        { file: idDocFile, name: "ID document" },
        { file: proofOfAddressFile, name: "Proof of address" },
      ];

      for (const { file, name } of files) {
        if (!file) throw new Error(`${name} is required`);
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${name} must be less than 5MB`);
        }
        const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`${name} must be PDF, JPG, or PNG`);
        }
      }

      if (certificateFile && certificateFile.size > 5 * 1024 * 1024) {
        throw new Error("Certificate must be less than 5MB");
      }

      // Create initial application record
      const { data: application, error: insertError } = await supabase
        .from("cleaner_applications")
        .insert([
          {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            id_number_or_passport: data.id_number_or_passport,
            date_of_birth: data.date_of_birth,
            has_work_permit: data.has_work_permit,
            address_line1: data.address_line1,
            address_line2: data.address_line2 || null,
            suburb_city: data.suburb_city,
            postal_code: data.postal_code,
            has_own_transport: data.has_own_transport,
            years_experience: data.years_experience,
            skills: data.skills,
            comfortable_with_pets: data.comfortable_with_pets,
            languages: data.other_language && data.languages.includes("Other")
              ? [...data.languages.filter(l => l !== "Other"), data.other_language]
              : data.languages,
            available_days: data.available_days,
            start_time: data.start_time,
            frequency: data.frequency,
            earliest_start_date: data.earliest_start_date,
            areas: data.other_area && data.areas.includes("Other")
              ? [...data.areas.filter(a => a !== "Other"), data.other_area]
              : data.areas,
            ref1_name: data.ref1_name,
            ref1_phone: data.ref1_phone,
            ref1_relationship: data.ref1_relationship,
            ref2_name: data.ref2_name || null,
            ref2_phone: data.ref2_phone || null,
            ref2_relationship: data.ref2_relationship || null,
            cv_url: "",
            id_doc_url: "",
            proof_of_address_url: "",
            certificate_url: null,
            status: "new",
          },
        ])
        .select()
        .single();

      if (insertError || !application) throw insertError || new Error("Failed to create application");

      // Upload files
      const [cvUrl, idDocUrl, proofUrl, certUrl] = await Promise.all([
        uploadFile(cvFile!, application.id, "cv"),
        uploadFile(idDocFile!, application.id, "id_document"),
        uploadFile(proofOfAddressFile!, application.id, "proof_of_address"),
        certificateFile ? uploadFile(certificateFile, application.id, "certificate") : Promise.resolve(null),
      ]);

      // Update application with file URLs
      const { error: updateError } = await supabase
        .from("cleaner_applications")
        .update({
          cv_url: cvUrl,
          id_doc_url: idDocUrl,
          proof_of_address_url: proofUrl,
          certificate_url: certUrl,
        })
        .eq("id", application.id);

      if (updateError) throw updateError;

      // Send notification emails
      try {
        await supabase.functions.invoke("send-application-confirmation", {
          body: { applicationId: application.id },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the entire submission if email fails
      }

      setApplicationId(application.id);
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Application error:", error);
      toast.error(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EAF2FF] to-white dark:from-[#0B1220] dark:to-[#0B1220] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#180D39] dark:text-white mb-4">
              Application Received!
            </h1>
            <p className="text-lg text-gray-600 dark:text-white/70 mb-6">
              Thank you for applying to work with Shalean. We've received your application and will review it shortly.
            </p>
            <div className="bg-[#EAF2FF] dark:bg-[#0C53ED]/10 rounded-xl p-4 mb-8">
              <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                Application Reference ID
              </p>
              <p className="text-lg font-mono font-semibold text-[#0C53ED] mt-1">
                {applicationId.substring(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="text-left bg-gray-50 dark:bg-white/5 rounded-xl p-6 mb-8 space-y-3">
              <h3 className="font-semibold text-[#180D39] dark:text-white mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-white/70">
                <p>✓ You'll receive a confirmation email at the address you provided</p>
                <p>✓ Our team will review your application within 3-5 business days</p>
                <p>✓ We'll conduct reference checks for shortlisted candidates</p>
                <p>✓ Selected applicants will be invited for an interview</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="bg-[#0C53ED] hover:bg-[#0C53ED]/90"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => navigate("/careers")}
                variant="outline"
                size="lg"
                className="border-[#0C53ED] text-[#0C53ED] hover:bg-[#EAF2FF]"
              >
                View More Opportunities
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-white/60 mt-8">
              Questions? Contact us at{" "}
              <a href="mailto:bookings@shalean.co.za" className="text-[#0C53ED] hover:underline">
                bookings@shalean.co.za
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF2FF] to-white dark:from-[#0B1220] dark:to-[#0B1220] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#180D39] dark:text-white mb-4">
            Apply to Work at Shalean
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#0C53ED] to-[#2A869E] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
            Join our team of professional cleaners and become part of Cape Town's leading cleaning service.
            We offer competitive rates, flexible schedules, and ongoing training opportunities.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot field */}
              <input
                type="text"
                {...register("bot_trap")}
                style={{ position: "absolute", left: "-9999px" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Personal Details */}
              <SectionCard title="Personal Details" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">
                      First Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      {...register("first_name")}
                      className={`rounded-xl ${errors.first_name ? "border-rose-500" : ""}`}
                      placeholder="John"
                    />
                    {errors.first_name && (
                      <p className="text-sm text-rose-500 mt-1">{errors.first_name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="last_name">
                      Last Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      {...register("last_name")}
                      className={`rounded-xl ${errors.last_name ? "border-rose-500" : ""}`}
                      placeholder="Doe"
                    />
                    {errors.last_name && (
                      <p className="text-sm text-rose-500 mt-1">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">
                      Email Address <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={`rounded-xl ${errors.email ? "border-rose-500" : ""}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-rose-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      Phone Number <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className={`rounded-xl ${errors.phone ? "border-rose-500" : ""}`}
                      placeholder="+27123456789"
                    />
                    {errors.phone && (
                      <p className="text-sm text-rose-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id_number_or_passport">
                      ID Number or Passport <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="id_number_or_passport"
                      {...register("id_number_or_passport")}
                      className={`rounded-xl ${errors.id_number_or_passport ? "border-rose-500" : ""}`}
                      placeholder="ID or Passport number"
                    />
                    {errors.id_number_or_passport && (
                      <p className="text-sm text-rose-500 mt-1">{errors.id_number_or_passport.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">
                      Date of Birth <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      {...register("date_of_birth")}
                      className={`rounded-xl ${errors.date_of_birth ? "border-rose-500" : ""}`}
                    />
                    {errors.date_of_birth && (
                      <p className="text-sm text-rose-500 mt-1">{errors.date_of_birth.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>
                    Work Permit Status <span className="text-rose-500">*</span>
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="has_work_permit"
                      {...register("has_work_permit")}
                      onCheckedChange={(checked) => setValue("has_work_permit", checked as boolean)}
                    />
                    <label
                      htmlFor="has_work_permit"
                      className="text-sm font-medium text-gray-700 dark:text-white/80 cursor-pointer"
                    >
                      I have a valid work permit (if not a South African citizen)
                    </label>
                  </div>
                </div>
              </SectionCard>

              {/* Address */}
              <SectionCard title="Address" icon={MapPin}>
                <div>
                  <Label htmlFor="address_line1">
                    Address Line 1 <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="address_line1"
                    {...register("address_line1")}
                    className={`rounded-xl ${errors.address_line1 ? "border-rose-500" : ""}`}
                    placeholder="Street address"
                  />
                  {errors.address_line1 && (
                    <p className="text-sm text-rose-500 mt-1">{errors.address_line1.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input
                    id="address_line2"
                    {...register("address_line2")}
                    className="rounded-xl"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="suburb_city">
                      Suburb/City <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="suburb_city"
                      {...register("suburb_city")}
                      className={`rounded-xl ${errors.suburb_city ? "border-rose-500" : ""}`}
                      placeholder="Cape Town"
                    />
                    {errors.suburb_city && (
                      <p className="text-sm text-rose-500 mt-1">{errors.suburb_city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postal_code">
                      Postal Code <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="postal_code"
                      {...register("postal_code")}
                      className={`rounded-xl ${errors.postal_code ? "border-rose-500" : ""}`}
                      placeholder="8001"
                    />
                    {errors.postal_code && (
                      <p className="text-sm text-rose-500 mt-1">{errors.postal_code.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>
                    Do you have your own transport? <span className="text-rose-500">*</span>
                  </Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("has_own_transport", value === "true")}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="transport_yes" />
                      <Label htmlFor="transport_yes" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="transport_no" />
                      <Label htmlFor="transport_no" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </SectionCard>

              {/* Experience & Skills */}
              <SectionCard title="Experience & Skills" icon={Briefcase}>
                <div>
                  <Label htmlFor="years_experience">
                    Years of Cleaning Experience <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="years_experience"
                    type="number"
                    min="0"
                    max="30"
                    {...register("years_experience", { valueAsNumber: true })}
                    className={`rounded-xl ${errors.years_experience ? "border-rose-500" : ""}`}
                    placeholder="e.g., 3"
                  />
                  {errors.years_experience && (
                    <p className="text-sm text-rose-500 mt-1">{errors.years_experience.message}</p>
                  )}
                </div>

                <MultiSelectChips
                  label="Cleaning Skills"
                  options={SKILLS_OPTIONS}
                  selected={skills}
                  onChange={setSkills}
                  error={errors.skills?.message}
                  required
                  description="Select all that apply"
                />

                <div>
                  <Label>
                    Are you comfortable with pets? <span className="text-rose-500">*</span>
                  </Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("comfortable_with_pets", value === "true")}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="pets_yes" />
                      <Label htmlFor="pets_yes" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="pets_no" />
                      <Label htmlFor="pets_no" className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <MultiSelectChips
                  label="Languages"
                  options={LANGUAGES_OPTIONS}
                  selected={languages}
                  onChange={setLanguages}
                  error={errors.languages?.message}
                  required
                  description="Select all languages you speak"
                />

                {languages.includes("Other") && (
                  <div>
                    <Label htmlFor="other_language">Specify Other Language</Label>
                    <Input
                      id="other_language"
                      {...register("other_language")}
                      className="rounded-xl"
                      placeholder="e.g., isiZulu"
                    />
                  </div>
                )}
              </SectionCard>

              {/* Availability */}
              <SectionCard title="Availability" icon={Calendar}>
                <div>
                  <Label className="mb-2 block">
                    Available Days <span className="text-rose-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {DAYS_OPTIONS.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day_${day}`}
                          checked={availableDays.includes(day)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAvailableDays([...availableDays, day]);
                            } else {
                              setAvailableDays(availableDays.filter((d) => d !== day));
                            }
                          }}
                        />
                        <label
                          htmlFor={`day_${day}`}
                          className="text-sm font-medium text-gray-700 dark:text-white/80 cursor-pointer"
                        >
                          {day.substring(0, 3)}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.available_days && (
                    <p className="text-sm text-rose-500 mt-1">{errors.available_days.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">
                      Preferred Start Time <span className="text-rose-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue("start_time", value)}>
                      <SelectTrigger className={`rounded-xl ${errors.start_time ? "border-rose-500" : ""}`}>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeSlots().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.start_time && (
                      <p className="text-sm text-rose-500 mt-1">{errors.start_time.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="frequency">
                      Work Frequency <span className="text-rose-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue("frequency", value)}>
                      <SelectTrigger className={`rounded-xl ${errors.frequency ? "border-rose-500" : ""}`}>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Ad-hoc">Ad-hoc</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.frequency && (
                      <p className="text-sm text-rose-500 mt-1">{errors.frequency.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="earliest_start_date">
                    Earliest Start Date <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="earliest_start_date"
                    type="date"
                    {...register("earliest_start_date")}
                    className={`rounded-xl ${errors.earliest_start_date ? "border-rose-500" : ""}`}
                  />
                  {errors.earliest_start_date && (
                    <p className="text-sm text-rose-500 mt-1">{errors.earliest_start_date.message}</p>
                  )}
                </div>
              </SectionCard>

              {/* Preferred Working Areas */}
              <SectionCard title="Preferred Working Areas" icon={Map}>
                <MultiSelectChips
                  label="Areas"
                  options={AREAS_OPTIONS}
                  selected={areas}
                  onChange={setAreas}
                  error={errors.areas?.message}
                  required
                  description="Select all areas where you're willing to work"
                />

                {areas.includes("Other") && (
                  <div>
                    <Label htmlFor="other_area">Specify Other Area</Label>
                    <Input
                      id="other_area"
                      {...register("other_area")}
                      className="rounded-xl"
                      placeholder="e.g., Bellville"
                    />
                  </div>
                )}
              </SectionCard>

              {/* References */}
              <SectionCard title="References" icon={Users}>
                <p className="text-sm text-gray-600 dark:text-white/70 -mt-2">
                  Provide at least one reference. A second reference is optional but recommended.
                </p>

                <div className="space-y-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <h3 className="font-semibold text-[#180D39] dark:text-white">Reference 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ref1_name">
                        Name <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="ref1_name"
                        {...register("ref1_name")}
                        className={`rounded-xl ${errors.ref1_name ? "border-rose-500" : ""}`}
                        placeholder="Reference name"
                      />
                      {errors.ref1_name && (
                        <p className="text-sm text-rose-500 mt-1">{errors.ref1_name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ref1_phone">
                        Phone <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="ref1_phone"
                        type="tel"
                        {...register("ref1_phone")}
                        className={`rounded-xl ${errors.ref1_phone ? "border-rose-500" : ""}`}
                        placeholder="+27123456789"
                      />
                      {errors.ref1_phone && (
                        <p className="text-sm text-rose-500 mt-1">{errors.ref1_phone.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ref1_relationship">
                      Relationship <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="ref1_relationship"
                      {...register("ref1_relationship")}
                      className={`rounded-xl ${errors.ref1_relationship ? "border-rose-500" : ""}`}
                      placeholder="e.g., Previous employer, supervisor"
                    />
                    {errors.ref1_relationship && (
                      <p className="text-sm text-rose-500 mt-1">{errors.ref1_relationship.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <h3 className="font-semibold text-[#180D39] dark:text-white">
                    Reference 2 <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ref2_name">Name</Label>
                      <Input
                        id="ref2_name"
                        {...register("ref2_name")}
                        className="rounded-xl"
                        placeholder="Reference name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ref2_phone">Phone</Label>
                      <Input
                        id="ref2_phone"
                        type="tel"
                        {...register("ref2_phone")}
                        className="rounded-xl"
                        placeholder="+27123456789"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ref2_relationship">Relationship</Label>
                    <Input
                      id="ref2_relationship"
                      {...register("ref2_relationship")}
                      className="rounded-xl"
                      placeholder="e.g., Previous client, colleague"
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Uploads */}
              <SectionCard title="Required Documents" icon={UploadIcon}>
                <p className="text-sm text-gray-600 dark:text-white/70 -mt-2">
                  Please upload clear copies of the following documents (PDF, JPG, or PNG, max 5MB each):
                </p>

                <FileInput
                  label="CV / Resume"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  value={cvFile}
                  onChange={setCvFile}
                  error={errors.cv_file?.message as string}
                  description="PDF format preferred"
                />

                <FileInput
                  label="ID Document / Passport"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  value={idDocFile}
                  onChange={setIdDocFile}
                  error={errors.id_doc_file?.message as string}
                  description="A clear, readable copy of your ID or passport"
                />

                <FileInput
                  label="Proof of Address"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  value={proofOfAddressFile}
                  onChange={setProofOfAddressFile}
                  error={errors.proof_of_address_file?.message as string}
                  description="Recent utility bill, bank statement, or lease agreement (less than 3 months old)"
                />

                <FileInput
                  label="Certificate (Optional)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  value={certificateFile}
                  onChange={setCertificateFile}
                  description="Any relevant training or certification"
                />
              </SectionCard>

              {/* Consent & Submit */}
              <SectionCard title="Consent & Declaration" icon={ShieldCheck}>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent_background_check"
                      {...register("consent_background_check")}
                      onCheckedChange={(checked) => setValue("consent_background_check", checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="consent_background_check"
                        className="text-sm font-medium text-gray-700 dark:text-white/80 cursor-pointer"
                      >
                        I consent to background and reference checks{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                        We conduct verification checks on all applicants to ensure the safety and security of our clients.
                      </p>
                    </div>
                  </div>
                  {errors.consent_background_check && (
                    <p className="text-sm text-rose-500">{errors.consent_background_check.message}</p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent_terms"
                      {...register("consent_terms")}
                      onCheckedChange={(checked) => setValue("consent_terms", checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="consent_terms"
                        className="text-sm font-medium text-gray-700 dark:text-white/80 cursor-pointer"
                      >
                        I accept the{" "}
                        <a href="/terms" className="text-[#0C53ED] hover:underline" target="_blank" rel="noopener noreferrer">
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-[#0C53ED] hover:underline" target="_blank" rel="noopener noreferrer">
                          Privacy Policy (POPIA)
                        </a>{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                        Your personal information will be processed in accordance with POPIA regulations.
                      </p>
                    </div>
                  </div>
                  {errors.consent_terms && (
                    <p className="text-sm text-rose-500">{errors.consent_terms.message}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !canSubmit}
                    className="flex-1 bg-[#0C53ED] hover:bg-[#0C53ED]/90 text-white font-semibold rounded-xl h-12 focus:ring-2 focus:ring-[#0C53ED] focus:ring-offset-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-gray-500 dark:text-white/60 mt-4">
                  By submitting this application, you confirm that all information provided is accurate and complete.
                </p>
              </SectionCard>
            </form>
          </div>

          {/* Sticky Sidebar - Tips */}
          <div className="hidden lg:block lg:w-80">
            <div className="sticky top-8 bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#180D39] dark:text-white mb-4">
                Application Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-white/70">
                <li className="flex gap-2">
                  <span className="text-[#0C53ED] font-bold">•</span>
                  <span>Fill out all required fields completely and accurately</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0C53ED] font-bold">•</span>
                  <span>Ensure your documents are clear and readable</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0C53ED] font-bold">•</span>
                  <span>Provide references who can speak to your work ethic</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0C53ED] font-bold">•</span>
                  <span>Be honest about your experience and availability</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0C53ED] font-bold">•</span>
                  <span>Double-check your contact information</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <h4 className="font-semibold text-[#180D39] dark:text-white mb-3">
                  Need Help?
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-white/70">
                    <strong>Email:</strong>
                    <br />
                    <a href="mailto:bookings@shalean.co.za" className="text-[#0C53ED] hover:underline">
                      bookings@shalean.co.za
                    </a>
                  </p>
                  <p className="text-gray-600 dark:text-white/70">
                    <strong>Office Hours:</strong>
                    <br />
                    Mon-Fri: 8AM-5PM
                    <br />
                    Sat: 9AM-1PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

