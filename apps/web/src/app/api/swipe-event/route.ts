import { NextResponse } from "next/server";
import { z } from "zod";

import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";

export const runtime = "nodejs";

const bodySchema = z.object({
  sessionId: z.string().uuid(),
  imageId: z.string().uuid().nullable().optional(),
  decision: z.enum(["like", "pass"]),
  position: z.number().int().nonnegative().optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { ok } = rateLimit(`swipe-event:${ip}`, 60, 60_000);
  if (!ok) return new NextResponse(null, { status: 429 });

  let parsed;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!parsed.imageId) return new NextResponse(null, { status: 204 });

  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("swipe_events").insert({
    session_id: parsed.sessionId,
    image_id: parsed.imageId,
    decision: parsed.decision,
    position: parsed.position ?? null,
  });

  if (error) {
    return NextResponse.json({ error: "log_failed" }, { status: 202 });
  }
  return new NextResponse(null, { status: 204 });
}
