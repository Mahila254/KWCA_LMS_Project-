import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Award,
  Mail,
  BookOpen,
  CalendarDays,
  Eye,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: {
      issuedAt: "desc",
    },
    include: {
      user: true,
      course: true,
    },
  });

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Admin Dashboard
            </Link>

            <div className="mt-8">
              <p className="font-bold text-[#007F73]">Certificates</p>

              <h1 className="mt-3 text-5xl font-bold">
                Issued Certificates
              </h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                View certificates issued to learners after course completion and
                final quiz passing.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Award className="text-[#007F73]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Total Certificates
                </p>
              </div>

              <p className="text-4xl font-bold">{certificates.length}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="text-[#D94A00]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Courses Certified
                </p>
              </div>

              <p className="text-4xl font-bold">
                {new Set(certificates.map((item) => item.courseId)).size}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Mail className="text-[#007F73]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Learners Certified
                </p>
              </div>

              <p className="text-4xl font-bold">
                {new Set(certificates.map((item) => item.userId)).size}
              </p>
            </div>
          </div>

          {certificates.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                <Award size={32} />
              </div>

              <h2 className="text-3xl font-bold">
                No certificates issued yet
              </h2>

              <p className="mt-3 text-gray-600">
                Certificates will appear here once learners pass final quizzes
                and generate certificates.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-2xl font-bold">Certificate Records</h2>

                <p className="mt-1 text-gray-600">
                  Showing {certificates.length} issued certificates from the
                  database.
                </p>
              </div>

              <div className="divide-y">
                {certificates.map((certificate) => {
                  const issuedDate = new Date(
                    certificate.issuedAt
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={certificate.id}
                      className="grid gap-6 px-6 py-6 lg:grid-cols-[1.3fr_1.3fr_1fr_auto]"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Learner
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          {certificate.user.name || "Learner Name"}
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={15} />
                          {certificate.user.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Course
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          {certificate.course.title}
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen size={15} />
                          {certificate.course.category || "General"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Certificate ID
                        </p>

                        <p className="mt-1 font-bold text-[#007F73]">
                          {certificate.certificateCode}
                        </p>

                        <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays size={15} />
                          {issuedDate}
                        </p>
                      </div>

                      <div className="flex items-start">
                        <Link
                          href={`/courses/${certificate.course.slug}/certificate`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                        >
                          <Eye size={17} />
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}