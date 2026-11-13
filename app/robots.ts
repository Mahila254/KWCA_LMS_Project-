import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Tells search engines what to list: the public pages, not the admin
// area, the data endpoints or pages that only make sense signed in.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/dashboard",
        "/profile",
        "/payment-confirmation",
        "/reset-password",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
