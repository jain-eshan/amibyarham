import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseAnonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CommissionLead = {
  id?: string;
  created_at?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  occasion: string;
  occasion_note?: string;
  budget_range: string;
  image_url?: string;
  status?: string;
};
