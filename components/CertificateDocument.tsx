"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Download,
  Printer,
  ArrowLeft,
  ShieldCheck,
  BadgeCheck,
  ExternalLink,
  Loader2,
} from "lucide-react";
import CertificateArt from "@/components/CertificateArt";
import type { CertificateDesign } from "@/lib/certificateDesigns";
import {
  certificateFileName,
  downloadCertificatePdf,
} from "@/lib/downloadCertificatePdf";

export type CertificateDocumentProps = {
  learnerName: string;
  courseTitle: string;
  certificateCode: string;
  completionDate: string;
  /** The savanna scene behind the card; each course has its own. */
  design: CertificateDesign;
  /** Where the back links (hero + actions bar) should point. */
  backHref: string;
  /** Label for the back links, e.g. "Back to Course" or "Back to Certificates". */
  backLabel: string;
  /** Hide the "Verify Certificate" link — used on the public verification-adjacent flows. */
  showVerifyLink?: boolean;
};

// The certificate visual itself (print stylesheet, hero, action bar,
// certificate, and info cards). Kept as a standalone component so the
// learner-facing certificate page and the admin certificate viewer can both
// render an identical certificate while pointing their "back" links and
// surrounding navigation at different places.
//
// The certificate is drawn at A4 landscape proportions and sized in
// container units (cqw), so it scales as one piece: on screen at any width,
// and at exactly 297 x 210 mm when printed. Its colours are fixed rather
// than theme colours, so it looks the same in dark mode and on paper.
export default function CertificateDocument({
  learnerName,
  courseTitle,
  certificateCode,
  completionDate,
  design,
  backHref,
  backLabel,
  showVerifyLink = true,
}: CertificateDocumentProps) {
  const sheetRef = useRef<HTMLElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  function handlePrintCertificate() {
    window.print();
  }

  async function handleDownloadPdf() {
    if (!sheetRef.current) return;
    setDownloading(true);
    setDownloadError(null);

    try {
      await downloadCertificatePdf(
        sheetRef.current,
        certificateFileName(courseTitle, learnerName)
      );
    } catch (error) {
      console.error("Certificate PDF error:", error);
      setDownloadError(
        "The PDF couldn't be made in this browser. Use Print and choose \"Save as PDF\" instead."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }

          html,
          body {
            width: 297mm;
            height: 210mm;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white !important;
          }

          nav,
          footer,
          header,
          .print-hidden,
          .certificate-page-hero,
          .certificate-actions,
          .certificate-info-section {
            display: none !important;
          }

          main {
            display: block !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            animation: none !important;
          }

          .certificate-sheet {
            position: fixed !important;
            inset: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            min-width: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .certificate-sheet,
          .certificate-sheet * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <main className="min-h-screen bg-gray-50 text-ink print:min-h-0 print:bg-white">
        <section className="certificate-page-hero relative overflow-hidden px-6 py-14 print:hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/conservancy-training.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-surface/72" />

          <div className="absolute inset-0 bg-gradient-to-b from-tint/90 via-surface/85 to-gray-50" />

          <div className="relative mx-auto max-w-6xl">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 font-bold text-ink"
            >
              <ArrowLeft size={18} />
              {backLabel}
            </Link>

            <div className="mt-8 max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-ink shadow-sm">
                <BadgeCheck size={16} className="text-accent" />
                KWCA LMS Certificate
              </span>

              <h1 className="mt-5 text-5xl font-extrabold leading-tight md:text-6xl">
                Course Completion Certificate
              </h1>

              <p className="mt-5 max-w-3xl text-xl leading-8 text-gray-600">
                This certificate confirms successful course completion and
                passing of the final graded quiz.
              </p>
            </div>
          </div>
        </section>

        <section className="certificate-actions mx-auto max-w-6xl px-6 py-10 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-xl border bg-surface px-6 py-3 font-bold hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              {backLabel}
            </Link>

            <div className="flex flex-wrap gap-4">
              {showVerifyLink && (
                <Link
                  href={`/verify-certificate?code=${certificateCode}`}
                  className="inline-flex items-center gap-2 rounded-xl border bg-surface px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <ShieldCheck size={18} />
                  Verify Certificate
                </Link>
              )}

              <button
                type="button"
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-2 rounded-xl border bg-surface px-6 py-3 font-bold hover:bg-gray-50"
              >
                <Printer size={18} />
                Print
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
              >
                {downloading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                {downloading ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>
          </div>

          {downloadError && (
            <p role="alert" className="mt-4 text-right text-sm font-semibold text-red-700">
              {downloadError}
            </p>
          )}
        </section>

        <section className="certificate-print-area mx-auto max-w-6xl px-6 pb-12 print:p-0">
          {/* Phones scroll sideways rather than shrink the text to nothing. */}
          <div className="overflow-x-auto pb-2 print:overflow-visible print:pb-0">
            <article
              ref={sheetRef}
              aria-label={`Certificate of completion: ${courseTitle}, awarded to ${learnerName}`}
              className="certificate-sheet @container relative mx-auto aspect-[297/210] min-w-[640px] overflow-hidden rounded-2xl bg-[#fbf3e4] shadow-xl"
            >
              <CertificateArt design={design} />

              <div className="absolute inset-x-[13%] inset-y-[8.5%] flex flex-col items-center justify-center rounded-[2.2cqw] bg-[#fffcf6] px-[6cqw] text-center text-[#2a1810] shadow-[0_0.6cqw_2.4cqw_rgba(31,21,16,0.28)]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[1cqw] rounded-[1.5cqw] border border-[#c9923f]/45"
                />

                <p className="text-[1.25cqw] font-extrabold uppercase tracking-[0.34em]">
                  Certificate of Completion
                </p>

                <h2 className="mt-[1.4cqw] max-w-[58cqw] text-balance font-serif text-[4.6cqw] leading-[1.02]">
                  {courseTitle}
                </h2>

                <p className="mt-[1.8cqw] text-[1.45cqw] tracking-wide text-[#4a3326]">
                  This certificate of completion is awarded to
                </p>

                <p className="mt-[1.6cqw] font-serif text-[3.7cqw] leading-none text-[#1f1510]">
                  {learnerName}
                </p>

                <p className="mt-[1.6cqw] text-[1.5cqw] tracking-wide text-[#4a3326]">
                  by the KWCA Conservancies Learning Hub
                </p>

                <div
                  aria-hidden="true"
                  className="mt-[1.4cqw] flex items-center gap-[0.5cqw]"
                >
                  {[0.7, 0.7, 2.4, 0.7, 0.7].map((width, i) => (
                    <span
                      key={i}
                      className="h-[0.16cqw] bg-[#a7462a]"
                      style={{ width: `${width}cqw` }}
                    />
                  ))}
                </div>

                <p className="mt-[1.4cqw] text-[1.35cqw] text-[#4a3326]">
                  Issued on this day,
                </p>

                <p className="mt-[0.5cqw] text-[1.2cqw] font-semibold">
                  {completionDate}
                </p>

                <div className="mt-[2.2cqw] flex items-center gap-[2.6cqw]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="Kenya Wildlife Conservancies Foundation"
                    className="h-[4.4cqw] w-auto"
                  />
                  <span
                    aria-hidden="true"
                    className="h-[4cqw] w-px bg-[#c9923f]/60"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/kwca-logo.png"
                    alt="Kenya Wildlife Conservancies Association"
                    className="h-[5.2cqw] w-auto"
                  />
                </div>

                <p className="absolute bottom-[2cqw] left-0 right-0 text-[0.85cqw] tracking-wide text-[#7a5a48]">
                  Certificate ID {certificateCode} · Verify it with this ID on
                  the KWCA Learning Hub website
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="certificate-info-section mx-auto max-w-6xl px-6 pb-20 print:hidden">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              icon={<BadgeCheck size={28} />}
              title="Verified Completion"
              description="This certificate is linked to the learner profile and course completion record."
            />

            <InfoCard
              icon={<ShieldCheck size={28} />}
              title="Certificate ID"
              description={`Use ${certificateCode} to verify this certificate later.`}
            />

            <InfoCard
              icon={<ExternalLink size={28} />}
              title="Shareable Proof"
              description="Learners can print, download, or verify this certificate for records."
            />
          </div>
        </section>
      </main>
    </>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl bg-surface p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-tint text-ink">
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-7 text-gray-600">{description}</p>
    </div>
  );
}
