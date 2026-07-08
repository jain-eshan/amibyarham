import { PageLoader } from "@/components/PageLoader";

// /discover is force-dynamic (the deck is fetched per request), so this is
// the route where a visible loading state matters most.
export default function DiscoverLoading() {
  return <PageLoader words={["Curating", "Arranging", "Polishing"]} />;
}
