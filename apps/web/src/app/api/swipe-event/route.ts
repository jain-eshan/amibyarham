// Fire-and-forget swipe-event logger. SwipeEngine calls this per decision; the
// route inserts into `swipe_events` under the anon key (RLS allows guest
// inserts), then returns 204. Failures are intentionally non-fatal — the swipe
// UX must never block on this.

import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

const bodySchema = z.object({
  sessionId: z.string().uuid(),
  imageId: z.string().uuid().nullable().optional(),
  decision: z.enum(["like", "pass"]),
  position: z.number().int().nonnegative().optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Fallback decks emit non-uuid ids; only persist DB-backed cards.
  if (!parsed.imageId) return new NextResponse(null, { status: 204 });

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("swipe_events").insert({
    session_id: parsed.sessionId,
    image_id: parsed.imageId,
    decision: parsed.decision,
    position: parsed.position ?? null,
  });

  // Don't surface DB errors to the client — logging is best-effort.
  if (error) {
    return NextResponse.json({ error: "log_failed" }, { status: 202 });
  }
  return new NextResponse(null, { status: 204 });
}
