import type { Metadata } from "next";

import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = {
  title: "Studio Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServiceRoleClient();

  const { data: requests } = await supabase
    .from("custom_requests")
    .select(
      `
      id, request_type, external_url, uploaded_media_url,
      design_notes, applied_filters, status, created_at, lead_id,
      leads (id, full_name, whatsapp_number, email, created_at)
    `,
    )
    .order("created_at", { ascending: false });

  const submissions = requests ?? [];

  const swipeBoardIds = submissions
    .filter((s) => s.request_type === "swipe_board")
    .map((s) => s.id);

  let favoritesMap: Record<
    string,
    { image_id: string; image_url: string; alt_text: string | null; jewelry_type: string | null }[]
  > = {};

  if (swipeBoardIds.length > 0) {
    const { data: favorites } = await supabase
      .from("request_favorite_items")
      .select(
        "request_id, image_id, inspiration_images (id, image_url, alt_text, jewelry_type)",
      )
      .in("request_id", swipeBoardIds);

    if (favorites) {
      for (const fav of favorites) {
        const img = fav.inspiration_images as unknown as {
          id: string;
          image_url: string;
          alt_text: string | null;
          jewelry_type: string | null;
        } | null;
        if (!img) continue;
        const arr = favoritesMap[fav.request_id] ?? [];
        arr.push({
          image_id: img.id,
          image_url: img.image_url,
          alt_text: img.alt_text,
          jewelry_type: img.jewelry_type,
        });
        favoritesMap[fav.request_id] = arr;
      }
    }
  }

  const submissionsWithFavorites = submissions.map((s) => ({
    ...s,
    leads: s.leads as unknown as {
      id: string;
      full_name: string;
      whatsapp_number: string;
      email: string | null;
      created_at: string;
    },
    favorites: favoritesMap[s.id] ?? [],
  }));

  return <Dashboard submissions={submissionsWithFavorites} />;
}
