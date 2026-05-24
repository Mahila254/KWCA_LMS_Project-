import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MarkLessonCompleteButton from "@/components/MarkLessonCompleteButton";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Lock,
  PlayCircle,
  FileText,
  Download,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
    lesson: string;
  }>;
};

export default async function LessonPage({ params }: PageProps) {
  const { slug, lesson } = await params;

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

  const currentLesson = course.lessons.find((item) => item.slug === lesson);

  if (!currentLesson) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-[#07122E]">
            Lesson not found
          </h1>

          <Link
            href={`/courses/${slug}`}
            className="mt-6 inline-block font-bold text-[#007F73]"
          >
            Back to Course
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const lessonIndex = course.lessons.findIndex(
    (item) => item.id === currentLesson.id
  );

  const lessonNumber = lessonIndex + 1;

  const previousLesson =
    lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;

  const nextLesson =
    lessonIndex < course.lessons.length - 1
      ? course.lessons[lessonIndex + 1]
      : null;

  const isPreview = currentLesson.accessType === "PREVIEW";

  const progressPercent = Math.round(
    (lessonNumber / course.lessons.length) * 100
  );

  if (!isPreview) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24">
          <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-[#D94A00]">
              <Lock size={32} />
            </div>

            <h1 className="text-4xl font-bold text-[#07122E]">
              Premium Lesson Locked
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              This lesson is part of the premium course content. Unlock the full
              course through payment or subscription.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                Unlock Course
              </Link>

              <Link
                href={`/courses/${slug}`}
                className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
              >
                Back to Course
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href={`/courses/${slug}`}
              className="mb-6 inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Course
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <p className="font-bold text-[#007F73]">
                Lesson {lessonNumber} of {course.lessons.length}
              </p>

              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                <Eye size={14} />
                Free Preview
              </span>
            </div>

            <h1 className="mt-4 max-w-5xl text-5xl font-extrabold">
              {currentLesson.title}
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              {course.title}
            </p>

            <div className="mt-8 max-w-3xl">
              <div className="mb-2 flex justify-between text-sm font-bold text-gray-600">
                <span>Lesson Position</span>
                <span>{progressPercent}%</span>
              </div>

              <div className="h-3 rounded-full bg-white">
                <div
                  className="h-3 rounded-full bg-[#007F73]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-4">
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:col-span-1">
            <h2 className="text-xl font-bold">Course Outline</h2>

            <p className="mt-2 text-sm text-gray-500">
              Track your lessons and unlock premium content.
            </p>

            <div className="mt-6 space-y-3">
              {course.lessons.map((item, index) => {
                const itemIsPreview = item.accessType === "PREVIEW";
                const activeLesson = item.id === currentLesson.id;
                const itemCompleted = index + 1 < lessonNumber;

                return (
                  <Link
                    key={item.id}
                    href={
                      itemIsPreview
                        ? `/courses/${course.slug}/${item.slug}`
                        : "/pricing"
                    }
                    className={`block rounded-xl border p-4 transition-all duration-300 hover:shadow-sm ${
                      activeLesson
                        ? "border-[#007F73] bg-[#F2FBF8]"
                        : "border-gray-200 bg-white hover:border-[#007F73]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Lesson {index + 1}
                        </p>

                        <h3 className="mt-1 font-bold leading-snug">
                          {item.title}
                        </h3>

                        <p className="mt-3 inline-flex items-center gap-1 text-sm">
                          {itemCompleted ? (
                            <>
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <span className="font-semibold text-green-700">
                                Completed
                              </span>
                            </>
                          ) : itemIsPreview ? (
                            <>
                              <Eye size={14} className="text-green-600" />
                              <span className="font-semibold text-green-700">
                                Free Preview
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock size={14} className="text-[#D94A00]" />
                              <span className="font-semibold text-[#D94A00]">
                                Premium Locked
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      {itemCompleted ? (
                        <CheckCircle className="text-green-600" size={18} />
                      ) : itemIsPreview ? (
                        <Eye className="text-green-600" size={18} />
                      ) : (
                        <Lock className="text-[#D94A00]" size={18} />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-5">
              <p className="font-bold">Need full access?</p>

              <p className="mt-2 text-sm text-gray-600">
                Unlock all premium lessons, quizzes, resources, and
                certificates.
              </p>

              <Link
                href="/pricing"
                className="mt-4 inline-block rounded-xl bg-[#007F73] px-4 py-3 text-sm font-bold text-white hover:bg-[#00665d]"
              >
                View Pricing
              </Link>
            </div>
          </aside>

          <section className="space-y-8 lg:col-span-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex aspect-video items-center justify-center rounded-3xl bg-[#07122E] text-white">
                {currentLesson.videoUrl ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="h-full w-full rounded-3xl"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center">
                    <PlayCircle className="mx-auto mb-4" size={72} />

                    <p className="text-3xl font-bold">Lesson Video</p>

                    <p className="mt-2 text-white/70">
                      Video content will be embedded here.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  <Eye size={15} />
                  Free Preview Lesson
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-[#F2FBF8] px-4 py-2 text-sm font-bold text-[#007F73]">
                  <BookOpen size={15} />
                  Reading Included
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#D94A00]">
                  <HelpCircle size={15} />
                  Quiz at End
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="text-[#007F73]" size={26} />

                <h2 className="text-3xl font-bold">Lesson Notes</h2>
              </div>

              <p className="leading-8 text-gray-600">
                {currentLesson.content ||
                  "Lesson content will appear here once added by the admin."}
              </p>

              {currentLesson.notes && (
                <div className="mt-8 rounded-2xl bg-gray-50 p-6">
                  <h3 className="text-xl font-bold">Key Takeaway</h3>

                  <p className="mt-3 leading-8 text-gray-600">
                    {currentLesson.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <FileText className="text-[#007F73]" size={26} />

                  <h2 className="text-2xl font-bold">Required Reading</h2>
                </div>

                <p className="leading-8 text-gray-600">
                  Read the introductory material and reflect on how this lesson
                  connects to conservancy governance and management.
                </p>

                {currentLesson.readingUrl ? (
                  <Link
                    href={currentLesson.readingUrl}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-bold hover:bg-gray-50"
                  >
                    <Download size={18} />
                    Download Reading
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-bold text-gray-400"
                  >
                    <Download size={18} />
                    Reading Coming Soon
                  </button>
                )}
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <HelpCircle className="text-[#D94A00]" size={26} />

                  <h2 className="text-2xl font-bold">Practice Activity</h2>
                </div>

                <p className="leading-8 text-gray-600">
                  Reflect on this lesson and check your understanding before
                  moving to the final graded quiz.
                </p>

                <Link
                  href={`/courses/${slug}/quiz/practice`}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  Start Practice Quiz
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Lesson Progress</h2>

                  <p className="mt-2 text-gray-600">
                    Mark this lesson as complete to update your course progress
                    on your learner profile.
                  </p>
                </div>

                <MarkLessonCompleteButton
                  courseSlug={course.slug}
                  lessonSlug={currentLesson.slug}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {previousLesson ? (
                  <Link
                    href={`/courses/${slug}/${previousLesson.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    <ArrowLeft size={18} />
                    Previous Lesson
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    <ArrowLeft size={18} />
                    Back to Course
                  </Link>
                )}

                {nextLesson ? (
                  nextLesson.accessType === "PREVIEW" ? (
                    <Link
                      href={`/courses/${slug}/${nextLesson.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                    >
                      Next Lesson
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                    >
                      Unlock Next Lesson
                      <Lock size={18} />
                    </Link>
                  )
                ) : (
                  <Link
                    href={`/courses/${slug}/quiz/practice`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                  >
                    Continue to Quiz
                    <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}