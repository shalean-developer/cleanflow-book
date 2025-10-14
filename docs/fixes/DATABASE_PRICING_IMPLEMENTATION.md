# Database-Driven Pricing Implementation

## Overview
Successfully migrated bedroom, bathroom, and service fee pricing from hard-coded constants to database-driven values. This allows for flexible pricing management per service without code changes.

## Changes Made

### 1. Database Migration
**File:** `supabase/migrations/20251012120000_add_room_pricing_to_services.sql`

Added three new columns to the `services` table:
- `bedroom_price` (decimal): Price per bedroom in ZAR (default: 50.00)
- `bathroom_price` (decimal): Price per bathroom in ZAR (default: 40.00)
- `service_fee_rate` (decimal): Service fee as decimal (default: 0.10 = 10%)

**Features:**
- Proper constraints to ensure positive values
- Service fee rate limited to 0-1 range
- All existing services updated with current pricing
- Helpful column comments for documentation

### 2. TypeScript Types Updated
**File:** `src/integrations/supabase/types.ts`

Updated the `services` table type definitions to include:
- `bedroom_price: number`
- `bathroom_price: number`
- `service_fee_rate: number`

### 3. Pricing Utility Refactored
**File:** `src/utils/pricing.ts`

**Removed hard-coded constants:**
```typescript
// REMOVED:
const BEDROOM_MULTIPLIER = 50;
const BATHROOM_MULTIPLIER = 40;
const SERVICE_FEE_RATE = 0.1;
```

**Updated `PricingInput` interface to accept:**
- `bedroomPrice: number`
- `bathroomPrice: number`
- `serviceFeeRate: number`

**Updated `calculatePricing()` function** to use database values instead of constants.

### 4. Components Updated

#### StickySummary.tsx
Updated `calculatePricing` call to pass database values:
```typescript
calculatePricing({
  basePrice: Number(service.base_price),
  bedroomPrice: Number(service.bedroom_price),      // NEW
  bathroomPrice: Number(service.bathroom_price),    // NEW
  serviceFeeRate: Number(service.service_fee_rate), // NEW
  bedrooms: booking.bedrooms,
  bathrooms: booking.bathrooms,
  extrasTotal,
  frequency: booking.frequency,
  promo: booking.promo,
})
```

#### Review.tsx
Updated `calculatePricing` call with same database values.

#### OrderSummary.tsx
No changes needed - receives pricing as a prop.

## How to Apply the Migration

### Option 1: Using Supabase CLI (Recommended)
```bash
# Push migration to your Supabase project
supabase db push

# Or apply migration manually
supabase migration up
```

### Option 2: Manual SQL Execution
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20251012120000_add_room_pricing_to_services.sql`
4. Run the query

### Option 3: Using npm/bun scripts (if configured)
```bash
npm run db:push
# or
bun run db:push
```

## Testing Checklist

After applying the migration, test these scenarios:

- [ ] Visit booking flow step 2 (/booking/details)
- [ ] Select different numbers of bedrooms and bathrooms
- [ ] Verify pricing updates correctly in StickySummary
- [ ] Complete a full booking through Review page
- [ ] Check that pricing calculations are correct
- [ ] Test with different services (Standard, Deep, Move In/Out, Airbnb)
- [ ] Verify promo codes still work correctly
- [ ] Test frequency discounts apply properly

## Future Enhancements

### Admin UI for Pricing Management
You can now build an admin interface to:
- Update service-specific pricing (bedrooms, bathrooms, service fees)
- Set different prices for different service types
- Manage pricing without code deployments

Example admin query:
```sql
-- Update pricing for a specific service
UPDATE services
SET 
  bedroom_price = 75.00,
  bathroom_price = 50.00,
  service_fee_rate = 0.12
WHERE slug = 'deep-cleaning';
```

### Default Pricing Values
Current defaults (can be changed via SQL):
- Bedroom: R50.00 per room
- Bathroom: R40.00 per room
- Service Fee: 10% (0.10)

## Rollback Plan

If needed, you can rollback with:
```sql
-- Rollback migration
ALTER TABLE public.services 
DROP COLUMN bedroom_price,
DROP COLUMN bathroom_price,
DROP COLUMN service_fee_rate;

-- Then revert code changes using git
git revert <commit-hash>
```

## Files Modified

1. `supabase/migrations/20251012120000_add_room_pricing_to_services.sql` (NEW)
2. `src/integrations/supabase/types.ts`
3. `src/utils/pricing.ts`
4. `src/components/booking/StickySummary.tsx`
5. `src/pages/booking/Review.tsx`

## Benefits

✅ **Flexible Pricing:** Update prices without code changes
✅ **Service-Specific:** Different services can have different rates
✅ **Maintainable:** Centralized pricing in database
✅ **Scalable:** Easy to extend with more pricing rules
✅ **Type-Safe:** Full TypeScript support
✅ **Backward Compatible:** Existing functionality preserved

## Notes

- All existing services automatically get default pricing values
- The migration is safe to run on production (adds columns with defaults)
- TypeScript types are fully updated for autocomplete support
- No breaking changes to existing booking flow

