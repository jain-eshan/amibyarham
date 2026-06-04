import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

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
