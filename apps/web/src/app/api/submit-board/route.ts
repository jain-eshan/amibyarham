import { NextResponse } from "next/server";
import { z } from "zod";

import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sendNotificationEmail } from "@/lib/send-notification-email";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";

export const runtime = "nodejs";

const bodySchema = z.object({
  fullName: z.string().min(2),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/),
  email: z
    .union([z.string().email(), z.literal("")])
    .optional()
    .transform((v) => v || null),
  designNotes: z.string().max(2000).optional(),
  favoriteImageIds: z.array(z.string().uuid()).max(50).default([]),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { ok } = rateLimit(`submit-board:${ip}`, 5, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests — please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 422 });
  }

  const { fullName, whatsapp, email, designNotes, favoriteImageIds } =
    parsed.data;

  try {
    const supabase = createSupabaseServiceRoleClient();

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({ full_name: fullName, whatsapp_number: whatsapp, email })
      .select("id")
      .single();
    if (leadError ?? !lead) {
      throw new Error(leadError?.message ?? "Failed to save contact details");
    }

    const { data: request, error: requestError } = await supabase
      .from("custom_requests")
      .insert({
        lead_id: lead.id,
        request_type: "swipe_board",
        design_notes: designNotes ?? null,
      })
      .select("id")
      .single();
    if (requestError ?? !request) {
      throw new Error(requestError?.message ?? "Failed to save board");
    }

    if (favoriteImageIds.length > 0) {
      const { error: favError } = await supabase
        .from("request_favorite_items")
        .insert(
          favoriteImageIds.map((imageId) => ({
            request_id: request.id,
            image_id: imageId,
          })),
        );
      if (favError) throw new Error(favError.message);
    }

    sendNotificationEmail({
      fullName,
      whatsapp,
      email: email ?? undefined,
      requestType: "swipe_board",
      designNotes,
      favoriteCount: favoriteImageIds.length,
    }).catch((err) => console.error("[submit-board] Email error:", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-board]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong — please try again.",
      },
      { status: 500 },
    );
  }
}
