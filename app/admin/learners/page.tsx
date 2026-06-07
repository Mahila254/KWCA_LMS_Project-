import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  User,
  Mail,
  BookOpen,
  ClipboardList,
  Award,
  CheckCircle,
  XCircle,
  CalendarDays,
} from "lucide-react";

export const dynamic = "force-dynamic";

type LearnerRecord = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "STUDENT";
  createdAt: Date;
  updatedAt: Date;
  enrollments: {
    id: string;
    progress: number;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    course: {
      id: string;
      title: string;
      slug: string;
      category: string | null;
    };
  }[];
  quizResults: {
    id: string;
    quizType: string;
    score: number;
    passed: boolean;
    createdAt: Date;
    course: {
      id: string;
      title: string;
      slug: string;
    };
  }[];
  certificates: {
    id: string;
    certificateCode: string;
    issuedAt: Date;
    course: {
      id: string;
      title: string;
      slug: string;
    };
  }[];
};

export default async function AdminLearnersPage() {
  const learners: LearnerRecord[] = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      enrollments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: true,
            },
          },
        },
      },
      quizResults: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
      certificates: {
        orderBy: {
          issuedAt: "desc",
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  const totalEnrollments = learners.reduce(
    (total: number, learner: LearnerRecord) =>
      total + learner.enrollments.length,
    0
  );

  const totalQuizResults = learners.reduce(
    (total: number, learner: LearnerRecord) =>
      total + learner.quizResults.length,
    0
  );

  const totalCertificates = learners.reduce(
    (total: number, learner: LearnerRecord) =>
      total + learner.certificates.length,
    0
  );

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
              <p className="font-bold text-[#007F73]">Learner Management</p>

              <h1 className="mt-3 text-5xl font-bold">Registered Learners</h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                View learner accounts, enrollments, course progress, quiz
                results, and issued certificates.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <User className="text-[#007F73]" size={28} />

                <p className="text-sm font-bold text-gray-500">
                  Total Learners
                </p>
              </div>

              <p className="text-4xl font-bold">{learners.length}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="text-[#007F73]" size={28} />

                <p className="text-sm font-bold text-gray-500">
                  Total Enrollments
                </p>
              </div>

              <p className="text-4xl font-bold">{totalEnrollments}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ClipboardList className="text-[#D94A00]" size={28} />

                <p className="text-sm font-bold text-gray-500">
                  Quiz Results
                </p>
              </div>

              <p className="text-4xl font-bold">{totalQuizResults}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Award className="text-[#007F73]" size={28} />

                <p className="text-sm font-bold text-gray-500">
                  Certificates
                </p>
              </div>

              <p className="text-4xl font-bold">{totalCertificates}</p>
            </div>
          </div>

          {learners.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                <User size={32} />
              </div>

              <h2 className="text-3xl font-bold">No learners yet</h2>

              <p className="mt-3 text-gray-600">
                Learners will appear here after they register and sync with the
                LMS database.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {learners.map((learner: LearnerRecord) => {
                const createdDate = new Date(
                  learner.createdAt
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });

                const passedQuizzes = learner.quizResults.filter(
                  (result) => result.passed
                ).length;

                return (
                  <div
                    key={learner.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >
                    <div className="border-b px-6 py-6">
                      <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="flex gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                            <User size={34} />
                          </div>

                          <div>
                            <h2 className="text-2xl font-bold">
                              {learner.name || "Unnamed Learner"}
                            </h2>

                            <p className="mt-2 flex items-center gap-2 text-gray-600">
                              <Mail size={16} />
                              {learner.email}
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <CalendarDays size={15} />
                              Joined {createdDate}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-4">
                          <div className="rounded-2xl bg-gray-50 p-4 text-center">
                            <p className="text-sm font-bold text-gray-500">
                              Enrolled
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                              {learner.enrollments.length}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4 text-center">
                            <p className="text-sm font-bold text-gray-500">
                              Quizzes
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                              {learner.quizResults.length}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4 text-center">
                            <p className="text-sm font-bold text-gray-500">
                              Passed
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                              {passedQuizzes}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4 text-center">
                            <p className="text-sm font-bold text-gray-500">
                              Certificates
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                              {learner.certificates.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-8 p-6 lg:grid-cols-3">
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <BookOpen className="text-[#007F73]" size={22} />

                          <h3 className="text-xl font-bold">Enrollments</h3>
                        </div>

                        {learner.enrollments.length === 0 ? (
                          <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                            No course enrollments yet.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {learner.enrollments.map((enrollment) => (
                              <Link
                                key={enrollment.id}
                                href={`/courses/${enrollment.course.slug}`}
                                className="block rounded-2xl border p-4 hover:bg-gray-50"
                              >
                                <p className="font-bold">
                                  {enrollment.course.title}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                  {enrollment.course.category || "General"}
                                </p>

                                <div className="mt-3">
                                  <div className="mb-1 flex justify-between text-xs font-bold text-gray-500">
                                    <span>Progress</span>
                                    <span>{enrollment.progress}%</span>
                                  </div>

                                  <div className="h-2 rounded-full bg-gray-100">
                                    <div
                                      className="h-2 rounded-full bg-[#007F73]"
                                      style={{
                                        width: `${enrollment.progress}%`,
                                      }}
                                    />
                                  </div>
                                </div>

                                <p
                                  className={`mt-2 text-sm font-bold ${
                                    enrollment.completed
                                      ? "text-green-700"
                                      : "text-[#D94A00]"
                                  }`}
                                >
                                  {enrollment.completed
                                    ? "Completed"
                                    : "In Progress"}
                                </p>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <ClipboardList
                            className="text-[#D94A00]"
                            size={22}
                          />

                          <h3 className="text-xl font-bold">Quiz Results</h3>
                        </div>

                        {learner.quizResults.length === 0 ? (
                          <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                            No quiz results yet.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {learner.quizResults.map((result) => {
                              const resultDate = new Date(
                                result.createdAt
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              });

                              return (
                                <div
                                  key={result.id}
                                  className="rounded-2xl border p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="font-bold">
                                        {result.course.title}
                                      </p>

                                      <p className="mt-1 text-sm text-gray-600">
                                        {result.quizType} Quiz • {resultDate}
                                      </p>
                                    </div>

                                    {result.passed ? (
                                      <CheckCircle
                                        className="shrink-0 text-green-600"
                                        size={22}
                                      />
                                    ) : (
                                      <XCircle
                                        className="shrink-0 text-red-600"
                                        size={22}
                                      />
                                    )}
                                  </div>

                                  <p
                                    className={`mt-3 text-2xl font-extrabold ${
                                      result.passed
                                        ? "text-[#007F73]"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {result.score}%
                                  </p>

                                  <p
                                    className={`mt-1 text-sm font-bold ${
                                      result.passed
                                        ? "text-green-700"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {result.passed ? "Passed" : "Not Passed"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <Award className="text-[#007F73]" size={22} />

                          <h3 className="text-xl font-bold">Certificates</h3>
                        </div>

                        {learner.certificates.length === 0 ? (
                          <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                            No certificates issued yet.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {learner.certificates.map((certificate) => {
                              const issuedDate = new Date(
                                certificate.issuedAt
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              });

                              return (
                                <div
                                  key={certificate.id}
                                  className="rounded-2xl border p-4"
                                >
                                  <p className="font-bold">
                                    {certificate.course.title}
                                  </p>

                                  <p className="mt-2 text-sm font-bold text-[#007F73]">
                                    {certificate.certificateCode}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-600">
                                    Issued {issuedDate}
                                  </p>

                                  <Link
                                    href={`/courses/${certificate.course.slug}/certificate`}
                                    className="mt-4 inline-flex rounded-xl bg-[#007F73] px-4 py-2 text-sm font-bold text-white hover:bg-[#00665d]"
                                  >
                                    View Certificate
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}