# Fix "R NaN" in Extras Pricing

## Problem
The extras in the admin dashboard are showing "R NaN" instead of proper prices because:
1. The `base_price` values in the database are NULL or missing
2. There's a column name mismatch between `price` and `base_price`
3. No fallback handling for null/undefined values

## Solution

### Option 1: Apply Database Migration (Recommended)

Run the migration to fix the database data:

```bash
npx supabase db push
```

Or manually execute the SQL:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase/migrations/20250112210000_fix_extras_pricing_data.sql`
3. Click **Run**

### Option 2: Manual Database Fix

If you prefer to fix manually:

```sql
-- Update all extras with proper prices
UPDATE public.extras SET base_price = CASE 
    WHEN name ILIKE '%fridge%' THEN 150.00
    WHEN name ILIKE '%oven%' THEN 150.00
    WHEN name ILIKE '%cabinet%' THEN 200.00
    WHEN name ILIKE '%window%' THEN 100.00
    WHEN name ILIKE '%wall%' THEN 250.00
    WHEN name ILIKE '%iron%' THEN 120.00
    WHEN name ILIKE '%laundry%' THEN 180.00
    ELSE 150.00
END
WHERE base_price IS NULL OR base_price = 0;

-- Ensure base_price is NOT NULL
ALTER TABLE public.extras ALTER COLUMN base_price SET NOT NULL;
```

### Option 3: Edit via Admin Dashboard

1. Go to Admin Dashboard → Pricing → Extras
2. Click the edit icon for each extra
3. Set proper prices (e.g., 150.00, 200.00, etc.)
4. Click "Save Changes"

## What the Migration Does

### 1. **Fixes Column Issues**
- Adds `base_price` column if missing
- Copies data from `price` to `base_price` if needed
- Makes `base_price` NOT NULL

### 2. **Sets Default Prices**
- Inside Fridge: R150.00
- Inside Oven: R150.00
- Inside Cabinets: R200.00
- Interior Windows: R100.00
- Interior Walls: R250.00
- Ironing: R120.00
- Laundry: R180.00

### 3. **Updates Missing Data**
- Adds descriptions for all extras
- Updates icons to proper Lucide names
- Ensures all extras are active

### 4. **Adds Safety Constraints**
- Prevents negative prices
- Ensures data integrity

## Code Changes Applied

### 1. **Admin Component**
- Added fallback: `extra.base_price || 0`
- Prevents NaN display in admin dashboard

### 2. **Booking Components**
- Added fallback in all price calculations
- Updated all display components
- Prevents NaN in customer-facing pages

## Verification

After applying the fix:

1. ✅ **Admin Dashboard**: Extras show proper prices (R150.00, R200.00, etc.)
2. ✅ **Booking Pages**: Extras display correct prices
3. ✅ **Price Calculations**: No more NaN in totals
4. ✅ **Edit Functionality**: Can modify prices via admin dashboard

## Files Modified

### Database:
- `supabase/migrations/20250112210000_fix_extras_pricing_data.sql`

### Components:
- `src/components/dashboard/admin/AdminExtrasPricing.tsx`
- `src/components/booking/StickySummary.tsx`
- `src/components/booking/OrderSummary.tsx`
- `src/pages/booking/Details.tsx`
- `src/pages/booking/Review.tsx`

## Testing Checklist

- [ ] Admin dashboard shows proper prices (not NaN)
- [ ] Can edit extra prices successfully
- [ ] Booking pages display correct prices
- [ ] Price calculations work properly
- [ ] No console errors related to NaN
- [ ] New extras can be created with prices

## Troubleshooting

### Still seeing NaN?
1. Check browser console for errors
2. Verify migration was applied
3. Refresh the page (hard refresh: Ctrl+Shift+R)
4. Check database directly:
```sql
SELECT name, base_price FROM public.extras;
```

### Migration failed?
1. Check Supabase logs
2. Ensure you have admin permissions
3. Try running the SQL manually
4. Check if `extras` table exists

### Prices still 0?
1. Edit via admin dashboard
2. Set prices manually
3. Verify changes persist after refresh

## Quick SQL Check

To verify the fix worked:
```sql
SELECT 
    name,
    base_price,
    active,
    icon
FROM public.extras 
ORDER BY name;
```

All `base_price` values should be > 0 and not NULL.
