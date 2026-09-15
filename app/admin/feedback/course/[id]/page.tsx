import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, MessageSquare, Star, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type FeedbackRecord = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
};

export default async function AdminFeedbackByCoursePage({
  params,
}: PageProps) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
    },
  });

  if (!course) {
    notFound();
  }

  const feedback: FeedbackRecord[] = await prisma.courseFeedback.findMany({
    where: {
      courseId: course.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const totalFeedback = feedback.length;

  const averageRating =
    totalFeedback > 0
      ? Math.round(
          (feedback.reduce((total, item) => total + item.rating, 0) /
            totalFeedback) *
            10
        ) / 10
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: feedback.filter((item) => item.rating === stars).length,
  }));

  const withComments = feedback.filter(
    (item) => item.comment && item.comment.trim().length > 0
  ).length;

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
        <section className="bg-[#F8F4F4] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/admin/feedback"
              className="inline-flex items-center gap-2 font-bold text-[#1E1D59]"
            >
              <ArrowLeft size={18} />
              Back to All Feedback
            </Link>

            <div className="mt-8">
              <p className="font-bold text-[#1E1D59]">
                {course.category || "Course"} Feedback
              </p>

              <h1 className="mt-3 text-5xl font-bold">{course.title}</h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Every star rating and comment learners left after passing
                this course&apos;s final quiz.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-[#1E1D59]">
                <MessageSquare size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Total Feedback
                </p>
              </div>
              <p className="text-4xl font-bold">{totalFeedback}</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-[#632854]">
                <Star size={28} />
                <p className="text-sm font-bold text-gray-500">
                  Average Rating
                </p>
              </div>
              <p className="text-4xl font-bold">
                {totalFeedback > 0 ? `${averageRating} / 5` : "—"}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-[#1E1D59]">
                <TrendingUp size={28} />
                <p className="text-sm font-bold text-gray-500">
                  With Written Comments
                </p>
              </div>
              <p className="text-4xl font-bold">{withComments}</p>
            </div>
          </div>

          <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Rating Breakdown</h2>

            <div className="mt-6 space-y-3">
              {ratingCounts.map(({ stars, count }) => {
                const percent =
                  totalFeedback > 0
                    ? Math.round((count / totalFeedback) * 100)
                    : 0;

                return (
                  <div key={stars} className="flex items-center gap-4">
                    <span className="flex w-16 shrink-0 items-center gap-1 font-bold">
                      {stars}
                      <Star size={16} className="fill-[#632854] text-[#632854]" />
                    </span>

                    <div className="h-3 flex-1 rounded-full bg-gray-100">
                      <div
                        className="h-3 rounded-full bg-[#632854]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="w-10 shrink-0 text-right text-sm font-bold text-gray-500">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">All Responses</h2>

            {feedback.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
                No feedback submitted for this course yet.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {feedback.map((item) => {
                  const submittedDate = new Date(
                    item.createdAt
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <div key={item.id} className="rounded-2xl border p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold">
                            {item.user.name || item.user.email}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {submittedDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={
                                star <= item.rating
                                  ? "fill-[#632854] text-[#632854]"
                                  : "fill-transparent text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {item.comment && (
                        <p className="mt-4 rounded-xl bg-gray-50 p-4 leading-7 text-gray-700">
                          {item.comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
