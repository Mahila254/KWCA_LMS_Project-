import type { NextConfig } from "next";

// Sent with every page. (Vercel already adds Strict-Transport-Security.)
const securityHeaders = [
  // Nobody else's site may show ours inside a frame (stops "clickjacking").
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Browsers must trust the file type we send, not guess it.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites learn which site a visitor came from, never which page.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The platform never needs these, so no page or embed may ask for them.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
