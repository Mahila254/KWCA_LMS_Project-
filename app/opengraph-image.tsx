import { renderShareCard, shareCardContentType, shareCardSize } from "@/lib/shareCard";

export const alt = "Conservancies Learning Hub: years of conservancy wisdom, now one click away";
export const size = shareCardSize;
export const contentType = shareCardContentType;

export default function Image() {
  return renderShareCard({
    eyebrow: "Kenya Wildlife Conservancies Association",
    title: "Years of conservancy wisdom.",
    accent: "Now one click away.",
    footnote: "Free to start · Learn on any phone",
  });
}
