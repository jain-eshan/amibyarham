import type { Metadata } from "next";

import { getInspirationDeck } from "@/lib/inspiration";

import { DiscoverFlow } from "./DiscoverFlow";

export const metadata: Metadata = {
  title: "Discover Inspiration — AMI by Arham",
  description:
    "Swipe through the studio's curated catalogue. Save what you love and send us your board.",
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
