export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          bathrooms: number
          bedrooms: number
          cleaner_id: string | null
          created_at: string | null
          customer_email: string
          date: string
          extras: string[] | null
          frequency: string
          id: string
          location: string
          payment_reference: string | null
          phone_number: string | null
          pricing: Json
          reference: string
          service_id: string
          special_instructions: string | null
          status: string | null
          time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bathrooms?: number
          bedrooms?: number
          cleaner_id?: string | null
          created_at?: string | null
          customer_email: string
          date: string
          extras?: string[] | null
          frequency: string
          id?: string
          location: string
          payment_reference?: string | null
          phone_number?: string | null
          pricing: Json
          reference: string
          service_id: string
          special_instructions?: string | null
          status?: string | null
          time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          cleaner_id?: string | null
          created_at?: string | null
          customer_email?: string
          date?: string
          extras?: string[] | null
          frequency?: string
          id?: string
          location?: string
          payment_reference?: string | null
          phone_number?: string | null
          pricing?: Json
          reference?: string
          service_id?: string
          special_instructions?: string | null
          status?: string | null
          time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "cleaners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaner_applications: {
        Row: {
          address_line1: string
          address_line2: string | null
          areas: string[]
          available_days: string[]
          certificate_url: string | null
          comfortable_with_pets: boolean
          created_at: string
          cv_url: string
          date_of_birth: string
          earliest_start_date: string
          email: string
          first_name: string
          frequency: string
          has_own_transport: boolean
          has_work_permit: boolean
          id: string
          id_doc_url: string
          id_number_or_passport: string
          languages: string[]
          last_name: string
          phone: string
          postal_code: string
          proof_of_address_url: string
          ref1_name: string
          ref1_phone: string
          ref1_relationship: string
          ref2_name: string | null
          ref2_phone: string | null
          ref2_relationship: string | null
          skills: string[]
          start_time: string
          status: string
          suburb_city: string
          updated_at: string
          years_experience: number
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          areas?: string[]
          available_days?: string[]
          certificate_url?: string | null
          comfortable_with_pets?: boolean
          created_at?: string
          cv_url?: string
          date_of_birth: string
          earliest_start_date: string
          email: string
          first_name: string
          frequency: string
          has_own_transport?: boolean
          has_work_permit?: boolean
          id?: string
          id_doc_url?: string
          id_number_or_passport: string
          languages?: string[]
          last_name: string
          phone: string
          postal_code: string
          proof_of_address_url?: string
          ref1_name: string
          ref1_phone: string
          ref1_relationship: string
          ref2_name?: string | null
          ref2_phone?: string | null
          ref2_relationship?: string | null
          skills?: string[]
          start_time: string
          status?: string
          suburb_city: string
          updated_at?: string
          years_experience?: number
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          areas?: string[]
          available_days?: string[]
          certificate_url?: string | null
          comfortable_with_pets?: boolean
          created_at?: string
          cv_url?: string
          date_of_birth?: string
          earliest_start_date?: string
          email?: string
          first_name?: string
          frequency?: string
          has_own_transport?: boolean
          has_work_permit?: boolean
          id?: string
          id_doc_url?: string
          id_number_or_passport?: string
          languages?: string[]
          last_name?: string
          phone?: string
          postal_code?: string
          proof_of_address_url?: string
          ref1_name?: string
          ref1_phone?: string
          ref1_relationship?: string
          ref2_name?: string | null
          ref2_phone?: string | null
          ref2_relationship?: string | null
          skills?: string[]
          start_time?: string
          status?: string
          suburb_city?: string
          updated_at?: string
          years_experience?: number
        }
        Relationships: []
      }
      cleaners: {
        Row: {
          availability: Json
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          rating: number | null
          service_areas: string[]
        }
        Insert: {
          availability: Json
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name: string
          rating?: number | null
          service_areas: string[]
        }
        Update: {
          availability?: Json
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          rating?: number | null
          service_areas?: string[]
        }
        Relationships: []
      }
      extras: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_claims: {
        Row: {
          applies_to: string
          claimed_at: string
          code: string
          created_at: string | null
          email: string | null
          expires_at: string
          id: string
          revoke_reason: string | null
          service_slug: string
          session_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          applies_to: string
          claimed_at?: string
          code: string
          created_at?: string | null
          email?: string | null
          expires_at: string
          id?: string
          revoke_reason?: string | null
          service_slug: string
          session_id: string
          status?: string
          user_id?: string | null
        }
        Update: {
          applies_to?: string
          claimed_at?: string
          code?: string
          created_at?: string | null
          email?: string | null
          expires_at?: string
          id?: string
          revoke_reason?: string | null
          service_slug?: string
          session_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      promo_redemptions: {
        Row: {
          applies_to: string
          booking_id: string
          claimed_id: string | null
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          applies_to: string
          booking_id: string
          claimed_id?: string | null
          code: string
          created_at?: string | null
          discount_type: string
          discount_value: number
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          applies_to?: string
          booking_id?: string
          claimed_id?: string | null
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_redemptions_claimed_id_fkey"
            columns: ["claimed_id"]
            isOneToOne: false
            referencedRelation: "promo_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number
          bathroom_price: number
          bedroom_price: number
          created_at: string | null
          description: string | null
          id: string
          name: string
          service_fee_rate: number
          slug: string
        }
        Insert: {
          base_price: number
          bathroom_price?: number
          bedroom_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          service_fee_rate?: number
          slug: string
        }
        Update: {
          base_price?: number
          bathroom_price?: number
          bedroom_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          service_fee_rate?: number
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "admin" | "cleaner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "admin", "cleaner"],
    },
  },
} as const
