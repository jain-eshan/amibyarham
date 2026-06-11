import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.arhamdiamonds.in";

// Explicitly allow major search + AI crawlers so AMI surfaces in Google,
// Bing, Perplexity, ChatGPT, Claude, Gemini, etc. Admin + API routes are
// kept out of indexing.
export default function robots(): MetadataRoute.Robots {
  const allowAll = {
    allow: "/",
    disallow: ["/api/", "/admin/", "/discover/swipe-state"],
  };

  return {
    rules: [
      { userAgent: "*", ...allowAll },
      // Generative AI bots — opt-in for brand visibility in LLM answers.
      { userAgent: "GPTBot", ...allowAll },
      { userAgent: "OAI-SearchBot", ...allowAll },
      { userAgent: "ChatGPT-User", ...allowAll },
      { userAgent: "ClaudeBot", ...allowAll },
      { userAgent: "Claude-Web", ...allowAll },
      { userAgent: "anthropic-ai", ...allowAll },
      { userAgent: "PerplexityBot", ...allowAll },
      { userAgent: "Perplexity-User", ...allowAll },
      { userAgent: "Google-Extended", ...allowAll },
      { userAgent: "Applebot-Extended", ...allowAll },
      { userAgent: "Bytespider", ...allowAll },
      { userAgent: "CCBot", ...allowAll },
      { userAgent: "Meta-ExternalAgent", ...allowAll },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
