// Names and the base URL used in page titles and link previews.

export const SITE_NAME = "KWCA Learning Hub";

export const SITE_DESCRIPTION =
  "Practical online courses for Kenya's conservancy leaders, rangers and communities: governance, management, revenue, carbon and more, from the Kenya Wildlife Conservancies Association.";

// Link previews need absolute image URLs. NEXT_PUBLIC_SITE_URL wins (set it
// when a custom domain is added); on Vercel the production domain is used.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Trims text to a search-result sized description. */
export function toDescription(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/[\s,.;:]+\S*$/, "")}…`;
}
