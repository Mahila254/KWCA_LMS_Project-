/**
 * Saves the certificate on the page as an A4 landscape PDF file: the
 * certificate element is drawn to an image (html-to-image, which also
 * carries over the fonts and the savanna artwork) and placed full page in
 * a PDF (jsPDF). Both libraries load only when someone clicks Download.
 */

// Wide enough to print sharply on A4 (297 mm ≈ 2400 px is ~200 dpi).
const TARGET_WIDTH_PX = 2400;

export function certificateFileName(courseTitle: string, learnerName: string) {
  const slug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

  return `KWCA-certificate-${slug(courseTitle) || "course"}-${slug(learnerName) || "learner"}.pdf`;
}

export async function downloadCertificatePdf(element: HTMLElement, fileName: string) {
  const [{ toJpeg }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);

  const width = element.offsetWidth;
  const height = element.offsetHeight;

  // JPEG keeps the file small; the artwork's paper grain makes PNG huge.
  const image = await toJpeg(element, {
    quality: 0.92,
    pixelRatio: TARGET_WIDTH_PX / width,
    width,
    height,
    backgroundColor: "#fbf3e4",
    cacheBust: true,
    // The page shows it with rounded corners and a shadow; paper has neither.
    style: { borderRadius: "0", boxShadow: "none", margin: "0" },
  });

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  pdf.addImage(image, "JPEG", 0, 0, 297, 210);
  pdf.setProperties({ title: fileName.replace(/\.pdf$/, ""), creator: "KWCA Learning Hub" });
  pdf.save(fileName);
}
