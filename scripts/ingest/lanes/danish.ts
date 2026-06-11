/**
 * Lane B — Danish/Scandinavian brand catalogs (structured crawl).
 *
 * These brands expose schema.org `Product` JSON-LD on each product page, so we
 * pull clean structured data (name, image, material, brand) instead of guessing
 * from pixels. Flow per brand:
 *
 *   sitemap.xml (recurse through sitemap indexes)
 *     → product URLs (filtered by the brand's URL pattern)
 *       → fetch page, extract <script type="application/ld+json">
 *         → find the Product node → SourceCandidate
 *
 * Politeness: real User-Agent, throttled between requests (clients.politeFetch
 * + REQUEST_DELAY_MS). Respect each brand's robots.txt before enabling it for a
 * real run — these defaults are a starting point, not a clearance.
 */

import { politeFetch, REQUEST_DELAY_MS, sleep } from "../clients";
import type { SourceCandidate } from "../types";

export type BrandConfig = {
  name: string;
  origin: string;
  /** Where to start. Most Shopify brands expose /sitemap.xml as an index. */
  sitemapUrl: string;
  /** Only crawl URLs whose path matches this (product detail pages). */
  productPattern: RegExp;
};

/** Common Shopify sitemap paths to try when the primary sitemapUrl 404s. */
function sitemapFallbacks(origin: string): string[] {
  return [
    `${origin}/sitemap_products_1.xml`,
    `${origin}/sitemap_products.xml`,
    `${origin}/sitemap_index.xml`,
  ];
}

// Best-effort defaults (many of these run on Shopify → /products/ + sitemap
// index at /sitemap.xml). Verify robots.txt + adjust patterns per brand before
// a production run.
export const DANISH_BRANDS: BrandConfig[] = [
  {
    name: "Enamel Copenhagen",
    origin: "https://www.enamelcopenhagen.com",
    sitemapUrl: "https://www.enamelcopenhagen.com/sitemap.xml",
    productPattern: /\/products\//,
  },
  {
    name: "Pernille Corydon",
    origin: "https://pernillecorydon.com",
    sitemapUrl: "https://pernillecorydon.com/sitemap.xml",
    productPattern: /\/products\//,
  },
  {
    name: "Trine Tuxen",
    origin: "https://trinetuxen.com",
    sitemapUrl: "https://trinetuxen.com/sitemap.xml",
    productPattern: /\/products\//,
  },
  {
    name: "Sophie Bille Brahe",
    origin: "https://sophiebillebrahe.com",
    sitemapUrl: "https://sophiebillebrahe.com/sitemap.xml",
    productPattern: /\/products\//,
  },
  {
    name: "Kinraden",
    origin: "https://kinraden.com",
    sitemapUrl: "https://kinraden.com/sitemap.xml",
    productPattern: /\/products\//,
  },
];

const LOC_RE = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
const JSONLD_RE =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function extractLocs(xml: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = LOC_RE.exec(xml)) !== null) {
    if (m[1]) out.push(m[1].trim());
  }
  return out;
}

/**
 * Walk a sitemap (recursing through sitemap-index files) and return product
 * URLs matching the brand pattern, capped at `maxProducts`.
 */
async function collectProductUrls(
  brand: BrandConfig,
  maxProducts: number,
): Promise<string[]> {
  const products = new Set<string>();
  const queue = [brand.sitemapUrl];
  const visited = new Set<string>();
  let triedFallbacks = false;

  while (queue.length > 0 && products.size < maxProducts) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    let xml: string;
    try {
      xml = await (await politeFetch(url)).text();
    } catch (err) {
      console.error(
        `[danish] sitemap ${url} failed:`,
        err instanceof Error ? err.message : err,
      );
      // If the primary sitemap failed and we haven't tried fallbacks yet,
      // queue common Shopify sitemap paths.
      if (!triedFallbacks && url === brand.sitemapUrl) {
        triedFallbacks = true;
        const fallbacks = sitemapFallbacks(brand.origin);
        console.log(`[danish]   trying ${fallbacks.length} fallback sitemap path(s)…`);
        queue.push(...fallbacks);
      }
      continue;
    }
    await sleep(REQUEST_DELAY_MS);

    const isIndex = /<sitemapindex/i.test(xml);
    const locs = extractLocs(xml);
    for (const loc of locs) {
      if (isIndex) {
        // Only descend into sub-sitemaps that plausibly hold products.
        if (/product/i.test(loc) || !/(page|blog|collection|article)/i.test(loc)) {
          queue.push(loc);
        }
      } else if (brand.productPattern.test(loc)) {
        products.add(loc);
        if (products.size >= maxProducts) break;
      }
    }
  }

  return [...products].slice(0, maxProducts);
}

