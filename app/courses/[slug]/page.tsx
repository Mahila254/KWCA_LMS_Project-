import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EnrollCourseButton from "@/components/EnrollCourseButton";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Lock,
  PlayCircle,
  CheckCircle,
  GraduationCap,
  ClipboardList,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
      quizQuestions: true,
    },
  });

  if (!course) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-4xl font-bold">Course not found</h1>

          <p className="mt-4 text-gray-600">
            This course may not exist or may have been removed.
          </p>

          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const previewLessons = course.lessons.filter(
    (lesson) => lesson.accessType === "PREVIEW"
  );

  const premiumLessons = course.lessons.filter(
    (lesson) => lesson.accessType === "PREMIUM"
  );

  const practiceQuestions = course.quizQuestions.filter(
    (question) => question.quizType === "PRACTICE"
  );

  const finalQuestions = course.quizQuestions.filter(
    (question) => question.quizType === "FINAL"
  );

  const courseAccess =
    course.accessType === "FREE_PREVIEW"
      ? "Free Preview"
      : course.accessType === "SUBSCRIPTION_ONLY"
      ? "Subscription Only"
      : "Premium";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Courses
            </Link>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
              <div>
                <div className="mb-5 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#007F73]">
                    {course.category || "General"}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                    <Eye size={15} />
                    {courseAccess}
                  </span>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      course.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </div>

                <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
                  {course.title}
                </h1>

                <p className="mt-6 max-w-4xl text-lg leading-8 text-gray-600">
                  {course.description ||
                    "This course is designed to support conservancy leaders, managers, board members, and community stakeholders with practical learning."}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <EnrollCourseButton courseSlug={course.slug} />

                  {course.lessons.length > 0 && previewLessons[0] ? (
                    <Link
                      href={`/courses/${course.slug}/${previewLessons[0].slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-white"
                    >
                      <PlayCircle size={18} />
                      Start Preview Lesson
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border px-6 py-3 font-bold text-gray-400"
                    >
                      <PlayCircle size={18} />
                      Lessons Coming Soon
                    </button>
                  )}

                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-white"
                  >
                    <Lock size={18} />
                    View Pricing
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex aspect-video items-center justify-center rounded-3xl bg-[#07122E] text-white">
                  {course.introVideoUrl ? (
                    <iframe
                      src={course.introVideoUrl}
                      title={course.title}
                      className="h-full w-full rounded-3xl"
                      allowFullScreen
                    />
                  ) : course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-full w-full rounded-3xl object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <GraduationCap className="mx-auto mb-4" size={64} />

                      <p className="text-2xl font-bold">Course Preview</p>

                      <p className="mt-2 text-white/70">
                        Course image or video will appear here.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <span className="font-bold text-gray-600">
                      Total Lessons
                    </span>
                    <span className="font-extrabold">
                      {course.lessons.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <span className="font-bold text-gray-600">
                      Free Preview
                    </span>
                    <span className="font-extrabold">
                      {previewLessons.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <span className="font-bold text-gray-600">
                      Premium Lessons
                    </span>
                    <span className="font-extrabold">
                      {premiumLessons.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <CheckCircle className="text-[#007F73]" size={28} />
                <h2 className="text-3xl font-bold">Learning Outcomes</h2>
              </div>

              <p className="leading-8 text-gray-600">
                {course.learningOutcomes ||
                  "By the end of this course, learners will understand the key concepts, practical tools, and management approaches needed to apply the topic in a conservancy setting."}
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b px-8 py-6">
                <h2 className="text-3xl font-bold">Course Lessons</h2>

                <p className="mt-2 text-gray-600">
                  Explore the course outline and access available preview
                  lessons.
                </p>
              </div>

              {course.lessons.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                    <BookOpen size={32} />
                  </div>

                  <h3 className="text-2xl font-bold">No lessons yet</h3>

                  <p className="mt-3 text-gray-600">
                    Lessons added by the admin will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {course.lessons.map((lesson, index) => {
                    const isPreview = lesson.accessType === "PREVIEW";

                    return (
                      <div
                        key={lesson.id}
                        className="grid gap-5 px-8 py-6 md:grid-cols-[60px_1fr_auto]"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-lg font-extrabold text-[#007F73]">
                          {index + 1}
                        </div>

                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            {isPreview ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                <Eye size={13} />
                                Free Preview
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#D94A00]">
                                <Lock size={13} />
                                Premium Locked
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold">{lesson.title}</h3>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                            {lesson.content ||
                              "Lesson content will appear once added by the admin."}
                          </p>
                        </div>

                        <div className="flex items-start">
                          {isPreview ? (
                            <Link
                              href={`/courses/${course.slug}/${lesson.slug}`}
                              className="rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                            >
                              Open Lesson
                            </Link>
                          ) : (
                            <Link
                              href="/pricing"
                              className="rounded-xl border px-5 py-3 font-bold hover:bg-gray-50"
                            >
                              Unlock
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Course Actions</h2>

              <div className="mt-6 space-y-4">
                <EnrollCourseButton courseSlug={course.slug} />

                <Link
                  href={`/courses/${course.slug}/quiz/practice`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <ClipboardList size={18} />
                  Practice Quiz
                </Link>

                <Link
                  href={`/courses/${course.slug}/quiz/final`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D94A00] px-6 py-3 font-bold text-[#D94A00] hover:bg-orange-50"
                >
                  <Award size={18} />
                  Final Quiz
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Quiz Availability</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                  <span className="font-bold text-gray-600">
                    Practice Questions
                  </span>
                  <span className="font-extrabold">
                    {practiceQuestions.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                  <span className="font-bold text-gray-600">
                    Final Questions
                  </span>
                  <span className="font-extrabold">
                    {finalQuestions.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#07122E] p-8 text-white">
              <h2 className="text-2xl font-bold">Need full access?</h2>

              <p className="mt-3 leading-7 text-white/70">
                Unlock premium lessons, final assessments, downloadable
                resources, and certificates.
              </p>

              <Link
                href="/pricing"
                className="mt-6 inline-flex rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                View Pricing
              </Link>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}