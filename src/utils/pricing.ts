export interface PricingResult {
  subtotal: number;
  discount: number;
  fees: number;
  total: number;
}

interface PricingInput {
  basePrice: number;
  bedrooms: number;
  bathrooms: number;
  extrasTotal: number;
  frequency: string;
}

const BEDROOM_MULTIPLIER = 50;
const BATHROOM_MULTIPLIER = 40;
const SERVICE_FEE_RATE = 0.1; // 10%

const FREQUENCY_DISCOUNTS: Record<string, number> = {
  'one-time': 0,
  'weekly': 0.15,
  'bi-weekly': 0.10,
  'monthly': 0.05,
};

export function calculatePricing({
  basePrice,
  bedrooms,
  bathrooms,
  extrasTotal,
  frequency,
}: PricingInput): PricingResult {
  // Calculate room costs
  const bedroomsCost = bedrooms * BEDROOM_MULTIPLIER;
  const bathroomsCost = bathrooms * BATHROOM_MULTIPLIER;
  
  // Calculate subtotal
  const subtotal = basePrice + bedroomsCost + bathroomsCost + extrasTotal;
  
  // Calculate discount
  const discountRate = FREQUENCY_DISCOUNTS[frequency] || 0;
  const discount = subtotal * discountRate;
  
  // Calculate service fee on discounted amount
  const afterDiscount = subtotal - discount;
  const fees = afterDiscount * SERVICE_FEE_RATE;
  
  // Calculate total
  const total = afterDiscount + fees;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
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
