/**
 * Fires a Meta Pixel `Lead` conversion. No-op when the pixel isn't loaded
 * (NEXT_PUBLIC_META_PIXEL_ID unset) so forms never depend on the ad script.
 */
export function trackLead(contentName: string) {
  if (typeof window === "undefined") return;
  const fbq = (window as { fbq?: (...args: unknown[]) => void }).fbq;
  fbq?.("track", "Lead", { content_name: contentName });
}
