import { NextResponse } from "next/server";
import { z } from "zod";

import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sendNotificationEmail } from "@/lib/send-notification-email";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB (Vercel body limit is 4.5 MB)

const metadataSchema = z.object({
  referenceMode: z.enum(["url", "upload"]),
  referenceUrl: z.string().optional(),
  metal: z.string().optional(),
  occasion: z.string().optional(),
  designNotes: z.string().max(600).optional(),
  fullName: z.string().min(2),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/),
  email: z
    .union([z.string().email(), z.literal("")])
    .optional()
    .transform((v) => v || null),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { ok } = rateLimit(`submit-request:${ip}`, 5, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests — please try again later." },
      { status: 429 },
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  let metadata: z.infer<typeof metadataSchema>;
  let file: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const raw = formData.get("metadata");
    if (typeof raw !== "string") {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }
    let parsed;
    try {
      parsed = metadataSchema.safeParse(JSON.parse(raw));
    } catch {
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 422 },
      );
    }
    metadata = parsed.data;

    const uploadedFile = formData.get("file");
    if (uploadedFile instanceof File) {
      if (uploadedFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File must be under 4 MB" },
          { status: 413 },
        );
      }
      if (!uploadedFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image files are accepted" },
          { status: 422 },
        );
      }
      file = uploadedFile;
    }
  } else {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    const parsed = metadataSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 422 },
      );
    }
    metadata = parsed.data;
  }

  const {
    referenceMode,
    referenceUrl,
    metal,
    occasion,
    designNotes,
    fullName,
    whatsapp,
    email,
  } = metadata;

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

    let uploadedMediaUrl: string | null = null;
    if (referenceMode === "upload" && file) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: storageError } = await supabase.storage
        .from("user-uploads")
        .upload(path, buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
      if (storageError) throw new Error(storageError.message);
      const { data: urlData } = supabase.storage
        .from("user-uploads")
        .getPublicUrl(path);
      uploadedMediaUrl = urlData.publicUrl;
    }

    const noteParts: string[] = [];
    if (metal && metal !== "unsure") noteParts.push(`Metal: ${metal}`);
    if (occasion) noteParts.push(`Occasion: ${occasion}`);
    if (designNotes?.trim()) noteParts.push(designNotes.trim());

    const { error: requestError } = await supabase
      .from("custom_requests")
      .insert({
        lead_id: lead.id,
        request_type: referenceMode === "url" ? "external_link" : "direct_upload",
        external_url: referenceMode === "url" ? (referenceUrl ?? null) : null,
        uploaded_media_url: uploadedMediaUrl,
        design_notes: noteParts.length > 0 ? noteParts.join("\n") : null,
      });
    if (requestError) throw new Error(requestError.message);

    sendNotificationEmail({
      fullName,
      whatsapp,
      email: email ?? undefined,
      requestType: referenceMode === "url" ? "external_link" : "direct_upload",
      designNotes: noteParts.length > 0 ? noteParts.join("\n") : undefined,
      referenceUrl: referenceMode === "url" ? referenceUrl : undefined,
    }).catch((err) => console.error("[submit-request] Email error:", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-request]", err);
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
