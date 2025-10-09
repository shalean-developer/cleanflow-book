import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingData {
  serviceId?: string;
  serviceName?: string;
  serviceSlug?: string;
  bedrooms: number;
  bathrooms: number;
  extras: string[];
  date?: string;
  time?: string;
  frequency: string;
  location?: string;
  specialInstructions?: string;
  cleanerId?: string;
  cleanerName?: string;
}

interface BookingStore {
  booking: BookingData;
  setService: (id: string, name: string, slug: string) => void;
  setDetails: (bedrooms: number, bathrooms: number, extras: string[], specialInstructions?: string) => void;
  setSchedule: (date: string, time: string, frequency: string, location: string) => void;
  setCleaner: (id: string, name: string) => void;
  reset: () => void;
}

const initialState: BookingData = {
  bedrooms: 2,
  bathrooms: 1,
  extras: [],
  frequency: 'one-time',
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      booking: initialState,
      setService: (id, name, slug) =>
        set((state) => ({
          booking: { ...state.booking, serviceId: id, serviceName: name, serviceSlug: slug },
        })),
      setDetails: (bedrooms, bathrooms, extras, specialInstructions) =>
        set((state) => ({
          booking: { ...state.booking, bedrooms, bathrooms, extras, specialInstructions },
        })),
      setSchedule: (date, time, frequency, location) =>
        set((state) => ({
          booking: { ...state.booking, date, time, frequency, location },
        })),
      setCleaner: (id, name) =>
        set((state) => ({
          booking: { ...state.booking, cleanerId: id, cleanerName: name },
        })),
      reset: () => set({ booking: initialState }),
    }),
    {
      name: 'booking-storage',
    }
  )
);
