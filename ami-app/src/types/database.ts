// Generated to match supabase/migrations/0001–0004.
// Shape mirrors `supabase gen types typescript --linked` output so it can be
// swapped for a generated file later without any caller changes.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      inspiration_images: {
        Row: {
          id: string;
          image_url: string;
          alt_text: string | null;
          category: string | null;
          jewelry_type: string | null;
          occasions: string[];
          metals: string[];
          styles: string[];
          stones: string[];
          motif: string[];
          source_name: string | null;
          source_url: string | null;
          attribution: string | null;
          metal_colors: string[];
          diamond_shapes: string[];
          carat_weight: number | null;
          karatage: string[];
          item_weight_grams: number | null;
          price_inr: number | null;
          certifications: string[];
          license_status: string;
          phash: string | null;
          is_own_catalog: boolean;
          featured: boolean;
          status: Database["public"]["Enums"]["inspiration_status"];
          // pgvector serializes to a string over PostgREST; server-side only.
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          alt_text?: string | null;
          category?: string | null;
          jewelry_type?: string | null;
          occasions?: string[];
          metals?: string[];
          styles?: string[];
          stones?: string[];
          motif?: string[];
          source_name?: string | null;
          source_url?: string | null;
          attribution?: string | null;
          metal_colors?: string[];
          diamond_shapes?: string[];
          carat_weight?: number | null;
          karatage?: string[];
          item_weight_grams?: number | null;
          price_inr?: number | null;
          certifications?: string[];
          license_status?: string;
          phash?: string | null;
          is_own_catalog?: boolean;
          featured?: boolean;
          status?: Database["public"]["Enums"]["inspiration_status"];
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          alt_text?: string | null;
          category?: string | null;
          jewelry_type?: string | null;
          occasions?: string[];
          metals?: string[];
          styles?: string[];
          stones?: string[];
          motif?: string[];
          source_name?: string | null;
          source_url?: string | null;
          attribution?: string | null;
          metal_colors?: string[];
          diamond_shapes?: string[];
          carat_weight?: number | null;
          karatage?: string[];
          item_weight_grams?: number | null;
          price_inr?: number | null;
          certifications?: string[];
          license_status?: string;
          phash?: string | null;
          is_own_catalog?: boolean;
          featured?: boolean;
          status?: Database["public"]["Enums"]["inspiration_status"];
          embedding?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          whatsapp_number: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          whatsapp_number: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          whatsapp_number?: string;
          email?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      custom_requests: {
        Row: {
          id: string;
          lead_id: string;
          request_type: Database["public"]["Enums"]["custom_request_type"];
          external_url: string | null;
          uploaded_media_url: string | null;
          design_notes: string | null;
          applied_filters: Json | null;
          status: Database["public"]["Enums"]["custom_request_status"];
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          request_type: Database["public"]["Enums"]["custom_request_type"];
          external_url?: string | null;
          uploaded_media_url?: string | null;
          design_notes?: string | null;
          applied_filters?: Json | null;
          status?: Database["public"]["Enums"]["custom_request_status"];
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          request_type?: Database["public"]["Enums"]["custom_request_type"];
          external_url?: string | null;
          uploaded_media_url?: string | null;
          design_notes?: string | null;
          applied_filters?: Json | null;
          status?: Database["public"]["Enums"]["custom_request_status"];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "custom_requests_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      request_favorite_items: {
        Row: {
          request_id: string;
          image_id: string;
        };
        Insert: {
          request_id: string;
          image_id: string;
        };
        Update: {
          request_id?: string;
          image_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "request_favorite_items_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "inspiration_images";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "request_favorite_items_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "custom_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      swipe_events: {
        Row: {
          id: string;
          session_id: string;
          image_id: string | null;
          decision: "like" | "pass";
          position: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          image_id?: string | null;
          decision: "like" | "pass";
          position?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          image_id?: string | null;
          decision?: "like" | "pass";
          position?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "swipe_events_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "inspiration_images";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_inspiration: {
        Args: {
          query: string;
          exclude_ids?: string[];
          match_limit?: number;
        };
        Returns: {
          id: string;
          image_url: string;
          alt_text: string | null;
          category: string | null;
          jewelry_type: string | null;
          occasions: string[];
          metals: string[];
          styles: string[];
          stones: string[];
          motif: string[];
          source_name: string | null;
          source_url: string | null;
          attribution: string | null;
          featured: boolean;
          is_own_catalog: boolean;
          created_at: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      custom_request_type: "external_link" | "direct_upload" | "swipe_board";
      custom_request_status: "pending" | "contacted" | "converted" | "closed";
      inspiration_status: "pending_review" | "approved" | "rejected";
    };
    CompositeTypes: Record<string, never>;
  };
};

// ─── Convenience aliases ─────────────────────────────────────────────────────

export type InspirationImage =
  Database["public"]["Tables"]["inspiration_images"]["Row"];
export type InspirationImageInsert =
  Database["public"]["Tables"]["inspiration_images"]["Insert"];

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export type CustomRequest =
  Database["public"]["Tables"]["custom_requests"]["Row"];
export type CustomRequestInsert =
  Database["public"]["Tables"]["custom_requests"]["Insert"];

export type RequestFavoriteItem =
  Database["public"]["Tables"]["request_favorite_items"]["Row"];
export type RequestFavoriteItemInsert =
  Database["public"]["Tables"]["request_favorite_items"]["Insert"];

export type SwipeEvent =
  Database["public"]["Tables"]["swipe_events"]["Row"];
export type SwipeEventInsert =
  Database["public"]["Tables"]["swipe_events"]["Insert"];

export type CustomRequestType =
  Database["public"]["Enums"]["custom_request_type"];
export type CustomRequestStatus =
  Database["public"]["Enums"]["custom_request_status"];
export type InspirationStatus =
  Database["public"]["Enums"]["inspiration_status"];
