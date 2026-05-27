import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MarkLessonCompleteButton from "@/components/MarkLessonCompleteButton";
import PremiumLessonGate from "@/components/PremiumLessonGate";
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
  searchParams: Promise<{
    adminPreview?: string;
  }>;
};

type LessonRecord = {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  content: string | null;
  videoUrl: string | null;
  readingUrl: string | null;
  notes: string | null;
  order: number;
  accessType: "PREVIEW" | "PREMIUM";
  createdAt: Date;
  updatedAt: Date;
};

type CourseWithLessons = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  introVideoUrl: string | null;
  learningOutcomes: string | null;
  numberOfLessons: number;
  status: "DRAFT" | "PUBLISHED";
  accessType: "FREE_PREVIEW" | "PREMIUM" | "SUBSCRIPTION_ONLY";
  createdAt: Date;
  updatedAt: Date;
  lessons: LessonRecord[];
};

function getYoutubeEmbedUrl(videoUrl: string | null) {
  if (!videoUrl) return null;

  if (videoUrl.includes("youtube.com/embed/")) {
    return videoUrl;
  }

  if (videoUrl.includes("youtube.com/watch?v=")) {
    const videoId = videoUrl.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;
  }

  if (videoUrl.includes("youtu.be/")) {
    const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;
  }

  return videoUrl;
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { slug, lesson } = await params;
  const query = await searchParams;

  const isAdminPreview = query.adminPreview === "true";

  const course: CourseWithLessons | null = await prisma.course.findUnique({
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
        {isAdminPreview ? <AdminNavbar /> : <Navbar />}

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-[#07122E]">
            Course not found
          </h1>

          <Link
            href={isAdminPreview ? "/admin/courses" : "/courses"}
            className="mt-6 inline-block font-bold text-[#007F73]"
          >
            Back to Courses
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const currentLesson = course.lessons.find(
    (item: LessonRecord) => item.slug === lesson
  );

  if (!currentLesson) {
    return (
      <>
        {isAdminPreview ? <AdminNavbar /> : <Navbar />}

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-[#07122E]">
            Lesson not found
          </h1>

          <Link
            href={
              isAdminPreview
                ? `/admin/courses/${course.slug}/lessons`
                : `/courses/${slug}`
            }
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
    (item: LessonRecord) => item.id === currentLesson.id
  );

  const lessonNumber = lessonIndex + 1;

  const previousLesson =
    lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;

  const nextLesson =
    lessonIndex < course.lessons.length - 1
      ? course.lessons[lessonIndex + 1]
      : null;

  const isPreview = currentLesson.accessType === "PREVIEW";

  const progressPercent =
    course.lessons.length > 0
      ? Math.round((lessonNumber / course.lessons.length) * 100)
      : 0;

  const videoEmbedUrl = getYoutubeEmbedUrl(currentLesson.videoUrl);

  const lessonHref = (lessonSlug: string) =>
    isAdminPreview
      ? `/courses/${course.slug}/${lessonSlug}?adminPreview=true`
      : `/courses/${course.slug}/${lessonSlug}`;

  const backToCourseHref = isAdminPreview
    ? `/admin/courses/${course.slug}/lessons`
    : `/courses/${course.slug}`;

  const lessonContent = (
    <main className="min-h-screen bg-gray-50 text-[#07122E]">
      {isAdminPreview && (
        <section className="border-b bg-[#07122E] px-6 py-4 text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white/70">
                Admin Preview Mode
              </p>
              <p className="font-bold">
                You are viewing this lesson as an administrator.
              </p>
            </div>

            <Link
              href={`/admin/courses/${course.slug}/lessons`}
              className="rounded-xl bg-white px-5 py-3 font-bold text-[#07122E] hover:bg-gray-100"
            >
              Back to Admin Lessons
            </Link>
          </div>
        </section>
      )}

      <section className="bg-[#F2FBF8] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href={backToCourseHref}
            className="mb-6 inline-flex items-center gap-2 font-bold text-[#007F73]"
          >
            <ArrowLeft size={18} />
            {isAdminPreview ? "Back to Admin Lessons" : "Back to Course"}
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <p className="font-bold text-[#007F73]">
              Lesson {lessonNumber} of {course.lessons.length}
            </p>

            {isPreview ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                <Eye size={14} />
                Free Preview
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-[#D94A00]">
                <Lock size={14} />
                Premium Lesson
              </span>
            )}

            {isAdminPreview && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#07122E] px-3 py-1 text-sm font-bold text-white">
                Admin Preview
              </span>
            )}
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
            {course.lessons.map((item: LessonRecord, index: number) => {
              const itemIsPreview = item.accessType === "PREVIEW";
              const activeLesson = item.id === currentLesson.id;
              const itemCompleted = index + 1 < lessonNumber;

              return (
                <Link
                  key={item.id}
                  href={lessonHref(item.slug)}
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
                              Premium
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

          {!isAdminPreview && (
            <div className="mt-6 rounded-2xl bg-gray-50 p-5">
              <p className="font-bold">Need full access?</p>

              <p className="mt-2 text-sm text-gray-600">
                Unlock all premium lessons, quizzes, resources, and
                certificates.
              </p>

              <Link
                href={`/pricing?courseId=${course.id}&courseSlug=${course.slug}`}
                className="mt-4 inline-block rounded-xl bg-[#007F73] px-4 py-3 text-sm font-bold text-white hover:bg-[#00665d]"
              >
                View Pricing
              </Link>
            </div>
          )}
        </aside>

        <section className="space-y-8 lg:col-span-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex aspect-video items-center justify-center rounded-3xl bg-[#07122E] text-white">
              {videoEmbedUrl ? (
                <iframe
                  src={videoEmbedUrl}
                  title={currentLesson.title}
                  className="h-full w-full rounded-3xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
              {isPreview ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  <Eye size={15} />
                  Free Preview Lesson
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#D94A00]">
                  <Lock size={15} />
                  Premium Lesson
                </span>
              )}

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

          {!isAdminPreview && (
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
          )}

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {previousLesson ? (
                <Link
                  href={lessonHref(previousLesson.slug)}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <ArrowLeft size={18} />
                  Previous Lesson
                </Link>
              ) : (
                <Link
                  href={backToCourseHref}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <ArrowLeft size={18} />
                  {isAdminPreview ? "Back to Admin Lessons" : "Back to Course"}
                </Link>
              )}

              {nextLesson ? (
                <Link
                  href={lessonHref(nextLesson.slug)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  Next Lesson
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  href={
                    isAdminPreview
                      ? `/admin/courses/${course.slug}/lessons`
                      : `/courses/${slug}/quiz/practice`
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  {isAdminPreview ? "Back to Admin Lessons" : "Continue to Quiz"}
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );

  return (
    <>
      {isAdminPreview ? <AdminNavbar /> : <Navbar />}

      {isAdminPreview ? (
        lessonContent
      ) : !isPreview ? (
        <PremiumLessonGate courseId={course.id} courseSlug={course.slug}>
          {lessonContent}
        </PremiumLessonGate>
      ) : (
        lessonContent
      )}

      <Footer />
    </>
  );
}