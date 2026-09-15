"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
import { Loader2 } from "lucide-react";
import CertificateDocument from "@/components/CertificateDocument";

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

      const checkResponse = await authFetch(
        `/api/courses/${courseSlug}/certificate`
      );

      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.certificate) {
        setCourse(checkData.course);
        setUser(checkData.user);
        setCertificate(checkData.certificate);
        return;
      }

      setIssuing(true);

      const issueResponse = await authFetch(
        `/api/courses/${courseSlug}/certificate`,
        {
          method: "POST",
        }
      );

      const issueData = await issueResponse.json();

      if (issueResponse.status === 403) {
        alert(
          issueData.error ||
            "You need to pass the final quiz before a certificate can be issued."
        );
        router.push(`/courses/${courseSlug}/quiz/final`);
        return;
      }

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

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#1E1D59]">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F0FA] text-[#1E1D59]">
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
      <div className="print-hidden print:hidden">
        <Navbar />
      </div>

      <CertificateDocument
        learnerName={learnerName}
        courseTitle={course?.title || "Course Title"}
        certificateCode={certificateCode}
        completionDate={completionDate}
        backHref={`/courses/${courseSlug}`}
        backLabel="Back to Course"
      />

      <div className="print-hidden print:hidden">
        <Footer />
      </div>
    </>
  );
}
