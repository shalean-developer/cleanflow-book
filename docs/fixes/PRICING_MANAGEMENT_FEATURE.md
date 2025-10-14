# Pricing Management Feature

## Overview
A comprehensive admin interface for managing all pricing aspects of the CleanFlow booking system. This feature allows administrators to configure service prices, extras, and view discount information without requiring code changes.

## Features Added

### 1. Services Pricing Management
**Component:** `AdminServicesPricing.tsx`

Allows admins to configure for each service:
- **Base Price**: Starting price for the service (e.g., R350)
- **Bedroom Price**: Additional cost per bedroom (e.g., R50)
- **Bathroom Price**: Additional cost per bathroom (e.g., R40)
- **Service Fee Rate**: Percentage fee applied to bookings (e.g., 10%)

**Features:**
- Edit pricing for all services (Standard Cleaning, Deep Cleaning, Move In/Out, Airbnb Turnover, etc.)
- Real-time validation
- Direct database updates
- Clean modal interface for editing

### 2. Extras Pricing Management
**Component:** `AdminExtrasPricing.tsx`

Full CRUD (Create, Read, Update, Delete) functionality for extra services:
- **Name**: Name of the extra service
- **Description**: Detailed description
- **Price**: Cost in ZAR
- **Icon**: Lucide icon name for display
- **Active Status**: Enable/disable extras for customers

**Features:**
- Add new extras
- Edit existing extras
- Delete extras (with confirmation)
- Toggle active status
- Full modal interface with validation

### 3. Frequency Discounts Information
**Component:** `AdminFrequencyDiscounts.tsx`

Displays current frequency discount configuration:
- **One-Time**: 0% (no discount)
- **Weekly**: 15% discount
- **Bi-Weekly**: 10% discount
- **Monthly**: 5% discount

**Note:** These are currently informational and hardcoded for performance. The component includes documentation on how to make them fully dynamic in the future.

### 4. Unified Pricing Manager
**Component:** `AdminPricingManager.tsx`

Main interface that combines all pricing management features in a tabbed interface:
- Services tab
- Extras tab
- Frequency Discounts tab

### 5. Admin Dashboard Integration
**Updated:** `AdminDashboard.tsx`

Added new "Pricing" tab to the admin dashboard navigation, accessible alongside:
- Bookings
- Cleaners
- Applications

## How to Use

### Accessing the Pricing Manager
1. Sign in as an admin user
2. Navigate to the Admin Dashboard
3. Click on the "Pricing" tab
4. Choose the section you want to manage (Services, Extras, or Discounts)

### Editing Service Prices
1. Go to the "Services" tab in Pricing Management
2. Click the edit icon next to any service
3. Update the desired fields:
   - Base Price
   - Bedroom Price
   - Bathroom Price
   - Service Fee Rate (as percentage)
4. Click "Save Changes"

### Managing Extras
1. Go to the "Extras" tab in Pricing Management
2. To add a new extra, click "Add Extra"
3. To edit an extra, click the edit icon
4. To delete an extra, click the trash icon (with confirmation)
5. Toggle "Active" status to show/hide from customers

### Viewing Discount Information
1. Go to the "Frequency Discounts" tab
2. View current discount rates for each booking frequency
3. Read implementation notes for making discounts fully dynamic

## Database Schema

### Services Table
The existing `services` table includes:
```sql
- base_price (decimal): Base service price
- bedroom_price (decimal): Price per bedroom
- bathroom_price (decimal): Price per bathroom
- service_fee_rate (decimal): Service fee (0.10 = 10%)
```

### Extras Table
The existing `extras` table includes:
```sql
- name (text): Extra name
- description (text): Description
- base_price (decimal): Price
- icon (text): Icon name
- active (boolean): Visibility status
```

## Technical Details

### State Management
- Local component state using React hooks
- Real-time updates via Supabase client
- Optimistic UI updates with error handling

### Validation
- Positive number validation for prices
- Percentage validation (0-100) for service fee
- Required field validation

### Security
- Admin-only access (enforced by existing RLS policies)
- Row-level security on database operations
- Input sanitization

### Performance
- Minimal database queries
- Efficient re-fetching after updates
- Loading states for better UX

## Future Enhancements

### Dynamic Frequency Discounts
To make frequency discounts fully editable:

1. **Create Database Table:**
```sql
CREATE TABLE frequency_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  frequency TEXT NOT NULL UNIQUE,
  discount_rate DECIMAL(5,4) NOT NULL CHECK (discount_rate >= 0 AND discount_rate <= 1),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

2. **Update Pricing Logic:**
Modify `src/utils/pricing.ts` to fetch discount rates from the database instead of using hardcoded constants.

3. **Implement Caching:**
Add Redis or similar caching to avoid database hits on every pricing calculation.

### Additional Features to Consider
- **Pricing History**: Track changes to pricing over time
- **Seasonal Pricing**: Configure date-based pricing rules
- **Promotional Pricing**: Create time-limited discounts
- **Bulk Price Updates**: Update multiple services at once
- **Price Preview**: Show how changes affect sample bookings
- **Analytics**: Track revenue impact of pricing changes

## Files Created/Modified

### New Files
- `src/components/dashboard/admin/AdminServicesPricing.tsx`
- `src/components/dashboard/admin/AdminExtrasPricing.tsx`
- `src/components/dashboard/admin/AdminFrequencyDiscounts.tsx`
- `src/components/dashboard/admin/AdminPricingManager.tsx`
- `supabase/migrations/20250112200000_enable_admin_pricing_management.sql` - RLS policies

### Modified Files
- `src/pages/dashboard/AdminDashboard.tsx` - Added Pricing tab

## Database Migration Required

⚠️ **IMPORTANT**: You must apply the database migration for pricing management to work!

See `APPLY_PRICING_MANAGEMENT_FIX.md` for detailed instructions on applying the migration.

Quick command:
```bash
npx supabase db push
```

Or apply manually via Supabase Dashboard → SQL Editor

## Testing Checklist

- [ ] Admin can access Pricing tab
- [ ] Services pricing loads correctly
- [ ] Service prices can be edited and saved
- [ ] Changes persist after page refresh
- [ ] Extras pricing loads correctly
- [ ] New extras can be created
- [ ] Extras can be edited
- [ ] Extras can be deleted
- [ ] Active/inactive status works
- [ ] Frequency discounts display correctly
- [ ] Non-admin users cannot access pricing management
- [ ] Validation works for all inputs
- [ ] Error messages display correctly
- [ ] Loading states show during operations

## Support

For issues or questions about the pricing management feature, please refer to:
- Database schema in `supabase/migrations/`
- Pricing calculations in `src/utils/pricing.ts`
- Component implementations in `src/components/dashboard/admin/`

