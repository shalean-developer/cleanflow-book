# Careers Application System

This directory contains the complete "Apply to Work at Shalean" application system.

## Overview

A fully accessible, brand-compliant application form for cleaning professionals to join the Shalean team. The system includes form validation, file uploads, email notifications, and database persistence.

## Files Structure

```
src/pages/careers/
  ├── Apply.tsx              # Main application form page
  └── README.md              # This file

src/components/careers/
  ├── SectionCard.tsx        # Reusable section wrapper with icon
  ├── FileInput.tsx          # File upload component with preview
  └── MultiSelectChips.tsx   # Multi-select chip component

supabase/migrations/
  └── 20251011120000_create_cleaner_applications.sql  # Database schema

supabase/functions/
  └── send-application-confirmation/
      └── index.ts           # Email notification edge function
```

## Features

### Form Sections

1. **Personal Details** - Name, email, phone, ID/passport, DOB, work permit
2. **Address** - Full address with transport availability
3. **Experience & Skills** - Years of experience, skills, language proficiency
4. **Availability** - Days, times, frequency, start date
5. **Preferred Working Areas** - Cape Town regions
6. **References** - Up to 2 professional references
7. **Document Uploads** - CV, ID, proof of address, optional certificates
8. **Consent & Declaration** - Background checks, T&Cs, POPIA compliance

### Validation

- **Zod schema validation** with specific rules:
  - Names: 2-60 characters
  - Email: Valid email format
  - Phone: South African format (`^\+?27\d{9}$` or `0\d{9}$`)
  - Postal code: 4 digits
  - Files: PDF/JPG/PNG, max 5MB each
  - At least 1 skill, 1 area, 1 day, 1 reference required

### File Handling

- **Storage**: Supabase Storage bucket `applications`
- **Path structure**: `applications/{application_id}/{file_type}_{timestamp}.{ext}`
- **Allowed types**: PDF, JPG, JPEG, PNG
- **Size limit**: 5MB per file
- **Features**:
  - Image preview thumbnails
  - File size display
  - Remove/replace functionality
  - Mime type validation

### Security Features

1. **Honeypot field** (`bot_trap`) - Hidden field to catch bots
2. **Rate limiting** - 5-second cooldown after submission
3. **Server-side validation** - Additional checks in Supabase
4. **RLS policies** - Row Level Security for data access
5. **Sanitization** - Input sanitization and dangerous mime type rejection

## Database Schema

### Table: `cleaner_applications`

```sql
-- Core fields
id, created_at, first_name, last_name, email, phone
id_number_or_passport, date_of_birth, has_work_permit

-- Address
address_line1, address_line2, suburb_city, postal_code, has_own_transport

-- Experience
years_experience, skills (jsonb), comfortable_with_pets, languages (jsonb)

-- Availability
available_days (jsonb), start_time, frequency, earliest_start_date

-- Areas
areas (jsonb)

-- References
ref1_name, ref1_phone, ref1_relationship
ref2_name, ref2_phone, ref2_relationship

-- Documents
cv_url, id_doc_url, proof_of_address_url, certificate_url

-- Admin
status (new|reviewing|shortlisted|rejected|hired), notes
```

### Storage Bucket: `applications`

- **Public**: No (authenticated access only)
- **File size limit**: 5MB
- **Allowed mime types**: `application/pdf`, `image/jpeg`, `image/jpg`, `image/png`

## Email Notifications

### Applicant Email (Confirmation)

- **Subject**: `Application Received - {REF_ID}`
- **From**: `Shalean Careers <bookings@shalean.co.za>`
- **Content**:
  - Confirmation message with reference ID
  - Application summary
  - Next steps timeline
  - Contact information
  - Professional HTML + plain text fallback

### Admin Email (New Application Alert)

- **Subject**: `NEW APPLICATION – {Name} ({Areas})`
- **To**: `bookings@shalean.co.za`
- **Content**:
  - Complete applicant details
  - All form responses
  - Direct links to uploaded documents
  - Formatted for easy review
  - Professional HTML template

## Accessibility

- **WCAG AA compliant** contrast ratios
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Error messages with `role="alert"`
- Focus management (ring-2 ring-[#0C53ED] ring-offset-2)
- Descriptive labels and hints

## Brand Styling

- **Primary color**: `#0C53ED` (Shalean Blue)
- **Secondary color**: `#2A869E` (Teal)
- **Heading color**: `#180D39` (Dark Purple)
- **Border radius**: `rounded-2xl` for cards, `rounded-xl` for inputs
- **Focus rings**: `ring-2 ring-[#0C53ED] ring-offset-2`
- **Shadows**: `shadow-sm` for cards
- **Chips**: `bg-[#EAF2FF]` for selected state

## Dark Mode Support

All components include dark mode variants:
- `dark:bg-[#0B1220]` - Background
- `dark:text-white/80` - Text
- `dark:border-white/10` - Borders

## Usage

### Accessing the Form

Navigate to: `/careers/apply`

### Integration in Navigation

Add a link in your navigation/footer:

```tsx
<Link to="/careers/apply">Join Our Team</Link>
```

### Admin Review Flow

1. Admin receives email with application details
2. Review documents via provided links
3. Contact references
4. Conduct background check (with consent)
5. Update status in database:
   - `new` → `reviewing` → `shortlisted` → `hired`
   - Or `new` → `reviewing` → `rejected`

## Environment Variables Required

```bash
# Supabase (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# Edge Function needs these (in Supabase dashboard):
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
```

## API Endpoints

### Submit Application

```typescript
// Client-side (automatically handled by Apply.tsx)
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase
  .from("cleaner_applications")
  .insert([applicationData])
  .select()
  .single();
```

### Upload Files

```typescript
const { error } = await supabase.storage
  .from("applications")
  .upload(filePath, file);
```

### Send Notifications

```typescript
await supabase.functions.invoke("send-application-confirmation", {
  body: { applicationId: "uuid" },
});
```

## Future Enhancements

- [ ] "Save Draft" functionality with localStorage/database
- [ ] Admin dashboard at `/admin/applications`
- [ ] Application tracking for candidates
- [ ] SMS notifications (optional)
- [ ] Video interview scheduling integration
- [ ] Bulk export for HR systems
- [ ] Analytics dashboard

## Testing Checklist

- [ ] Form validation (all fields)
- [ ] File upload (PDF, JPG, PNG)
- [ ] File size validation (>5MB rejection)
- [ ] Phone number formats (+27 and 0 prefix)
- [ ] Multi-select chips (skills, areas, days, languages)
- [ ] "Other" input fields (languages, areas)
- [ ] References (1 required, 2 optional)
- [ ] Consent checkboxes (required)
- [ ] Success state after submission
- [ ] Email delivery (applicant + admin)
- [ ] Accessibility (keyboard, screen reader)
- [ ] Dark mode appearance
- [ ] Mobile responsiveness
- [ ] Honeypot bot protection
- [ ] Rate limiting (5s cooldown)

## Support

For issues or questions:
- **Email**: bookings@shalean.co.za
- **Technical**: Check Supabase logs for edge function errors
- **Database**: Review RLS policies if access issues occur

---

**Version**: 1.0.0  
**Last Updated**: October 11, 2025  
**Maintainer**: Shalean Development Team

