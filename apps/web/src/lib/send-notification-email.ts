import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const TYPE_LABELS: Record<string, string> = {
  swipe_board: "Swipe Board",
  external_link: "Reference Link",
  direct_upload: "Image Upload",
};

export interface NotificationPayload {
  fullName: string;
  whatsapp: string;
  email?: string;
  requestType: string;
  designNotes?: string;
  referenceUrl?: string;
  favoriteCount?: number;
}

export async function sendNotificationEmail(
  payload: NotificationPayload,
): Promise<void> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.warn(
      "[notify] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email.",
    );
    return;
  }

  const {
    fullName,
    whatsapp,
    email,
    requestType,
    designNotes,
    referenceUrl,
    favoriteCount,
  } = payload;

  const typeLabel = TYPE_LABELS[requestType] ?? requestType;
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const rows: Array<{ label: string; value: string }> = [
    { label: "Name", value: escapeHtml(fullName) },
    {
      label: "WhatsApp",
      value: `<a href="https://wa.me/91${escapeHtml(whatsapp)}" style="color:#9b6b4b;">+91 ${escapeHtml(whatsapp)}</a>`,
    },
  ];

  if (email) {
    rows.push({
      label: "Email",
      value: `<a href="mailto:${escapeHtml(email)}" style="color:#9b6b4b;">${escapeHtml(email)}</a>`,
    });
  }

  rows.push({ label: "Type", value: escapeHtml(typeLabel) });

  if (referenceUrl) {
    rows.push({
      label: "Reference",
      value: `<a href="${escapeHtml(referenceUrl)}" style="color:#9b6b4b;">${escapeHtml(referenceUrl)}</a>`,
    });
  }

  if (favoriteCount !== undefined) {
    rows.push({
      label: "Favourites",
      value: `${favoriteCount} item${favoriteCount === 1 ? "" : "s"}`,
    });
  }

  if (designNotes) {
    rows.push({
      label: "Notes",
      value: `<span style="white-space:pre-wrap;">${escapeHtml(designNotes)}</span>`,
    });
  }

  rows.push({ label: "Received", value: `${timestamp} IST` });

  const tableRows = rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 0;font-weight:600;width:110px;vertical-align:top;">${r.label}</td><td style="padding:8px 0;">${r.value}</td></tr>`,
    )
    .join("");

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Submission</title></head>
<body style="font-family:sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="margin-top:0;color:#9b6b4b;">New ${escapeHtml(typeLabel)} submission — AMI by Arham</h2>
  <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />
  <p style="font-size:12px;color:#999;">Sent automatically when a customer submits a board or reference.</p>
</body>
</html>
  `.trim();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailAppPassword },
  });

  await transporter.sendMail({
    from: gmailUser,
    to: "amibyarham@gmail.com",
    subject: `New ${typeLabel} from ${fullName} — AMI by Arham`,
    html: htmlBody,
  });
}
