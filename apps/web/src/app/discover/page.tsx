import type { Metadata } from "next";

import { getInspirationDeck } from "@/lib/inspiration";

import { DiscoverFlow } from "./DiscoverFlow";

export const metadata: Metadata = {
  title: "Discover Inspiration",
  description:
    "Swipe through curated jewellery inspiration — polki, jadau, diamonds, and gold. Save what you love and send AMI your board for a feasibility reply within 24 hours.",
  alternates: { canonical: "/discover" },
};

// The deck is sourced fresh per request so newly curated images appear without
// a rebuild. Keep dynamic to avoid caching an empty deck at build time.
export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const deck = await getInspirationDeck();

  return (
    <main className="bg-canvas">
      <DiscoverFlow deck={deck} />
    </main>
  );
}
