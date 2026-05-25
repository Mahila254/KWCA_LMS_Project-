"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle,
  XCircle,
  Search,
  ShieldCheck,
  User,
  BookOpen,
  CalendarDays,
  Mail,
  ArrowLeft,
} from "lucide-react";

type VerifiedCertificate = {
  code: string;
  issuedAt: string;
  learnerName: string;
  learnerEmail: string;
  courseTitle: string;
  courseCategory: string | null;
};

export default function VerifyCertificatePage() {
  const [code, setCode] = useState("");
  const [certificate, setCertificate] =
    useState<VerifiedCertificate | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setChecking(true);
      setError("");
      setCertificate(null);

      if (!code.trim()) {
        setError("Please enter a certificate code.");
        return;
      }

      const response = await fetch(
        `/api/certificates/verify?code=${encodeURIComponent(code.trim())}`
      );

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setError(data.error || "Certificate could not be verified.");
        return;
      }

      setCertificate(data.certificate);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while verifying the certificate.");
    } finally {
      setChecking(false);
    }
  }

  const issuedDate = certificate
    ? new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            <div className="mt-8 max-w-4xl">
              <p className="font-bold text-[#007F73]">
                Certificate Verification
              </p>

              <h1 className="mt-3 text-5xl font-bold">
                Verify a KWCA LMS Certificate
              </h1>

              <p className="mt-4 text-xl leading-8 text-gray-600">
                Enter a certificate code to confirm whether the certificate was
                issued by the KWCA Learning Management System.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-1">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
              <ShieldCheck size={34} />
            </div>

            <h2 className="text-3xl font-bold">Verification Search</h2>

            <p className="mt-3 leading-7 text-gray-600">
              Use the unique certificate code printed on the learner’s
              certificate.
            </p>

            <form onSubmit={handleVerify} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="certificateCode"
                  className="mb-2 block font-bold"
                >
                  Certificate Code
                </label>

                <input
                  id="certificateCode"
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Example: KWCA-ABC123"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#007F73]"
                />
              </div>

              <button
                type="submit"
                disabled={checking}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={18} />
                {checking ? "Checking..." : "Verify Certificate"}
              </button>
            </form>

            {error && (
              <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-700">
                <div className="flex gap-3">
                  <XCircle className="mt-1 shrink-0" size={22} />

                  <div>
                    <p className="font-bold">Certificate Not Verified</p>
                    <p className="mt-1 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">
            {!certificate ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                  <Award size={42} />
                </div>

                <h2 className="text-3xl font-bold">
                  Certificate details will appear here
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                  Once a valid certificate code is entered, the LMS will display
                  the learner name, course title, issue date, and verification
                  status.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-[#007F73] bg-[#F2FBF8] p-8">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
                      <CheckCircle size={18} />
                      Valid Certificate
                    </div>

                    <h2 className="mt-6 text-4xl font-extrabold">
                      Certificate Verified
                    </h2>

                    <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                      This certificate was found in the KWCA LMS database and is
                      linked to the learner and course shown below.
                    </p>
                  </div>

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#007F73] shadow-sm">
                    <Award size={42} />
                  </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5">
                    <div className="mb-3 flex items-center gap-2 text-[#007F73]">
                      <User size={20} />
                      <p className="font-bold">Learner Name</p>
                    </div>

                    <p className="text-2xl font-bold">
                      {certificate.learnerName}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <div className="mb-3 flex items-center gap-2 text-[#007F73]">
                      <Mail size={20} />
                      <p className="font-bold">Learner Email</p>
                    </div>

                    <p className="break-words text-lg font-bold">
                      {certificate.learnerEmail}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <div className="mb-3 flex items-center gap-2 text-[#007F73]">
                      <BookOpen size={20} />
                      <p className="font-bold">Course</p>
                    </div>

                    <p className="text-2xl font-bold">
                      {certificate.courseTitle}
                    </p>

                    <p className="mt-1 text-gray-600">
                      {certificate.courseCategory || "General"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-5">
                    <div className="mb-3 flex items-center gap-2 text-[#007F73]">
                      <CalendarDays size={20} />
                      <p className="font-bold">Issue Date</p>
                    </div>

                    <p className="text-2xl font-bold">{issuedDate}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Certificate Code
                  </p>

                  <p className="mt-2 break-words text-2xl font-extrabold text-[#007F73]">
                    {certificate.code}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}