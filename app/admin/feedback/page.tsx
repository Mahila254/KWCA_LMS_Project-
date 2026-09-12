import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, MessageSquare, Star, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

type FeedbackRecord = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
  };
};

export default async function AdminFeedbackPage() {
  const feedback = (await prisma.courseFeedback.findMany({
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
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  })) as FeedbackRecord[];

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

  // Per-course average, for a quick "which courses are landing well" view.
  const courseAverages = Object.values(
    feedback.reduce(
      (acc, item) => {
        const key = item.course.id;
        if (!acc[key]) {
          acc[key] = {
            title: item.course.title,
            slug: item.course.slug,
            total: 0,
            count: 0,
          };
        }
        acc[key].total += item.rating;
        acc[key].count += 1;
        return acc;
      },
      {} as Record<
        string,
        { title: string; slug: string; total: number; count: number }
      >
    )
  )
    .map((entry) => ({
      title: entry.title,
      slug: entry.slug,
      count: entry.count,
      average: Math.round((entry.total / entry.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
        <section className="bg-[#F8F4F4] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 font-bold text-[#1E1D59]"
            >
              <ArrowLeft size={18} />
              Back to Admin Dashboard
            </Link>

            <div className="mt-8">
              <p className="font-bold text-[#1E1D59]">Course Feedback</p>

              <h1 className="mt-3 text-5xl font-bold">Learner Feedback</h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Star ratings and comments learners leave after passing a
                course&apos;s final quiz.
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

          <div className="mb-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
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
              <h2 className="text-2xl font-bold">Average by Course</h2>

              {courseAverages.length === 0 ? (
                <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
                  No feedback yet.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {courseAverages.map((course) => (
                    <div
                      key={course.slug}
                      className="flex items-center justify-between rounded-2xl border p-4"
                    >
                      <div>
                        <p className="font-bold">{course.title}</p>
                        <p className="text-sm text-gray-500">
                          {course.count} response
                          {course.count === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span className="flex items-center gap-1 text-lg font-extrabold text-[#632854]">
                        {course.average}
                        <Star size={18} className="fill-[#632854] text-[#632854]" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">All Feedback</h2>

            {feedback.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
                No feedback submitted yet.
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

                          <p className="mt-1 text-sm text-gray-600">
                            {item.course.title}
                          </p>

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
