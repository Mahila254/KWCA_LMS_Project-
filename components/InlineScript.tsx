"use client";

/**
 * A script that runs once from the server's HTML, before the page paints.
 * In the browser React renders it as text/plain (and doesn't run it again),
 * which also stops React warning about script tags. From the Next.js guide
 * "How to prevent flash before hydration".
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
