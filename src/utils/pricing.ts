export interface PricingResult {
  subtotal: number;
  discount: number;
  promoDiscount: number;
  fees: number;
  total: number;
}

interface PricingInput {
  basePrice: number;
  bedroomPrice: number;
  bathroomPrice: number;
  serviceFeeRate: number;
  bedrooms: number;
  bathrooms: number;
  extrasTotal: number;
  frequency: string;
  promo?: {
    type: 'percent' | 'fixed';
    value: number;
  };
}

const FREQUENCY_DISCOUNTS: Record<string, number> = {
  'one-time': 0,
  'weekly': 0.15,
  'bi-weekly': 0.10,
  'monthly': 0.05,
};

export function calculatePricing({
  basePrice,
  bedroomPrice,
  bathroomPrice,
  serviceFeeRate,
  bedrooms,
  bathrooms,
  extrasTotal,
  frequency,
  promo,
}: PricingInput): PricingResult {
  // Calculate room costs using database values
  const bedroomsCost = bedrooms * bedroomPrice;
  const bathroomsCost = bathrooms * bathroomPrice;
  
  // Calculate subtotal
  const subtotal = basePrice + bedroomsCost + bathroomsCost + extrasTotal;
  
  // Calculate frequency discount
  const discountRate = FREQUENCY_DISCOUNTS[frequency] || 0;
  const discount = subtotal * discountRate;
  
  // Apply frequency discount first
  const afterFrequencyDiscount = subtotal - discount;
  
  // Calculate promo discount (applied after frequency discount)
  let promoDiscount = 0;
  if (promo) {
    if (promo.type === 'percent') {
      promoDiscount = afterFrequencyDiscount * (promo.value / 100);
    } else {
      promoDiscount = promo.value;
    }
  }
  
  // Calculate final amount after both discounts
  const afterAllDiscounts = afterFrequencyDiscount - promoDiscount;
  
  // Calculate service fee on final discounted amount (using database rate)
  const fees = afterAllDiscounts * serviceFeeRate;
  
  // Calculate total
  const total = afterAllDiscounts + fees;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    promoDiscount: Math.round(promoDiscount * 100) / 100,
    fees: Math.round(fees * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function formatCurrencyZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
}
