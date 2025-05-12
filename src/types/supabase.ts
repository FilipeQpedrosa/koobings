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
      businesses: {
        Row: {
          id: string
          name: string
          type: string
          email: string
          address: string | null
          phone: string | null
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          email: string
          address?: string | null
          phone?: string | null
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          email?: string
          address?: string | null
          phone?: string | null
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          business_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: string
          business_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          business_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          duration: number
          price: number
          business_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration: number
          price: number
          business_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          business_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          business_id: string
          client_id: string
          service_id: string
          staff_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          start_time: string
          end_time: string
          status: string
          notes?: string | null
          business_id: string
          client_id: string
          service_id: string
          staff_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          business_id?: string
          client_id?: string
          service_id?: string
          staff_id?: string
          created_at?: string
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