import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { SITE_URL } from "@/lib/site";

// The picture WhatsApp, Facebook, LinkedIn and X show under a shared link.
// Used by app/opengraph-image.tsx (whole site) and
// app/courses/[slug]/opengraph-image.tsx (one per course).

export const shareCardSize = { width: 1200, height: 630 };
// JPEG, not the renderer's PNG: a photo card as PNG is ~800 KB, and
// WhatsApp quietly drops preview pictures much over 300 KB.
export const shareCardContentType = "image/jpeg";

const NAVY = "#1E1D59";
const PINK = "#F0A8C4";

/** A file from /public as a data URL, falling back to fetching it. */
async function publicFile(path: string, type: string) {
  try {
    const data = await readFile(join(process.cwd(), "public", path));
    return `data:${type};base64,${data.toString("base64")}`;
  } catch {
    return `${SITE_URL}/${path}`;
  }
}

/**
 * The platform's own fonts, as TTF (the image renderer can't read the
 * WOFF2 files browsers get). If Google Fonts can't be reached the card
 * still renders, in the renderer's default font.
 */
async function googleFont(query: string) {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${query}`).then(
      (res) => res.text()
    );
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function renderShareCard({
  eyebrow,
  title,
  accent,
  footnote,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  footnote: string;
}) {
  const [photo, logo, sans, serif] = await Promise.all([
    publicFile("images/hero-conservancy.jpg", "image/jpeg"),
    publicFile("logo-white.png", "image/png"),
    googleFont("Hanken+Grotesk:wght@800"),
    googleFont("Instrument+Serif:ital@1"),
  ]);

  const fonts = [
    ...(sans ? [{ name: "Hanken Grotesk", data: sans, weight: 800 as const, style: "normal" as const }] : []),
    ...(serif ? [{ name: "Instrument Serif", data: serif, weight: 400 as const, style: "italic" as const }] : []),
  ];

  // Long course names step down in size so they stay on three lines.
  const titleSize = title.length > 70 ? 54 : title.length > 42 ? 64 : 76;

  const card = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: NAVY,
          fontFamily: "Hanken Grotesk",
          color: "white",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover", objectPosition: "70% 75%" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, rgba(20,18,61,0.96) 0%, rgba(30,29,89,0.86) 46%, rgba(30,29,89,0.2) 78%, rgba(30,29,89,0) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            width: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={160} height={72} style={{ width: 160, height: 72, objectFit: "contain", objectPosition: "left" }} />

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: PINK }}>
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: 18,
                fontSize: titleSize,
                lineHeight: 1.04,
                letterSpacing: -1.5,
              }}
            >
              <span>{title}</span>
              {accent && (
                <span style={{ width: "100%", fontFamily: "Instrument Serif", fontStyle: "italic", color: PINK }}>
                  {accent}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24 }}>
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                color: NAVY,
                borderRadius: 999,
                padding: "12px 26px",
              }}
            >
              Conservancies Learning Hub
            </div>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.78)" }}>{footnote}</div>
          </div>
        </div>
      </div>
    ),
    { ...shareCardSize, fonts: fonts.length ? fonts : undefined }
  );

  const jpeg = await sharp(Buffer.from(await card.arrayBuffer()))
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": shareCardContentType,
      // Sharing apps fetch the card once per link; a day is plenty fresh
      // for a renamed course.
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
