# Extras Database Integration Fix

## Overview
Fixed extras to properly fetch from the database instead of using hardcoded data, and corrected the field name mismatches throughout the booking flow.

## Issues Fixed

### 1. Quote Page Using Hardcoded Extras
**Problem**: The `/booking/quote` page had a hardcoded array of extras instead of fetching from the database.

**Solution**: 
- Removed hardcoded `EXTRAS` array
- Added `useQuery` hook to fetch extras from database
- Updated rendering to use database fields (`name` instead of `label`, `base_price` instead of `price`)
- Added dynamic icon rendering using Lucide icons

### 2. Field Name Mismatch
**Problem**: Components were using `extra.price` but the database column is `extra.base_price`.

**Solution**: Updated all references from `extra.price` to `extra.base_price` in:
- `src/components/booking/StickySummary.tsx`
- `src/components/booking/OrderSummary.tsx`
- `src/pages/booking/Details.tsx`
- `src/pages/booking/Review.tsx`

## Files Modified

### 1. `src/pages/booking/Quote.tsx`
**Changes:**
- ✅ Added import for `useQuery` from `@tanstack/react-query`
- ✅ Added import for `* as LucideIcons` to support dynamic icon rendering
- ✅ Removed hardcoded `EXTRAS` constant array
- ✅ Added database query to fetch active extras
- ✅ Added `getIcon()` helper function for dynamic icons
- ✅ Updated rendering to use `extra.name` and `extra.base_price`

**Before:**
```typescript
const EXTRAS = [
  { id: 'inside-fridge', label: 'Inside Fridge', icon: Refrigerator },
  // ... hardcoded array
];

{EXTRAS.map((extra) => (
  <Icon className="w-4 h-4" />
  {extra.label}
))}
```

**After:**
```typescript
const { data: extras = [] } = useQuery({
  queryKey: ['extras'],
  queryFn: async () => {
    const { data } = await supabase
      .from('extras')
      .select('*')
      .eq('active', true)
      .order('name');
    return data || [];
  },
});

{extras.map((extra) => (
  {getIcon(extra.icon || 'Sparkles')}
  {extra.name}
))}
```

### 2. `src/components/booking/StickySummary.tsx`
**Changes:**
- ✅ Updated `extrasTotal` calculation: `extra.price` → `extra.base_price`
- ✅ Updated display: `extra.price` → `extra.base_price`

### 3. `src/components/booking/OrderSummary.tsx`
**Changes:**
- ✅ Updated `extrasTotal` calculation: `extra.price` → `extra.base_price`
- ✅ Updated display: `extra.price` → `extra.base_price`

### 4. `src/pages/booking/Details.tsx`
**Changes:**
- ✅ Updated price display: `extra.price` → `extra.base_price`

### 5. `src/pages/booking/Review.tsx`
**Changes:**
- ✅ Updated `extrasTotal` calculation: `extra.price` → `extra.base_price`

## Database Schema Reference

### Extras Table Structure
```sql
CREATE TABLE public.extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  base_price DECIMAL(10, 2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Fields:**
- `name` - Display name of the extra service
- `icon` - Lucide icon name (e.g., 'Refrigerator', 'Sparkles')
- `description` - Optional description
- `base_price` - Price in ZAR (not `price`!)
- `active` - Whether the extra is visible to customers

## Benefits

### 1. Dynamic Extras Management
- Admins can now add/edit/delete extras from the admin dashboard
- Changes appear immediately to customers without code deployment
- No more hardcoded data scattered across the codebase

### 2. Consistent Pricing
- All extras now use the same pricing field (`base_price`)
- Pricing calculations are consistent across all booking pages
- Admin pricing changes reflect immediately

### 3. Better Maintainability
- Single source of truth (database)
- No need to update multiple files when adding extras
- Easier to track and audit changes

## How It Works Now

### Customer Booking Flow
1. **Quote Page** (`/booking/quote`)
   - Fetches all active extras from database
   - Displays with dynamic icons and current prices
   - Selections stored in local state

2. **Details Page** (`/booking/details`)
   - Fetches all extras from database
   - Shows selected extras from booking store
   - Displays current prices from database

3. **Review Page** (`/booking/review`)
   - Fetches only selected extras by ID
   - Calculates total using `base_price`
   - Shows final pricing before payment

4. **Sticky Summary** (shown throughout)
   - Fetches selected extras in real-time
   - Updates pricing as extras are added/removed
   - Always shows current database prices

### Admin Management
1. Navigate to **Admin Dashboard → Pricing → Extras**
2. Add, edit, or delete extras
3. Toggle active/inactive status
4. Changes appear immediately on customer-facing pages

## Testing Checklist

- [x] Quote page loads extras from database
- [x] Details page shows correct extras
- [x] Review page calculates correct pricing
- [x] Sticky summary updates with selections
- [x] All prices use `base_price` field
- [x] Icons render correctly (dynamic Lucide icons)
- [x] Inactive extras don't show to customers
- [x] Admin can manage extras via dashboard
- [x] No linter errors
- [ ] End-to-end booking flow works
- [ ] Pricing calculations are accurate

## Potential Future Enhancements

1. **Category-Based Extras**
   - Group extras by category (e.g., "Appliances", "Laundry", "Windows")
   - Allow filtering in the UI

2. **Service-Specific Extras**
   - Link extras to specific services
   - Only show relevant extras for selected service

3. **Conditional Pricing**
   - Price modifiers based on property size
   - Quantity-based pricing (e.g., multiple windows)

4. **Extra Images**
   - Add image URLs to extras table
   - Display visual previews for customers

5. **Required vs Optional**
   - Mark some extras as required for certain services
   - Auto-select required extras

## Migration Notes

✅ No database migration required - the `extras` table structure already supports this implementation.

✅ Existing extras in the database will work immediately.

✅ No breaking changes - all updates are backward compatible.

## Support

If extras aren't loading:
1. Check that extras exist in the database and are marked as `active = true`
2. Verify RLS policies allow public SELECT on extras table
3. Check browser console for query errors
4. Ensure `base_price` field has valid values

To add sample extras via SQL:
```sql
INSERT INTO public.extras (name, icon, description, base_price, active) VALUES
('Inside Fridge', 'Refrigerator', 'Deep clean inside refrigerator', 150.00, true),
('Inside Oven', 'Flame', 'Clean inside oven and racks', 200.00, true),
('Interior Windows', 'Sparkles', 'Clean interior windows', 100.00, true),
('Laundry', 'Shirt', 'Wash and fold laundry', 180.00, true);
```

