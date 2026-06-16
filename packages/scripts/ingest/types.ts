/**
 * A single piece of jewelry inspiration collected from a source lane, before
 * enrichment. Each lane's collector returns these; the shared pipeline handles
 * dedup → download → enrich → upload → insert from here, so adding a new lane
 * only means producing `SourceCandidate[]`.
 */
export type SourceCandidate = {
  /** Direct URL to the image binary. */
  imageUrl: string;
  /** Canonical page the image came from (pin / product / photo page). */
  sourceUrl: string;
  /** Human label for the origin — brand name, "Unsplash", board name. */
  sourceName: string;
  /** Attribution string stored on the row (brand / pinner / photographer). */
  attribution: string;
  /** Alt text / product title, if the source provided one. */
  altText: string | null;
  /** Per-lane licensing posture. */
  licenseStatus: "unknown" | "editorial" | "licensed";
  /** Native category string from the source, pre-mapping (e.g. "Necklaces"). */
  nativeCategory: string | null;
  /** Native material string from the source, pre-mapping (e.g. "18k gold"). */
  nativeMaterial: string | null;
  /** True only for our own pieces (never set by external scrape lanes). */
  isOwnCatalog?: boolean;
};

/** Response shape from the CLIP worker's /enrich endpoint. */
export type EnrichResult = {
  embedding: number[];
  phash: string;
  jewelry_type: string | null;
  metal: string[];
  styles: string[];
  stones: string[];
  motif: string[];
  occasions: string[];
};

export type IngestStats = {
  seen: number;
  inserted: number;
  skippedDuplicate: number;
  failed: number;
};
