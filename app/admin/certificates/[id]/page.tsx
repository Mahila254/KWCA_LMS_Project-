import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/isAdminRequest";
import CertificateDocument from "@/components/CertificateDocument";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Lets an admin open any learner's certificate directly from the admin
// dashboard. The learner-facing certificate page is gated behind Supabase
// login (it always shows "your own" certificate), which is the wrong tool
// here — admins aren't Supabase learners, and they need to look up a
// specific learner's certificate by id, not whichever one is currently
// signed in. This page is gated by the admin session instead and reads
// the certificate straight from the database.
export default async function AdminCertificateViewPage({
  params,
}: PageProps) {
  const isAdmin = await isAdminRequest();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  const learnerName =
    certificate.user.name || certificate.user.email || "Learner Name";

  const completionDate = new Date(certificate.issuedAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <>
      <div className="print-hidden print:hidden">
        <AdminNavbar />

        <div className="border-b bg-white px-6 py-4">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/admin/certificates"
              className="inline-flex items-center gap-2 font-bold text-[#1E1D59]"
            >
              <ArrowLeft size={18} />
              Back to Certificates
            </Link>
          </div>
        </div>
      </div>

      <CertificateDocument
        learnerName={learnerName}
        courseTitle={certificate.course.title}
        certificateCode={certificate.certificateCode}
        completionDate={completionDate}
        backHref="/admin/certificates"
        backLabel="Back to Certificates"
      />

      <div className="print-hidden print:hidden">
        <Footer />
      </div>
    </>
  );
}
