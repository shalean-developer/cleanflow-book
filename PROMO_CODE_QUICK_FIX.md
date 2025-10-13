# Quick Fix: Promo Code Display Issue

## Problem
Promo code NEW20SC (20% off Standard Cleaning) was not visible in the Order Summary, making users think it wasn't being applied.

## Solution
The promo was being calculated correctly but not displayed. Fixed by updating `OrderSummary.tsx` to show the promo discount.

## What Changed
**File**: `src/components/booking/OrderSummary.tsx`

1. ✅ Added `promoDiscount` field to pricing interface
2. ✅ Added `promo` object to booking interface  
3. ✅ Added promo discount line in cost breakdown with code display

## Result
Users now see:
```
Subtotal          R450.00
Promo Discount (NEW20SC)  -R90.00
Service Fee       R36.00
---
Total            R396.00
```

## Testing
To test the fix:
1. Visit homepage
2. Wait for promo modal (2 seconds)
3. Sign in and click "Claim 20% Off"
4. Complete booking for Standard Cleaning
5. On Review page, verify promo discount is visible

## Status
✅ **FIXED** - Promo code is now properly displayed and applied to Standard Cleaning bookings.

