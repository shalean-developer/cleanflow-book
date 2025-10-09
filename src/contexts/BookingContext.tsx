import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Validation schemas
export const bookingValidationSchema = z.object({
  bedrooms: z.number().min(0).max(10),
  bathrooms: z.number().min(1).max(8),
  houseDetails: z.string().max(500).optional(),
  specialInstructions: z.string().max(1000).optional(),
  date: z.date().min(new Date()).max(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)).optional(), // 6 months ahead
  frequency: z.enum(['once-off', 'weekly', 'bi-weekly', 'monthly']),
});

export interface BookingData {
  serviceId?: string;
  serviceName?: string;
  bedrooms: number;
  bathrooms: number;
  houseDetails?: string;
  extras: { id: string; name: string; price: number }[];
  specialInstructions?: string;
  date?: Date;
  time?: string;
  areaId?: string;
  areaName?: string;
  frequency: string;
  cleanerId?: string;
  cleanerName?: string;
  totalAmount: number;
}

interface BookingContextType {
  bookingData: BookingData;
  updateBooking: (data: Partial<BookingData>) => Promise<void>;
  calculateTotal: () => Promise<number>;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBooking: BookingData = {
  bedrooms: 2,
  bathrooms: 1,
  extras: [],
  frequency: 'once-off',
  totalAmount: 0,
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const saved = localStorage.getItem('booking-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date string back to Date object
      if (parsed.date) {
        parsed.date = new Date(parsed.date);
      }
      return parsed;
    }
    return initialBooking;
  });

  useEffect(() => {
    localStorage.setItem('booking-data', JSON.stringify(bookingData));
  }, [bookingData]);

  const calculateTotal = async (data: BookingData = bookingData): Promise<number> => {
    // Fetch service-specific pricing from database
    let basePrice = 300;
    let bedroomPrice = 100;
    let bathroomPrice = 80;

    if (data.serviceId) {
      const { data: pricingData } = await supabase
        .from('pricing_config')
        .select('base_price, bedroom_price, bathroom_price')
        .eq('service_id', data.serviceId)
        .eq('active', true)
        .maybeSingle();

      if (pricingData) {
        basePrice = Number(pricingData.base_price);
        bedroomPrice = Number(pricingData.bedroom_price);
        bathroomPrice = Number(pricingData.bathroom_price);
      }
    }

    // Calculate total
    let total = basePrice;
    total += data.bedrooms * bedroomPrice;
    total += data.bathrooms * bathroomPrice;
    
    // Add extras
    const extrasTotal = data.extras.reduce((sum, extra) => sum + extra.price, 0);
    total += extrasTotal;
    
    return total;
  };

  const updateBooking = async (data: Partial<BookingData>) => {
    // Only validate fields that are being updated
    try {
      // Build validation object with only the fields being updated
      const fieldsToValidate: any = {};
      
      if (data.bedrooms !== undefined) fieldsToValidate.bedrooms = data.bedrooms;
      if (data.bathrooms !== undefined) fieldsToValidate.bathrooms = data.bathrooms;
      if (data.houseDetails !== undefined) fieldsToValidate.houseDetails = data.houseDetails;
      if (data.specialInstructions !== undefined) fieldsToValidate.specialInstructions = data.specialInstructions;
      if (data.date !== undefined) fieldsToValidate.date = data.date;
      if (data.frequency !== undefined) fieldsToValidate.frequency = data.frequency;
      
      // If we have fields to validate, use partial validation
      if (Object.keys(fieldsToValidate).length > 0) {
        bookingValidationSchema.partial().parse(fieldsToValidate);
      }
      
      const updated = { ...bookingData, ...data };
      // Recalculate total with the updated data
      const newTotal = await calculateTotal(updated);
      
      setBookingData({ ...updated, totalAmount: newTotal });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        throw new Error(`Invalid booking data: ${error.errors[0].message}`);
      }
      throw error;
    }
  };

  const resetBooking = () => {
    setBookingData(initialBooking);
    localStorage.removeItem('booking-data');
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, calculateTotal, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
