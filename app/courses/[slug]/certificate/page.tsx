"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Award, Download, Printer, ArrowLeft, CheckCircle } from "lucide-react";

export default function CertificatePage() {
  const params = useParams();
  const slug = params.slug as string;

  const courseTitle =
    slug === "what-is-a-conservancy"
      ? "What is a Conservancy?"
      : "KWCA Learning Hub Course";

  const learnerName = "Learner Name";
  const completionDate = new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const certificateId = `KWCA-${Date.now().toString().slice(-6)}`;

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-12 print:hidden">
          <div className="mx-auto max-w-6xl">
            <Link
              href={`/courses/${slug}/quiz/final`}
              className="mb-6 inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Final Quiz
            </Link>

            <p className="font-bold text-[#007F73]">
              Certificate
            </p>

            <h1 className="mt-3 text-5xl font-extrabold">
              Course Completion Certificate
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              This certificate is generated after completing the course and
              passing the final graded quiz.
            </p>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap justify-between gap-4 print:hidden">
              <Link
                href="/dashboard"
                className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
              >
                Back to Dashboard
              </Link>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <Printer size={18} />
                  Print Certificate
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm print:shadow-none">
              <div className="border-[10px] border-[#007F73] p-10">
                <div className="border-2 border-[#8B2F0B] p-10 text-center">
                  <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                    <Award size={52} />
                  </div>

                  <p className="text-lg font-bold uppercase tracking-[0.4em] text-[#8B2F0B]">
                    KWCA Learning Hub
                  </p>

                  <h2 className="mt-6 text-5xl font-extrabold text-[#07122E]">
                    Certificate of Completion
                  </h2>

                  <p className="mt-8 text-xl text-gray-600">
                    This certificate is proudly presented to
                  </p>

                  <h3 className="mt-5 text-5xl font-extrabold text-[#007F73]">
                    {learnerName}
                  </h3>

                  <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-gray-700">
                    For successfully completing the course
                  </p>

                  <h4 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold text-[#07122E]">
                    {courseTitle}
                  </h4>

                  <div className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-3 rounded-2xl bg-green-50 px-6 py-4 text-green-700">
                    <CheckCircle size={24} />
                    <p className="font-bold">
                      Final quiz passed with the required 70% pass mark.
                    </p>
                  </div>

                  <div className="mx-auto mt-12 grid max-w-3xl gap-8 text-left md:grid-cols-3">
                    <div>
                      <p className="text-sm font-bold uppercase text-gray-500">
                        Date Completed
                      </p>
                      <p className="mt-2 font-bold">{completionDate}</p>
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase text-gray-500">
                        Certificate ID
                      </p>
                      <p className="mt-2 font-bold">{certificateId}</p>
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase text-gray-500">
                        Issued By
                      </p>
                      <p className="mt-2 font-bold">KWCA Learning Hub</p>
                    </div>
                  </div>

                  <div className="mx-auto mt-14 max-w-3xl border-t pt-8">
                    <p className="text-gray-600">
                      This certificate recognizes successful completion of a
                      structured learning module designed to strengthen
                      conservancy knowledge, governance, and practical
                      conservation leadership.
                    </p>
                  </div>

                  <div className="mt-12 flex justify-center">
                    <div className="w-64 border-t-2 border-[#07122E] pt-3">
                      <p className="font-bold">Authorized Signature</p>
                      <p className="text-sm text-gray-500">
                        KWCA Learning Hub
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm print:hidden">
              <h3 className="text-2xl font-bold">
                Certificate note
              </h3>

              <p className="mt-3 leading-8 text-gray-600">
                Later, when we connect the backend, this certificate will pull
                the learner’s real name, actual course score, completion date,
                and saved certificate ID from the database.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}