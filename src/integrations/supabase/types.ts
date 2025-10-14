export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          reference: string
          user_id: string
          service_id: string
          bedrooms: number
          bathrooms: number
          extras: string[]
          date: string
          time: string
          frequency: string
          location: string
          special_instructions: string | null
          cleaner_id: string | null
          phone_number: string
          pricing: Json
          customer_email: string
          status: string
          payment_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference: string
          user_id: string
          service_id: string
          bedrooms: number
          bathrooms: number
          extras?: string[]
          date: string
          time: string
          frequency: string
          location: string
          special_instructions?: string | null
          cleaner_id?: string | null
          phone_number: string
          pricing: Json
          customer_email: string
          status?: string
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference?: string
          user_id?: string
          service_id?: string
          bedrooms?: number
          bathrooms?: number
          extras?: string[]
          date?: string
          time?: string
          frequency?: string
          location?: string
          special_instructions?: string | null
          cleaner_id?: string | null
          phone_number?: string
          pricing?: Json
          customer_email?: string
          status?: string
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          provider: string
          reference: string
          status: string
          amount: number
          currency: string
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          provider?: string
          reference: string
          status?: string
          amount: number
          currency?: string
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          provider?: string
          reference?: string
          status?: string
          amount?: number
          currency?: string
          paid_at?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cleaners: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone_number: string
          email: string
          available: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone_number: string
          email: string
          available?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone_number?: string
          email?: string
          available?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          role: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string
        }
        Insert: {
          id: string
          role?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