type JsonLdNode = Record<string, unknown>;

function flattenNodes(parsed: unknown): JsonLdNode[] {
  if (Array.isArray(parsed)) return parsed.flatMap(flattenNodes);
  if (parsed && typeof parsed === "object") {
    const node = parsed as JsonLdNode;
    const graph = node["@graph"];
    if (Array.isArray(graph)) return graph.flatMap(flattenNodes);
    return [node];
  }
  return [];
}

function isProduct(node: JsonLdNode): boolean {
  const t = node["@type"];
  if (typeof t === "string") return t.toLowerCase() === "product";
  if (Array.isArray(t)) return t.some((x) => String(x).toLowerCase() === "product");
  return false;
}

function firstImage(image: unknown): string | null {
  if (typeof image === "string") return image;
  if (Array.isArray(image) && image.length > 0) return firstImage(image[0]);
  if (image && typeof image === "object") {
    const url = (image as JsonLdNode)["url"];
    if (typeof url === "string") return url;
  }
  return null;
}

function asText(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const name = (value as JsonLdNode)["name"];
    if (typeof name === "string") return name;
  }
  return null;
}

function parseProduct(
  html: string,
  pageUrl: string,
  brand: BrandConfig,
): SourceCandidate | null {
  let m: RegExpExecArray | null;
  while ((m = JSONLD_RE.exec(html)) !== null) {
    const raw = m[1];
    if (!raw) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      continue; // some sites emit invalid/templated JSON-LD; skip it
    }
    const product = flattenNodes(parsed).find(isProduct);
    if (!product) continue;

    const imageUrl = firstImage(product["image"]);
    if (!imageUrl) continue;

    const brandName = asText(product["brand"]) ?? brand.name;
    return {
      imageUrl,
      sourceUrl: pageUrl,
      sourceName: brandName,
      attribution: brandName,
      altText: asText(product["name"]),
      licenseStatus: "editorial", // brand-owned imagery
      nativeCategory: asText(product["category"]),
      nativeMaterial: asText(product["material"]),
    };
  }
  return null;
}

export type DanishOptions = {
  /** Restrict to one brand by name (case-insensitive). */
  brand?: string;
  /** Max product pages to crawl per brand. */
  maxProducts?: number;
};

/** Collect SourceCandidates across the configured Danish brands. */
export async function collectDanish(
  opts: DanishOptions = {},
): Promise<SourceCandidate[]> {
  const maxProducts = opts.maxProducts ?? 25;
  const brands = opts.brand
    ? DANISH_BRANDS.filter(
        (b) => b.name.toLowerCase() === opts.brand!.toLowerCase(),
      )
    : DANISH_BRANDS;

  if (brands.length === 0) {
    console.error(`[danish] no brand matches "${opts.brand}"`);
    return [];
  }

  const candidates: SourceCandidate[] = [];
  for (const brand of brands) {
    console.log(`[danish] crawling ${brand.name} (≤${maxProducts} products)…`);
    const urls = await collectProductUrls(brand, maxProducts);
    console.log(`[danish]   ${urls.length} product URL(s)`);

    for (const pageUrl of urls) {
      try {
        const html = await (await politeFetch(pageUrl)).text();
        const candidate = parseProduct(html, pageUrl, brand);
        if (candidate) candidates.push(candidate);
        else console.warn(`[danish]   no Product JSON-LD: ${pageUrl}`);
      } catch (err) {
        console.error(
          `[danish]   ${pageUrl} failed:`,
          err instanceof Error ? err.message : err,
        );
      }
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return candidates;
}
