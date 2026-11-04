import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminSearchBar from "@/components/AdminSearchBar";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Mail,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

type QuizResultRecord = {
  id: string;
  quizType: string;
  score: number;
  passed: boolean;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  course: {
    title: string;
    slug: string;
  };
};

export default async function AdminQuizResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const quizResults: QuizResultRecord[] = await prisma.quizResult.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: query
      ? {
          OR: [
            { user: { name: { contains: query, mode: "insensitive" } } },
            { user: { email: { contains: query, mode: "insensitive" } } },
            { course: { title: { contains: query, mode: "insensitive" } } },
          ],
        }
      : undefined,
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

  const totalResults = quizResults.length;

  const passedResults = quizResults.filter((item) => item.passed).length;

  const averageScore =
    totalResults > 0
      ? Math.round(
          quizResults.reduce((total, item) => total + item.score, 0) /
            totalResults
        )
      : 0;

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-ink">
        <section className="bg-canvas py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 font-bold text-ink"
            >
              <ArrowLeft size={18} />
              Back to Admin Dashboard
            </Link>

            <div className="mt-8">
              <p className="font-bold text-ink">Quiz Results</p>

              <h1 className="mt-3 text-5xl font-bold">
                Practice &amp; Final Quiz Results
              </h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Every quiz result submitted by learners, across all courses.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-ink">
                <ClipboardList size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Total Results
                </p>
              </div>
              <p className="text-4xl font-bold">{totalResults}</p>
            </div>

            <div className="rounded-3xl bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-green-700">
                <CheckCircle size={28} />
                <p className="text-sm font-bold text-gray-500">Passed</p>
              </div>
              <p className="text-4xl font-bold">{passedResults}</p>
            </div>

            <div className="rounded-3xl bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-accent">
                <TrendingUp size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Average Score
                </p>
              </div>
              <p className="text-4xl font-bold">{averageScore}%</p>
            </div>
          </div>

          <AdminSearchBar
            action="/admin/quiz-results"
            placeholder="Search by learner name, email, or course..."
            defaultValue={query}
          />

          {quizResults.length === 0 ? (
            <div className="rounded-3xl bg-surface p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-tint text-ink">
                <ClipboardList size={32} />
              </div>

              <h2 className="text-3xl font-bold">
                {query ? "No matching quiz results" : "No quiz results yet"}
              </h2>

              <p className="mt-3 text-gray-600">
                {query
                  ? "Try a different name, email, or course."
                  : "Quiz results will appear here once learners start taking quizzes."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-surface shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-2xl font-bold">Quiz Result Records</h2>

                <p className="mt-1 text-gray-600">
                  Showing {quizResults.length} quiz results from the database.
                </p>
              </div>

              <div className="divide-y">
                {quizResults.map((result) => {
                  const resultDate = new Date(
                    result.createdAt
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={result.id}
                      className="grid gap-6 px-6 py-6 lg:grid-cols-[1.3fr_1.3fr_1fr]"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Learner
                        </p>

                        <h3 className="mt-1 flex items-center gap-2 text-xl font-bold">
                          <User size={18} className="text-ink" />
                          {result.user.name || "Unnamed Learner"}
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={15} />
                          {result.user.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Course
                        </p>

                        <h3 className="mt-1 flex items-center gap-2 text-xl font-bold">
                          <BookOpen size={18} className="text-accent" />
                          {result.course.title}
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays size={15} />
                          {resultDate} • {result.quizType} Quiz
                        </p>
                      </div>

                      <div>
                        <p
                          className={`text-3xl font-extrabold ${
                            result.passed ? "text-ink" : "text-red-700"
                          }`}
                        >
                          {result.score}%
                        </p>

                        <p
                          className={`mt-2 flex items-center gap-2 text-sm font-bold ${
                            result.passed ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {result.passed ? (
                            <CheckCircle size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {result.passed ? "Passed" : "Not Passed"}
                        </p>
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
