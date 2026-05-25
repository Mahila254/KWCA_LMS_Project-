import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  Users,
  BookOpen,
  ClipboardList,
  Award,
  TrendingUp,
  CheckCircle,
  BarChart3,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const [
    courses,
    learners,
    enrollments,
    quizResults,
    certificates,
  ] = await Promise.all([
    prisma.course.findMany({
      include: {
        lessons: true,
        quizQuestions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.enrollment.findMany({
      include: {
        course: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.quizResult.findMany({
      include: {
        course: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.certificate.findMany({
      include: {
        course: true,
        user: true,
      },
      orderBy: {
        issuedAt: "desc",
      },
    }),
  ]);

  const completedEnrollments = enrollments.filter(
    (item) => item.completed
  ).length;

  const passedQuizResults = quizResults.filter((item) => item.passed).length;

  const averageQuizScore =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce((total, item) => total + item.score, 0) /
            quizResults.length
        )
      : 0;

  const quizPassRate =
    quizResults.length > 0
      ? Math.round((passedQuizResults / quizResults.length) * 100)
      : 0;

  const courseCompletionRate =
    enrollments.length > 0
      ? Math.round((completedEnrollments / enrollments.length) * 100)
      : 0;

  const publishedCourses = courses.filter(
    (course) => course.status === "PUBLISHED"
  ).length;

  const draftCourses = courses.filter(
    (course) => course.status === "DRAFT"
  ).length;

  const totalLessons = courses.reduce(
    (total, course) => total + course.lessons.length,
    0
  );

  const totalQuizQuestions = courses.reduce(
    (total, course) => total + course.quizQuestions.length,
    0
  );

  const recentQuizResults = quizResults.slice(0, 5);
  const recentCertificates = certificates.slice(0, 5);

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
              <p className="font-bold text-[#007F73]">Platform Reports</p>

              <h1 className="mt-3 text-5xl font-bold">
                KWCA LMS Reports
              </h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Monitor platform activity, learner progress, quiz performance,
                certificates, and course engagement.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="text-[#007F73]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Total Courses
                </p>
              </div>

              <p className="text-4xl font-bold">{courses.length}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Users className="text-[#007F73]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Total Learners
                </p>
              </div>

              <p className="text-4xl font-bold">{learners.length}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <GraduationCap className="text-[#D94A00]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Enrollments
                </p>
              </div>

              <p className="text-4xl font-bold">{enrollments.length}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Award className="text-[#007F73]" size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Certificates
                </p>
              </div>

              <p className="text-4xl font-bold">{certificates.length}</p>
            </div>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <TrendingUp className="text-[#007F73]" size={30} />
                <h2 className="text-2xl font-bold">Average Quiz Score</h2>
              </div>

              <p className="text-5xl font-extrabold text-[#007F73]">
                {averageQuizScore}%
              </p>

              <p className="mt-3 text-gray-600">
                Based on {quizResults.length} submitted quiz results.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <CheckCircle className="text-[#007F73]" size={30} />
                <h2 className="text-2xl font-bold">Quiz Pass Rate</h2>
              </div>

              <p className="text-5xl font-extrabold text-[#007F73]">
                {quizPassRate}%
              </p>

              <p className="mt-3 text-gray-600">
                {passedQuizResults} out of {quizResults.length} quiz results
                are marked as passed.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <BarChart3 className="text-[#D94A00]" size={30} />
                <h2 className="text-2xl font-bold">Completion Rate</h2>
              </div>

              <p className="text-5xl font-extrabold text-[#D94A00]">
                {courseCompletionRate}%
              </p>

              <p className="mt-3 text-gray-600">
                {completedEnrollments} out of {enrollments.length} enrollments
                are completed.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Course Overview</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Published Courses
                  </p>
                  <p className="mt-2 text-3xl font-bold text-[#007F73]">
                    {publishedCourses}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Draft Courses
                  </p>
                  <p className="mt-2 text-3xl font-bold text-[#D94A00]">
                    {draftCourses}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Total Lessons
                  </p>
                  <p className="mt-2 text-3xl font-bold">{totalLessons}</p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm font-bold text-gray-500">
                    Quiz Questions
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {totalQuizQuestions}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {courses.length === 0 ? (
                  <p className="rounded-2xl bg-gray-50 p-5 text-gray-600">
                    No courses available yet.
                  </p>
                ) : (
                  courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/admin/courses/${course.slug}/lessons`}
                      className="block rounded-2xl border p-5 hover:bg-gray-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {course.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-600">
                            {course.category || "General"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <span className="rounded-full bg-[#F2FBF8] px-3 py-1 text-sm font-bold text-[#007F73]">
                            {course.lessons.length} Lessons
                          </span>

                          <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#D94A00]">
                            {course.quizQuestions.length} Questions
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold">Recent Quiz Results</h2>

                {recentQuizResults.length === 0 ? (
                  <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
                    No quiz results yet.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {recentQuizResults.map((result) => {
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
                          className="rounded-2xl border p-5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <h3 className="font-bold">
                                {result.user.name || result.user.email}
                              </h3>

                              <p className="mt-1 text-sm text-gray-600">
                                {result.course.title} • {result.quizType} Quiz
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                {resultDate}
                              </p>
                            </div>

                            <div className="text-right">
                              <p
                                className={`text-2xl font-extrabold ${
                                  result.passed
                                    ? "text-[#007F73]"
                                    : "text-red-600"
                                }`}
                              >
                                {result.score}%
                              </p>

                              <p
                                className={`text-sm font-bold ${
                                  result.passed
                                    ? "text-green-700"
                                    : "text-red-600"
                                }`}
                              >
                                {result.passed ? "Passed" : "Not Passed"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold">Recent Certificates</h2>

                {recentCertificates.length === 0 ? (
                  <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
                    No certificates issued yet.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {recentCertificates.map((certificate) => {
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
                          className="rounded-2xl border p-5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <h3 className="font-bold">
                                {certificate.user.name ||
                                  certificate.user.email}
                              </h3>

                              <p className="mt-1 text-sm text-gray-600">
                                {certificate.course.title}
                              </p>

                              <p className="mt-1 text-sm font-bold text-[#007F73]">
                                {certificate.certificateCode}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                {issuedDate}
                              </p>
                            </div>

                            <Link
                              href={`/courses/${certificate.course.slug}/certificate`}
                              className="rounded-xl bg-[#007F73] px-4 py-2 text-sm font-bold text-white hover:bg-[#00665d]"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-[#07122E] p-8 text-white">
            <h2 className="text-3xl font-bold">Report Summary</h2>

            <p className="mt-3 max-w-4xl leading-7 text-white/70">
              This page provides a live database summary of learner activity,
              course content, quiz performance, enrollments, and certificates.
              It gives KWCA administrators a quick picture of how the learning
              platform is being used.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}