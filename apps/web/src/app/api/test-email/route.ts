import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    return NextResponse.json({
      error: "Missing env vars",
      hasGmailUser: !!gmailUser,
      hasGmailAppPassword: !!gmailAppPassword,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });

    await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      subject: "AMI test email — if you see this, Gmail is working",
      text: "This is a test from the AMI submission system.",
    });

    return NextResponse.json({ success: true, sentTo: gmailUser });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : String(err),
      gmailUser,
    });
  }
}
