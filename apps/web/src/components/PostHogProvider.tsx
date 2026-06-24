"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || !ph) return;

    const url =
      window.location.origin +
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    ph.capture("$pageview", { $current_url: url });

    // Track creator-originated traffic (DM campaign links include ?ref=creator or ?utm_source=creator)
    const ref = searchParams?.get("ref");
    const utmSource = searchParams?.get("utm_source");
    if (ref === "creator" || utmSource === "creator") {
      ph.capture("creator_referral_landing", {
        ref,
        utm_source: utmSource,
        utm_medium: searchParams?.get("utm_medium"),
        utm_campaign: searchParams?.get("utm_campaign"),
        landing_page: pathname,
      });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (typeof window !== "undefined" && posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: false, // manual via PageViewTracker
    capture_pageleave: true,
    person_profiles: "identified_only",
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
