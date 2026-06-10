// Generated to match supabase/migrations/0001_initial_schema.sql.
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      custom_request_type: "external_link" | "direct_upload" | "swipe_board";
      custom_request_status: "pending" | "contacted" | "converted" | "closed";
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

export type CustomRequestType =
  Database["public"]["Enums"]["custom_request_type"];
export type CustomRequestStatus =
  Database["public"]["Enums"]["custom_request_status"];
