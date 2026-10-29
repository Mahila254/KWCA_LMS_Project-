import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Hanken Grotesk is the everyday face (body, headings, buttons).
// Instrument Serif is only for the italic accent words in big headlines.
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages set a short title ("Courses"); the template adds the site name.
  title: {
    default: "KWCA Conservancies Learning Hub",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // The preview picture comes from app/opengraph-image.tsx (and the
  // course-specific one under app/courses/[slug]). No title here: sharing
  // apps then fall back to each page's own <title> and description.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E1D59",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
