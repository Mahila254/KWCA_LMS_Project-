"use client";

import Link from "next/link";
import {
  Download,
  Printer,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";

export type CertificateDocumentProps = {
  learnerName: string;
  courseTitle: string;
  certificateCode: string;
  completionDate: string;
  /** Where the back links (hero + actions bar) should point. */
  backHref: string;
  /** Label for the back links, e.g. "Back to Course" or "Back to Certificates". */
  backLabel: string;
  /** Hide the "Verify Certificate" link — used on the public verification-adjacent flows. */
  showVerifyLink?: boolean;
};

// The certificate visual itself (print stylesheet, hero, action bar,
// certificate box, and info cards). Kept as a standalone component so the
// learner-facing certificate page and the admin certificate viewer can both
// render an identical certificate while pointing their "back" links and
// surrounding navigation at different places.
export default function CertificateDocument({
  learnerName,
  courseTitle,
  certificateCode,
  completionDate,
  backHref,
  backLabel,
  showVerifyLink = true,
}: CertificateDocumentProps) {
  function handlePrintCertificate() {
    window.print();
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
            width: 297mm !important;
            height: 210mm !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white !important;
          }

          .certificate-print-area {
            display: block !important;
            position: fixed !important;
            inset: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 6mm !important;
            overflow: hidden !important;
            background: white !important;
          }

          .certificate-print-area > div {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          .certificate-print-box {
            width: 100% !important;
            height: 100% !important;
            padding: 6mm !important;
            border-width: 7px !important;
            border-radius: 0 !important;
          }

          .certificate-inner-box {
            width: 100% !important;
            height: 100% !important;
            padding: 8mm !important;
          }

          .certificate-corner {
            height: 22px !important;
            width: 22px !important;
            border-width: 3px !important;
          }

          .certificate-watermark {
            width: 115mm !important;
            height: 115mm !important;
          }

          .certificate-icon {
            width: 58px !important;
            height: 58px !important;
            margin-bottom: 8px !important;
          }

          .certificate-icon-logo {
            height: 32px !important;
            width: 32px !important;
          }

          .certificate-kicker {
            font-size: 9px !important;
            letter-spacing: 0.32em !important;
          }

          .certificate-divider {
            margin-top: 6px !important;
            gap: 8px !important;
          }

          .certificate-divider-line {
            width: 22px !important;
          }

          .certificate-divider-dot {
            height: 4px !important;
            width: 4px !important;
          }

          .certificate-title {
            margin-top: 10px !important;
            font-size: 30px !important;
            line-height: 1.05 !important;
          }

          .certificate-presented {
            margin-top: 10px !important;
            font-size: 12px !important;
          }

          .certificate-name {
            margin-top: 8px !important;
            padding-bottom: 6px !important;
            font-size: 34px !important;
            line-height: 1.05 !important;
          }

          .certificate-course-label {
            margin-top: 10px !important;
            font-size: 12px !important;
          }

          .certificate-course-title {
            margin-top: 6px !important;
            font-size: 21px !important;
            line-height: 1.12 !important;
          }

          .certificate-status {
            margin-top: 10px !important;
            padding: 7px 12px !important;
            font-size: 11px !important;
          }

          .certificate-details {
            margin-top: 12px !important;
            gap: 10px !important;
          }

          .certificate-details p {
            font-size: 10px !important;
          }

          .certificate-seal {
            margin-top: 10px !important;
            gap: 3px !important;
          }

          .certificate-seal > div {
            height: 42px !important;
            width: 42px !important;
          }

          .certificate-seal p {
            font-size: 7px !important;
            letter-spacing: 0.18em !important;
          }

          .certificate-signatures {
            margin-top: 14px !important;
            gap: 18px !important;
          }

          .certificate-signatures div div {
            width: 165px !important;
          }

          .certificate-signatures p {
            font-size: 11px !important;
          }

          .certificate-note {
            display: none !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-gray-50 text-[#1E1D59] print:min-h-0 print:bg-white">
        <section className="certificate-page-hero relative overflow-hidden px-6 py-14 print:hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/course-hero-background.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-white/72" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#F1F0FA]/90 via-white/85 to-gray-50" />

          <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-[#1E1D59]/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-[#632854]/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 font-bold text-[#1E1D59]"
            >
              <ArrowLeft size={18} />
              {backLabel}
            </Link>

            <div className="mt-8 max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#1E1D59] shadow-sm">
                <img
                  src="/logo.png"
                  alt=""
                  className="h-4 w-4 rounded-full object-contain"
                />
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
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              {backLabel}
            </Link>

            <div className="flex flex-wrap gap-4">
              {showVerifyLink && (
                <Link
                  href={`/verify-certificate?code=${certificateCode}`}
                  className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <ShieldCheck size={18} />
                  Verify Certificate
                </Link>
              )}

              <button
                type="button"
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold hover:bg-gray-50"
              >
                <Printer size={18} />
                Print
              </button>

              <button
                type="button"
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </section>

        <section className="certificate-print-area mx-auto max-w-6xl px-6 pb-12 print:px-0 print:py-0">
          <div className="rounded-3xl bg-white p-6 shadow-sm print:rounded-none print:p-0 print:shadow-none">
            <div className="certificate-print-box relative overflow-hidden rounded-[2rem] border-[10px] border-[#1E1D59] bg-white p-8 shadow-[inset_0_0_0_4px_rgba(176,141,87,0.5)] print:rounded-none">
              <div className="absolute left-0 top-0 h-40 w-40 rounded-br-full bg-[#F1F0FA]" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-tl-full bg-[#FBEFF4]" />

              <div className="certificate-inner-box relative border-2 border-[#632854] px-8 py-14 text-center">
                <span className="certificate-corner absolute left-3 top-3 h-9 w-9 rounded-tl-2xl border-l-4 border-t-4 border-[#B08D57]/70 md:left-5 md:top-5" />
                <span className="certificate-corner absolute right-3 top-3 h-9 w-9 rounded-tr-2xl border-r-4 border-t-4 border-[#B08D57]/70 md:right-5 md:top-5" />
                <span className="certificate-corner absolute bottom-3 left-3 h-9 w-9 rounded-bl-2xl border-b-4 border-l-4 border-[#B08D57]/70 md:bottom-5 md:left-5" />
                <span className="certificate-corner absolute bottom-3 right-3 h-9 w-9 rounded-br-2xl border-b-4 border-r-4 border-[#B08D57]/70 md:bottom-5 md:right-5" />

                <img
                  src="/logo.png"
                  alt=""
                  aria-hidden="true"
                  className="certificate-watermark pointer-events-none absolute inset-0 -z-10 m-auto h-72 w-72 object-contain opacity-[0.05] grayscale print:opacity-[0.07]"
                />

                <div className="certificate-icon relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1E1D59] via-[#632854] to-[#4F2043] shadow-lg" />
                  <div className="absolute inset-[3px] rounded-full border-2 border-dashed border-[#B08D57]/70" />
                  <div className="absolute inset-[9px] flex items-center justify-center overflow-hidden rounded-full bg-white">
                    <img
                      src="/logo.png"
                      alt="KWCA Logo"
                      className="certificate-icon-logo h-16 w-16 object-contain"
                    />
                  </div>
                </div>

                <p className="certificate-kicker tracking-[0.45em] text-sm font-extrabold text-[#4F2043]">
                  KWCA LEARNING HUB
                </p>

                <div className="certificate-divider mx-auto mt-4 flex items-center justify-center gap-3">
                  <span className="certificate-divider-line h-px w-10 bg-[#B08D57]" />
                  <span className="certificate-divider-dot h-1.5 w-1.5 rotate-45 bg-[#B08D57]" />
                  <span className="certificate-divider-line h-px w-10 bg-[#B08D57]" />
                </div>

                <h2 className="certificate-title mt-8 text-5xl font-extrabold text-[#1E1D59]">
                  Certificate of Completion
                </h2>

                <p className="certificate-presented mt-8 text-lg text-gray-600">
                  This certificate is proudly presented to
                </p>

                <h3 className="certificate-name mx-auto mt-6 max-w-4xl border-b-2 border-[#1E1D59]/20 pb-4 text-5xl font-extrabold text-[#1E1D59]">
                  {learnerName}
                </h3>

                <p className="certificate-course-label mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-600">
                  For successfully completing the course
                </p>

                <h4 className="certificate-course-title mx-auto mt-4 max-w-4xl text-3xl font-extrabold text-[#1E1D59]">
                  {courseTitle}
                </h4>

                <div className="certificate-status mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-[#B08D57]/30 bg-[#F1F0FA] px-6 py-4 text-[#1E1D59]">
                  <CheckCircle size={24} />

                  <p className="font-bold">
                    Final quiz completed and passed successfully
                  </p>
                </div>

                <div className="certificate-details mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
                  <CertificateDetail
                    label="Date Issued"
                    value={completionDate}
                  />

                  <CertificateDetail
                    label="Certificate ID"
                    value={certificateCode}
                  />

                  <CertificateDetail
                    label="Issued By"
                    value="KWCA Learning Hub"
                  />
                </div>

                <div className="certificate-seal mx-auto mt-12 flex flex-col items-center gap-2">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B08D57] via-[#E4C89A] to-[#8C6A3E] shadow-md" />
                    <div className="absolute inset-[4px] rounded-full border-2 border-dashed border-white/80" />
                    <div className="absolute inset-[10px] flex items-center justify-center rounded-full bg-white">
                      <BadgeCheck size={26} className="text-[#1E1D59]" />
                    </div>
                  </div>

                  <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#8C6A3E]">
                    Official KWCA Seal
                  </p>
                </div>

                <div className="certificate-signatures mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-2">
                  <div>
                    <div className="mx-auto h-px w-64 bg-[#B08D57]" />
                    <p className="mt-3 font-bold">Course Coordinator</p>
                  </div>

                  <div>
                    <div className="mx-auto h-px w-64 bg-[#B08D57]" />
                    <p className="mt-3 font-bold">KWCA Representative</p>
                  </div>
                </div>

                <div className="certificate-note mx-auto mt-12 max-w-3xl rounded-2xl bg-gray-50 p-5 text-sm leading-7 text-gray-600 print:bg-white">
                  This certificate can be verified using the Certificate ID
                  above through the KWCA LMS certificate verification page.
                </div>
              </div>
            </div>
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

function CertificateDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-500">{label}</p>

      <p className="mt-2 break-words font-extrabold">{value}</p>
    </div>
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
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F0FA] text-[#1E1D59]">
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-7 text-gray-600">{description}</p>
    </div>
  );
}
