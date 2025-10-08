import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  updateBooking: (data: Partial<BookingData>) => void;
  calculateTotal: () => number;
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
    return saved ? JSON.parse(saved) : initialBooking;
  });

  useEffect(() => {
    localStorage.setItem('booking-data', JSON.stringify(bookingData));
  }, [bookingData]);

  const calculateTotal = () => {
    let total = 300; // Base price
    
    // Add bedroom cost
    total += bookingData.bedrooms * 100;
    
    // Add bathroom cost
    total += bookingData.bathrooms * 80;
    
    // Add extras
    const extrasTotal = bookingData.extras.reduce((sum, extra) => sum + extra.price, 0);
    total += extrasTotal;
    
    return total;
  };

  const updateBooking = (data: Partial<BookingData>) => {
    setBookingData(prev => {
      const updated = { ...prev, ...data };
      // Recalculate total whenever booking changes
      const newTotal = calculateTotal();
      return { ...updated, totalAmount: newTotal };
    });
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
