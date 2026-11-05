/**
 * The savanna scenes behind a certificate (drawn in
 * components/CertificateArt.tsx). Each course gets its own scene, in the
 * order courses were created, so neighbouring courses never share one.
 * The wording and layout on top are the same for every course.
 */
export const CERTIFICATE_DESIGNS = [
  "savanna-dusk",
  "baobab-morning",
  "patterned-dunes",
  "sun-disc",
] as const;

export type CertificateDesign = (typeof CERTIFICATE_DESIGNS)[number];

/** The scene for the course created `courseIndex`-th (0 = first course). */
export function certificateDesignFor(courseIndex: number): CertificateDesign {
  const count = CERTIFICATE_DESIGNS.length;
  return CERTIFICATE_DESIGNS[((courseIndex % count) + count) % count];
}
