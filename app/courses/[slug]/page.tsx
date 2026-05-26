import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EnrollCourseButton from "@/components/EnrollCourseButton";
import PremiumLessonAccessButton from "@/components/PremiumLessonAccessButton";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  HelpCircle,
  Lock,
  PlayCircle,
  ShieldCheck,
  Star,
} from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    adminPreview?: string;
  }>;
};

export default async function CourseDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const isAdminPreview = query.adminPreview === "true";

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

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-[#07122E]">
            Course not found
          </h1>

          <Link
            href="/courses"
            className="mt-6 inline-block font-bold text-[#007F73]"
          >
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

  const firstPreviewLesson = previewLessons[0] || course.lessons[0] || null;

  const practiceQuestions = course.quizQuestions.filter(
    (question) => question.quizType === "PRACTICE"
  );

  const finalQuestions = course.quizQuestions.filter(
    (question) => question.quizType === "FINAL"
  );

  return (
    <>
      <Navbar />

      {isAdminPreview && (
        <div className="border-b bg-[#07122E] px-6 py-4 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold">Admin Preview Mode</p>
              <p className="text-sm text-white/70">
                You are viewing this course as it appears on the learner side.
              </p>
            </div>

            <Link
              href="/admin/courses"
              className="rounded-xl bg-white px-5 py-3 font-bold text-[#07122E] hover:bg-white/90"
            >
              Back to Course Management
            </Link>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Courses
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.9fr]">
              <div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                    <ShieldCheck size={16} />
                    {course.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full bg-[#F2FBF8] px-4 py-2 text-sm font-bold text-[#007F73]">
                    <BookOpen size={16} />
                    {course.category || "General"}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#D94A00]">
                    <Eye size={16} />
                    {course.accessType === "FREE_PREVIEW"
                      ? "Free Preview"
                      : course.accessType === "PREMIUM"
                      ? "Premium"
                      : "Subscription Only"}
                  </span>
                </div>

                <h1 className="mt-6 max-w-5xl text-5xl font-extrabold leading-tight">
                  {course.title}
                </h1>

                <p className="mt-5 max-w-4xl text-xl leading-9 text-gray-600">
                  {course.description ||
                    "This course introduces learners to practical conservation knowledge and skills."}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  {firstPreviewLesson && (
                    <Link
                      href={`/courses/${course.slug}/${firstPreviewLesson.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                    >
                      <PlayCircle size={19} />
                      Start Learning
                    </Link>
                  )}

                  <EnrollCourseButton courseSlug={course.slug} />

                  <Link
                    href={`/courses/${course.slug}/quiz/practice`}
                    className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-white"
                  >
                    <HelpCircle size={19} />
                    Practice Quiz
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
                    // eslint-disable-next-line @next/next/no-img-element
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
                        Video or image preview will appear here.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm font-bold text-gray-500">Lessons</p>
                    <p className="mt-1 text-3xl font-bold">
                      {course.lessons.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm font-bold text-gray-500">
                      Quiz Questions
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      {course.quizQuestions.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm font-bold text-gray-500">
                      Free Preview
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      {previewLessons.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm font-bold text-gray-500">Premium</p>
                    <p className="mt-1 text-3xl font-bold">
                      {premiumLessons.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Star className="text-[#007F73]" size={28} />
                <h2 className="text-3xl font-bold">Learning Outcomes</h2>
              </div>

              <p className="leading-8 text-gray-600">
                {course.learningOutcomes ||
                  "By the end of this course, learners will understand the key concepts, practical tools, and real-world applications covered in the course."}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Course Lessons</h2>
                  <p className="mt-2 text-gray-600">
                    Follow the lessons in order and track your learning
                    progress.
                  </p>
                </div>

                <span className="rounded-full bg-[#F2FBF8] px-4 py-2 text-sm font-bold text-[#007F73]">
                  {course.lessons.length} Lessons
                </span>
              </div>

              {course.lessons.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-6 text-gray-600">
                  Lessons have not been added to this course yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => {
                    const isPreview = lesson.accessType === "PREVIEW";

                    return (
                      <div
                        key={lesson.id}
                        className="block rounded-2xl border p-5 transition hover:border-[#007F73] hover:bg-gray-50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F2FBF8] font-bold text-[#007F73]">
                              {index + 1}
                            </div>

                            <div>
                              <h3 className="text-xl font-bold">
                                {lesson.title}
                              </h3>

                              <p className="mt-2 line-clamp-2 text-gray-600">
                                {lesson.content ||
                                  "Lesson content will be added here."}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-3">
                                {lesson.videoUrl && (
                                  <span className="inline-flex items-center gap-1 text-sm font-bold text-[#007F73]">
                                    <PlayCircle size={15} />
                                    Video
                                  </span>
                                )}

                                {lesson.readingUrl && (
                                  <span className="inline-flex items-center gap-1 text-sm font-bold text-[#007F73]">
                                    <FileText size={15} />
                                    Reading
                                  </span>
                                )}

                                <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-500">
                                  <Clock size={15} />
                                  Lesson {index + 1}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            {isPreview ? (
                              <Link
                                href={`/courses/${course.slug}/${lesson.slug}`}
                                className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-200"
                              >
                                <Eye size={15} />
                                Free Preview
                              </Link>
                            ) : (
                              <PremiumLessonAccessButton
                                courseId={course.id}
                                courseSlug={course.slug}
                                lessonSlug={lesson.slug}
                              />
                            )}
                          </div>
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
                {firstPreviewLesson && (
                  <Link
                    href={`/courses/${course.slug}/${firstPreviewLesson.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                  >
                    <PlayCircle size={18} />
                    Start First Lesson
                  </Link>
                )}

                <EnrollCourseButton courseSlug={course.slug} />

                <Link
                  href={`/courses/${course.slug}/quiz/practice`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <HelpCircle size={18} />
                  Practice Quiz
                </Link>

                <Link
                  href={`/courses/${course.slug}/quiz/final`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <CheckCircle size={18} />
                  Final Quiz
                </Link>

                <Link
                  href={`/courses/${course.slug}/certificate`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <GraduationCap size={18} />
                  View Certificate
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Quiz Availability</h2>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#F2FBF8] p-5">
                  <p className="font-bold text-[#007F73]">Practice Quiz</p>
                  <p className="mt-1 text-3xl font-bold">
                    {practiceQuestions.length}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Questions</p>
                </div>

                <div className="rounded-2xl bg-orange-50 p-5">
                  <p className="font-bold text-[#D94A00]">Final Quiz</p>
                  <p className="mt-1 text-3xl font-bold">
                    {finalQuestions.length}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Questions</p>
                </div>
              </div>
            </div>

            {isAdminPreview && (
              <div className="rounded-3xl border-2 border-[#07122E] bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold">Admin Shortcut</h2>

                <p className="mt-3 leading-7 text-gray-600">
                  This shortcut is only visible because you opened the course in
                  admin preview mode.
                </p>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/admin/courses"
                    className="block rounded-xl bg-[#07122E] px-5 py-3 text-center font-bold text-white hover:bg-[#101b3d]"
                  >
                    Back to Course Management
                  </Link>

                  <Link
                    href={`/admin/courses/${course.slug}/edit`}
                    className="block rounded-xl border px-5 py-3 text-center font-bold hover:bg-gray-50"
                  >
                    Edit This Course
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}