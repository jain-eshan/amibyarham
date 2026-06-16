// Helpers for parsing / serialising pgvector payloads.
//
// PostgREST returns `vector` columns as the literal string `'[0.1,0.2,...]'`
// (Postgres' native text format). We parse it once on the server, do the
// vector math in plain JS, then re-serialise the taste vector back into the
// same shape so it round-trips cleanly through the `match_inspiration` RPC.

export const EMBEDDING_DIM = 512;

export function parseEmbedding(value: string | number[] | null | undefined): number[] | null {
  if (!value) return null;
  try {
    const arr = Array.isArray(value)
      ? (value as unknown)
      : (JSON.parse(value as string) as unknown);
    if (!Array.isArray(arr) || arr.length !== EMBEDDING_DIM) return null;
    // JSON.parse already returns numbers; coerce defensively to drop bad shapes.
    const out = new Array<number>(EMBEDDING_DIM);
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      const v = arr[i];
      if (typeof v !== "number" || !Number.isFinite(v)) return null;
      out[i] = v;
    }
    return out;
  } catch {
    return null;
  }
}

export function serializeEmbedding(vec: number[]): string {
  return `[${vec.join(",")}]`;
}

/** Element-wise mean of a set of equal-length vectors. */
export function meanVector(vectors: number[][]): number[] | null {
  if (vectors.length === 0) return null;
  const sum = new Array<number>(EMBEDDING_DIM).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < EMBEDDING_DIM; i++) sum[i] = (sum[i] ?? 0) + (v[i] ?? 0);
  }
  for (let i = 0; i < EMBEDDING_DIM; i++) sum[i] = (sum[i] ?? 0) / vectors.length;
  return sum;
}

/**
 * Taste vector: pull toward the centroid of liked embeddings, push away from
 * the centroid of disliked ones. The 0.4 weight is the conservative default
 * from the discovery plan — strong enough to register negative signal but not
 * so strong it overwhelms a small "liked" set.
 */
export function tasteVector(
  liked: number[][],
  disliked: number[][],
  dislikedWeight = 0.4,
): number[] | null {
  const likedMean = meanVector(liked);
  if (!likedMean) return null; // skip disliked term until ≥1 like
  const dislikedMean = meanVector(disliked);
  if (!dislikedMean) return likedMean;
  const out = new Array<number>(EMBEDDING_DIM);
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    out[i] = (likedMean[i] ?? 0) - dislikedWeight * (dislikedMean[i] ?? 0);
  }
  return out;
}
