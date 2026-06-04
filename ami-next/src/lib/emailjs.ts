const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

if (!serviceId) throw new Error("Missing NEXT_PUBLIC_EMAILJS_SERVICE_ID");
if (!templateId) throw new Error("Missing NEXT_PUBLIC_EMAILJS_TEMPLATE_ID");
if (!publicKey) throw new Error("Missing NEXT_PUBLIC_EMAILJS_PUBLIC_KEY");
if (!whatsappNumber) throw new Error("Missing NEXT_PUBLIC_WHATSAPP_NUMBER");
if (!/^\d{8,15}$/.test(whatsappNumber))
  throw new Error("NEXT_PUBLIC_WHATSAPP_NUMBER must be digits only (country code included)");

export const EMAILJS_CONFIG = { serviceId, templateId, publicKey };
export const WHATSAPP_NUMBER = whatsappNumber;
