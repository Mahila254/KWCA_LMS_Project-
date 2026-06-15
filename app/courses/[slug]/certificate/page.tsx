"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Award,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  BadgeCheck,
  ExternalLink,
  Loader2,
} from "lucide-react";

type Course = {
  title: string;
  slug: string;
};

type User = {
  id: string;
  name: string | null;
  email: string;
};

type Certificate = {
  certificateCode: string;
  issuedAt: string;
};

type SupabaseLearner = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function CertificatePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const courseSlug = params.slug;

  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  async function loadOrIssueCertificate() {
    try {
      setLoading(true);

      const {
        data: { user: supabaseUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !supabaseUser) {
        alert("Please login before generating your certificate.");
        router.push("/login");
        return;
      }

      const learner = supabaseUser as SupabaseLearner;

      const learnerName =
        learner.user_metadata?.full_name || learner.email || "Learner";

      if (!learner.email) {
        alert("Your account email could not be found. Please login again.");
        router.push("/login");
        return;
      }

      const checkResponse = await fetch(
        `/api/courses/${courseSlug}/certificate?email=${encodeURIComponent(
          learner.email
        )}`
      );

      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.certificate) {
        setCourse(checkData.course);
        setUser(checkData.user);
        setCertificate(checkData.certificate);
        return;
      }

      setIssuing(true);

      const issueResponse = await fetch(
        `/api/courses/${courseSlug}/certificate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: learner.id,
            email: learner.email,
            name: learnerName,
          }),
        }
      );

      const issueData = await issueResponse.json();

      if (!issueResponse.ok) {
        alert(
          issueData.error || "Something went wrong while issuing certificate."
        );
        return;
      }

      setCourse(issueData.course);
      setUser(issueData.user);
      setCertificate(issueData.certificate);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while loading the certificate.");
    } finally {
      setLoading(false);
      setIssuing(false);
    }
  }

  useEffect(() => {
    if (courseSlug) {
      loadOrIssueCertificate();
    }
  }, [courseSlug]);

  function handlePrintCertificate() {
    window.print();
  }

  const learnerName = user?.name || user?.email || "Learner Name";

  const completionDate = certificate?.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

  const certificateCode = certificate?.certificateCode || "KWCA-CERTIFICATE";

  if (loading) {
    return (
      <>
        <div className="print-hidden print:hidden">
          <Navbar />
        </div>

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
              <Loader2 className="animate-spin" size={32} />
            </div>

            <h1 className="text-3xl font-bold">
              {issuing ? "Issuing certificate..." : "Loading certificate..."}
            </h1>

            <p className="mt-3 text-gray-600">
              Please wait while we prepare your official KWCA LMS certificate.
            </p>
          </div>
        </main>

        <div className="print-hidden print:hidden">
          <Footer />
        </div>
      </>
    );
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

          .certificate-icon {
            width: 46px !important;
            height: 46px !important;
            margin-bottom: 10px !important;
          }

          .certificate-icon svg {
            width: 26px !important;
            height: 26px !important;
          }

          .certificate-kicker {
            font-size: 9px !important;
            letter-spacing: 0.32em !important;
          }

          .certificate-title {
            margin-top: 12px !important;
            font-size: 30px !important;
            line-height: 1.05 !important;
          }

          .certificate-presented {
            margin-top: 12px !important;
            font-size: 12px !important;
          }

          .certificate-name {
            margin-top: 8px !important;
            padding-bottom: 6px !important;
            font-size: 34px !important;
            line-height: 1.05 !important;
          }

          .certificate-course-label {
            margin-top: 12px !important;
            font-size: 12px !important;
          }

          .certificate-course-title {
            margin-top: 6px !important;
            font-size: 21px !important;
            line-height: 1.12 !important;
          }

          .certificate-status {
            margin-top: 12px !important;
            padding: 7px 12px !important;
            font-size: 11px !important;
          }

          .certificate-details {
            margin-top: 14px !important;
            gap: 10px !important;
          }

          .certificate-details p {
            font-size: 10px !important;
          }

          .certificate-signatures {
            margin-top: 18px !important;
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

      <div className="print-hidden print:hidden">
        <Navbar />
      </div>

      <main className="min-h-screen bg-gray-50 text-[#07122E] print:min-h-0 print:bg-white">
        <section className="certificate-page-hero relative overflow-hidden px-6 py-14 print:hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/course-hero-background.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-white/72" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#F2FBF8]/90 via-white/85 to-gray-50" />

          <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-[#007F73]/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-[#D94A00]/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <Link
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Course
            </Link>

            <div className="mt-8 max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#007F73] shadow-sm">
                <Award size={16} />
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
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              Back to Course
            </Link>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/verify-certificate?code=${certificateCode}`}
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold hover:bg-gray-50"
              >
                <ShieldCheck size={18} />
                Verify Certificate
              </Link>

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
                className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </section>

        <section className="certificate-print-area mx-auto max-w-6xl px-6 pb-12 print:px-0 print:py-0">
          <div className="rounded-3xl bg-white p-6 shadow-sm print:rounded-none print:p-0 print:shadow-none">
            <div className="certificate-print-box relative overflow-hidden rounded-[2rem] border-[10px] border-[#007F73] bg-white p-8 print:rounded-none">
              <div className="absolute left-0 top-0 h-40 w-40 rounded-br-full bg-[#F2FBF8]" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-tl-full bg-orange-50" />

              <div className="certificate-inner-box relative border-2 border-[#D94A00] px-8 py-14 text-center">
                <div className="certificate-icon mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                  <Award size={52} />
                </div>

                <p className="certificate-kicker tracking-[0.45em] text-sm font-extrabold text-[#8B2F00]">
                  KWCA LEARNING HUB
                </p>

                <h2 className="certificate-title mt-8 text-5xl font-extrabold text-[#07122E]">
                  Certificate of Completion
                </h2>

                <p className="certificate-presented mt-8 text-lg text-gray-600">
                  This certificate is proudly presented to
                </p>

                <h3 className="certificate-name mx-auto mt-6 max-w-4xl border-b-2 border-[#007F73]/20 pb-4 text-5xl font-extrabold text-[#007F73]">
                  {learnerName}
                </h3>

                <p className="certificate-course-label mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-600">
                  For successfully completing the course
                </p>

                <h4 className="certificate-course-title mx-auto mt-4 max-w-4xl text-3xl font-extrabold text-[#07122E]">
                  {course?.title || "Course Title"}
                </h4>

                <div className="certificate-status mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl bg-[#F2FBF8] px-6 py-4 text-[#007F73]">
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

                <div className="certificate-signatures mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-2">
                  <div>
                    <div className="mx-auto h-px w-64 bg-gray-400" />
                    <p className="mt-3 font-bold">Course Coordinator</p>
                  </div>

                  <div>
                    <div className="mx-auto h-px w-64 bg-gray-400" />
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

      <div className="print-hidden print:hidden">
        <Footer />
      </div>
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
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2FBF8] text-[#007F73]">
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-7 text-gray-600">{description}</p>
    </div>
  );
}