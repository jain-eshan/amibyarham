import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: firstError }, { status: 422 });
  }

  const { name, email, message } = parsed.data;
  const timestamp = new Date().toISOString();

  // ── 1. Insert into Supabase (source of truth) ────────────────────────────
  const supabase = createSupabaseServerClient();
  const { error: dbError } = await supabase
    .from("contact_submissions")
    .insert({ name, email, message });

  if (dbError) {
    console.error("[contact/route] Supabase insert error:", dbError);
    return NextResponse.json(
      { error: "Failed to save your message. Please try again." },
      { status: 500 },
    );
  }

  // ── 2. Send email notification via Gmail SMTP ────────────────────────────
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.warn(
      "[contact/route] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email notification.",
    );
  } else {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Enquiry</title></head>
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="margin-top: 0; color: #9b6b4b;">New enquiry — AMI by Arham</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; font-weight: 600; width: 100px;">Name</td>
      <td style="padding: 8px 0;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600;">Email</td>
      <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #9b6b4b;">${email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Message</td>
      <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600;">Received</td>
      <td style="padding: 8px 0; color: #666;">${new Date(timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
    </tr>
  </table>
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
  <p style="font-size: 12px; color: #999;">Sent via the AMI by Arham contact form.</p>
</body>
</html>
      `.trim();

      await transporter.sendMail({
        from: gmailUser,
        to: "amibyarham@gmail.com",
        subject: `New enquiry from ${name} — AMI by Arham`,
        html: htmlBody,
      });
    } catch (emailError) {
      // Email failure is non-fatal — submission is already persisted in Supabase.
      console.error("[contact/route] Email send error:", emailError);
    }
  }

  // ── 3. Optional Google Sheets webhook ───────────────────────────────────
  const sheetsWebhook = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (sheetsWebhook) {
    try {
      await fetch(sheetsWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, timestamp }),
      });
    } catch (webhookError) {
      console.error("[contact/route] Google Sheets webhook error:", webhookError);
    }
  }

  return NextResponse.json({ success: true });
}
