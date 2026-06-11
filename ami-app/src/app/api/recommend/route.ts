// /api/recommend — taste-vector + pgvector recommender.
//
// Request:
//   POST { sessionId, likedIds[], dislikedIds[], seenIds[], limit? }
//
// Server flow:
//   1. Service-role fetch embeddings for liked + disliked ids.
//   2. Compute the taste vector in JS (mean(liked) − 0.4 * mean(disliked)).
//   3. Hand it to the `match_inspiration` RPC with `seenIds` excluded.
//   4. Return the ranked unseen approved cards. The raw `embedding` column is
//      never included in the response payload.
//
// Cold start / fallback: if there are no usable liked embeddings the route
// returns `{ items: [] }` so the client keeps its server-ordered diverse deck.

import { NextResponse } from "next/server";
import { z } from "zod";

import {
  EMBEDDING_DIM,
  parseEmbedding,
  serializeEmbedding,
  tasteVector,
} from "@/lib/embedding";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import type { InspirationItem } from "@/lib/inspiration";

export const runtime = "nodejs";

const bodySchema = z.object({
  sessionId: z.string().uuid(),
  likedIds: z.array(z.string().uuid()).default([]),
  dislikedIds: z.array(z.string().uuid()).default([]),
  seenIds: z.array(z.string().uuid()).default([]),
  limit: z.number().int().min(1).max(60).default(30),
});

type RecommendItem = Omit<
  InspirationItem,
  "glyph" | "gradient" | "isFromDb"
> & { similarity: number };

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (parsed.likedIds.length === 0) {
    return NextResponse.json({ items: [] satisfies RecommendItem[] });
  }

  let supabase;
  try {
    supabase = createSupabaseServiceRoleClient();
  } catch {
    // Service-role key not configured — surface as cold-start fallback rather
    // than a 500 so the SwipeEngine simply keeps the diverse deck.
    return NextResponse.json({ items: [] satisfies RecommendItem[] });
  }

  const interestingIds = [...parsed.likedIds, ...parsed.dislikedIds];
  const { data: rows, error: fetchError } = await supabase
    .from("inspiration_images")
    .select("id, embedding")
    .in("id", interestingIds);
  if (fetchError) {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }

  const byId = new Map<string, number[]>();
  for (const row of rows ?? []) {
    const vec = parseEmbedding(row.embedding);
    if (vec) byId.set(row.id, vec);
  }

  const liked = parsed.likedIds
    .map((id) => byId.get(id))
    .filter((v): v is number[] => Array.isArray(v) && v.length === EMBEDDING_DIM);
  const disliked = parsed.dislikedIds
    .map((id) => byId.get(id))
    .filter((v): v is number[] => Array.isArray(v) && v.length === EMBEDDING_DIM);

  const taste = tasteVector(liked, disliked);
  if (!taste) {
    return NextResponse.json({ items: [] satisfies RecommendItem[] });
  }

  const { data: matches, error: rpcError } = await supabase.rpc(
    "match_inspiration",
    {
      query: serializeEmbedding(taste),
      exclude_ids: parsed.seenIds,
      match_limit: parsed.limit,
    },
  );
  if (rpcError) {
    return NextResponse.json({ error: "match_failed" }, { status: 500 });
  }

  const items: RecommendItem[] = (matches ?? []).map((m) => ({
    id: m.id,
    imageUrl: m.image_url,
    altText: m.alt_text ?? "Inspiration",
    category: m.category,
    jewelryType: m.jewelry_type,
    occasions: m.occasions ?? [],
    metals: m.metals ?? [],
    styles: m.styles ?? [],
    stones: m.stones ?? [],
    motif: m.motif ?? [],
    sourceName: m.source_name,
    sourceUrl: m.source_url,
    attribution: m.attribution,
    // Smart-Onboarding facets are not yet plumbed through the recommend RPC —
    // re-ranked cards arrive with empty/null values and pass the new filters.
    metalColors: [],
    diamondShapes: [],
    caratWeight: null,
    karatage: [],
    itemWeightGrams: null,
    priceInr: null,
    certifications: [],
    similarity: m.similarity,
  }));

  return NextResponse.json({ items });
}
