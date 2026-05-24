"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Award,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

type Course = {
  title: string;
  slug: string;
};

export default function CertificatePage() {
  const params = useParams<{ slug: string }>();
  const courseSlug = params.slug;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const learnerName = "Learner Name";

  const completionDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const certificateCode = `KWCA-${courseSlug
    ?.toUpperCase()
    .replace(/-/g, "")
    .slice(0, 10)}-${new Date().getFullYear()}`;

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(
          `/api/admin/courses/${courseSlug}/quiz-questions`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Something went wrong while loading certificate.");
          return;
        }

        setCourse(data.course);
      } catch (error) {
        console.error(error);
        alert("Something went wrong while loading the certificate.");
      } finally {
        setLoading(false);
      }
    }

    if (courseSlug) {
      fetchCourse();
    }
  }, [courseSlug]);

  function handlePrintCertificate() {
    window.print();
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-3xl font-bold">Loading certificate...</h1>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-16 print:hidden">
          <div className="mx-auto max-w-6xl">
            <p className="font-bold text-[#007F73]">Certificate</p>

            <h1 className="mt-4 text-5xl font-extrabold">
              Course Completion Certificate
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-gray-600">
              This certificate is generated after completing the course and
              passing the final graded quiz.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <Link
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              Back to Course
            </Link>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
              >
                <Printer size={18} />
                Print Certificate
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

          <div className="rounded-3xl bg-white p-8 shadow-sm print:shadow-none">
            <div className="border-[10px] border-[#007F73] p-10">
              <div className="border-2 border-[#D94A00] px-8 py-14 text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                  <Award size={52} />
                </div>

                <p className="tracking-[0.5em] text-sm font-extrabold text-[#8B2F00]">
                  KWCA LEARNING HUB
                </p>

                <h2 className="mt-8 text-5xl font-extrabold text-[#07122E]">
                  Certificate of Completion
                </h2>

                <p className="mt-8 text-lg text-gray-600">
                  This certificate is proudly presented to
                </p>

                <h3 className="mt-6 text-5xl font-extrabold text-[#007F73]">
                  {learnerName}
                </h3>

                <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-600">
                  For successfully completing the course
                </p>

                <h4 className="mx-auto mt-4 max-w-4xl text-3xl font-extrabold text-[#07122E]">
                  {course?.title || "Course Title"}
                </h4>

                <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl bg-[#F2FBF8] px-6 py-4 text-[#007F73]">
                  <CheckCircle size={24} />
                  <p className="font-bold">
                    Final quiz completed and passed successfully
                  </p>
                </div>

                <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      Date Issued
                    </p>
                    <p className="mt-2 font-extrabold">{completionDate}</p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      Certificate ID
                    </p>
                    <p className="mt-2 font-extrabold">{certificateCode}</p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-500">Issued By</p>
                    <p className="mt-2 font-extrabold">KWCA Learning Hub</p>
                  </div>
                </div>

                <div className="mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-2">
                  <div>
                    <div className="mx-auto h-px w-64 bg-gray-400" />
                    <p className="mt-3 font-bold">Course Coordinator</p>
                  </div>

                  <div>
                    <div className="mx-auto h-px w-64 bg-gray-400" />
                    <p className="mt-3 font-bold">KWCA Representative</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}