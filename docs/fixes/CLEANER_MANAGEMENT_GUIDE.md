# Cleaner Management Feature Guide

## Overview
The admin dashboard now includes comprehensive cleaner management functionality with the ability to add, edit, and delete cleaners.

## Features Added

### 1. **Add New Cleaner**
- Click the "Add New Cleaner" button in the Cleaners tab
- Fill in the following fields:
  - **Full Name** (required): Cleaner's full name
  - **Avatar Photo** (optional): Upload an image or provide a URL
    - **Upload Image**: Click to upload or drag and drop (PNG, JPG, WebP, GIF - max 2MB)
    - **Provide URL**: Enter a direct URL to the cleaner's profile photo
    - Preview displays automatically after selection
  - **Rating** (required): Rating between 0 and 5 (default: 5.0)
  - **Service Areas** (required): Searchable multi-select from database
    - Type to search through available service areas
    - Select multiple areas by clicking
    - Remove areas by clicking the X on selected badges
    - Shows all active service areas from Cape Town
  - **Availability** (required): JSON format with day, start time, and end time

### 2. **Edit Existing Cleaner**
- Click the pencil icon next to any cleaner in the table
- Update any of the cleaner's information
- Changes are saved immediately upon clicking "Update Cleaner"

### 3. **Delete Cleaner**
- Click the trash icon next to any cleaner in the table
- Confirm deletion in the alert dialog
- This action is permanent and cannot be undone

## Availability JSON Format

The availability field uses JSON format. Here's an example:

```json
[
  { "day": "Monday", "start": "08:00", "end": "17:00" },
  { "day": "Tuesday", "start": "08:00", "end": "17:00" },
  { "day": "Wednesday", "start": "08:00", "end": "17:00" },
  { "day": "Thursday", "start": "08:00", "end": "17:00" },
  { "day": "Friday", "start": "08:00", "end": "17:00" }
]
```

The default template is pre-filled when adding a new cleaner (Monday-Friday, 8 AM - 5 PM).

## Files Modified

1. **src/components/dashboard/admin/CleanerDialog.tsx** (ENHANCED)
   - Dialog component for adding and editing cleaners
   - Image upload functionality with preview
   - Support for both file upload and URL input
   - Automatic image optimization and storage
   - Searchable multi-select for service areas from database
   - Real-time search and filtering of service areas
   - Includes form validation and error handling
   - Provides helpful examples and placeholders

2. **src/components/dashboard/admin/AdminCleanersTable.tsx** (UPDATED)
   - Added "Add New Cleaner" button at the top
   - Added Edit and Delete action buttons for each cleaner row
   - Integrated CleanerDialog component
   - Added confirmation dialog for deletion

3. **supabase/migrations/20250115120000_create_cleaner_avatars_bucket.sql** (NEW)
   - Creates storage bucket for cleaner avatar images
   - Sets up RLS policies for secure access
   - Allows admins to upload/update/delete avatars
   - Makes avatars publicly accessible for viewing

4. **src/components/ui/multi-select.tsx** (NEW)
   - Reusable searchable multi-select component
   - Real-time search/filter functionality
   - Selected items displayed as removable badges
   - Accessible keyboard navigation
   - Used for service area selection

## User Interface

The Cleaners tab now displays:
- **Add New Cleaner** button (top right)
- **Table with columns:**
  - Cleaner (with avatar and name)
  - Rating (star icon with numerical value)
  - Service Areas (badges showing up to 3 areas)
  - Joined Date
  - Actions (Edit and Delete buttons)

## Validation

The dialog includes validation for:
- Required fields (name, rating, service areas, availability)
- Rating range (0-5)
- Service areas (at least one area must be selected)
- JSON format for availability
- Image file type (JPEG, PNG, WebP, GIF only)
- Image file size (max 2MB)

## Service Areas Feature

### Searchable Multi-Select
- **Live Search**: Type to filter through all available service areas
- **Multi-Selection**: Click to select/deselect multiple areas
- **Visual Feedback**: Selected areas shown as badges with X button to remove
- **Database-Driven**: Areas pulled from `service_areas` table (Cape Town suburbs)
- **Validation**: At least one service area must be selected
- **User-Friendly**: No need to remember exact area names or format

### How It Works
1. When the dialog opens, all active service areas are fetched from the database
2. Type in the search field to filter areas in real-time
3. Click an area to add it to the cleaner's service areas
4. Click again or use the X button to remove an area
5. Selected areas are displayed as badges above the search field

## Error Handling

- Displays toast notifications for success and error states
- Provides clear error messages for validation failures
- Handles database errors gracefully

## Permissions

The cleaner management features are only available to users with admin role. The RLS policies ensure:
- Only admins can add, edit, or delete cleaners
- Everyone can view active cleaners (for booking purposes)

## Image Upload Features

### Upload Methods
1. **File Upload** (Recommended)
   - Drag and drop or click to browse
   - Supports: PNG, JPG, WebP, GIF
   - Maximum size: 2MB
   - Images stored securely in Supabase Storage
   - Automatic cleanup of old avatars when updating

2. **URL Input**
   - Paste a direct image URL
   - Useful for external images
   - Live preview of the image

### Preview
- Real-time preview of selected/uploaded image
- Avatar preview with cleaner's initials fallback
- Remove button to clear selection

## Testing Checklist

- [ ] Add a new cleaner with valid data
- [ ] Upload an image file for cleaner avatar
- [ ] Try uploading a file larger than 2MB (should show error)
- [ ] Try uploading a non-image file (should show error)
- [ ] Use URL input method for avatar
- [ ] Edit an existing cleaner and upload a new avatar
- [ ] Verify old avatar is replaced when uploading new one
- [ ] Try to add a cleaner with invalid rating (should show error)
- [ ] Try to add a cleaner without selecting service areas (should show error)
- [ ] Search for service areas using the search field
- [ ] Select multiple service areas
- [ ] Remove a selected service area using the X button
- [ ] Verify service areas display as badges when selected
- [ ] Delete a cleaner (with confirmation)
- [ ] Verify the cleaner list updates after each operation
- [ ] Check that the avatar displays correctly in the table
- [ ] Check that service area badges display correctly in the table
- [ ] Test availability JSON parsing (valid and invalid formats)
- [ ] Test image preview functionality
- [ ] Test remove image functionality

