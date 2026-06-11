import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EnrollCourseButton from "@/components/EnrollCourseButton";
import PremiumLessonAccessButton from "@/components/PremiumLessonAccessButton";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Eye,
  FileText,
  GraduationCap,
  Lock,
  PlayCircle,
  ShieldCheck,
  Users,
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

type QuizQuestionRecord = {
  id: string;
  quizType: "PRACTICE" | "FINAL";
};

type CourseRecord = {
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
  quizQuestions: QuizQuestionRecord[];
  enrollments: {
    id: string;
  }[];
  certificates: {
    id: string;
  }[];
};

function getAccessLabel(accessType: CourseRecord["accessType"]) {
  if (accessType === "FREE_PREVIEW") return "Free Preview Available";
  if (accessType === "SUBSCRIPTION_ONLY") return "Subscription Access";
  return "Premium Access Required";
}

function getAccessBadgeClass(accessType: CourseRecord["accessType"]) {
  if (accessType === "FREE_PREVIEW") {
    return "bg-green-100 text-green-700";
  }

  if (accessType === "SUBSCRIPTION_ONLY") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-orange-100 text-[#D94A00]";
}

export default async function CourseDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const isAdminPreview = query.adminPreview === "true";

  const course: CourseRecord | null = await prisma.course.findUnique({
    where: {
      slug,
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
      quizQuestions: {
        select: {
          id: true,
          quizType: true,
        },
      },
      enrollments: {
        select: {
          id: true,
        },
      },
      certificates: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!course) {
    return (
      <>
        {isAdminPreview ? <AdminNavbar /> : <Navbar />}

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-4xl font-bold">Course not found</h1>

          <p className="mt-4 text-gray-600">
            This course may not exist or may have been removed.
          </p>

          <Link
            href={isAdminPreview ? "/admin/courses" : "/courses"}
            className="mt-6 inline-flex rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
          >
            Back to Courses
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const imageSource =
    course.imageUrl && course.imageUrl.trim() !== ""
      ? course.imageUrl
      : "/images/course-placeholder.jpg";

  const previewLessons = course.lessons.filter(
    (lesson: LessonRecord) => lesson.accessType === "PREVIEW"
  ).length;

  const premiumLessons = course.lessons.filter(
    (lesson: LessonRecord) => lesson.accessType === "PREMIUM"
  ).length;

  const practiceQuestions = course.quizQuestions.filter(
    (question: QuizQuestionRecord) => question.quizType === "PRACTICE"
  ).length;

  const finalQuestions = course.quizQuestions.filter(
    (question: QuizQuestionRecord) => question.quizType === "FINAL"
  ).length;

  const firstLesson = course.lessons[0];

  return (
    <>
      {isAdminPreview ? <AdminNavbar /> : <Navbar />}

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        {isAdminPreview && (
          <section className="border-b bg-[#07122E] px-6 py-4 text-white">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white/70">
                  Admin Preview Mode
                </p>

                <p className="font-bold">
                  You are previewing this course as an administrator.
                </p>
              </div>

              <Link
                href="/admin/courses"
                className="rounded-xl bg-white px-5 py-3 font-bold text-[#07122E] hover:bg-gray-100"
              >
                Back to Admin Courses
              </Link>
            </div>
          </section>
        )}

        <section className="relative overflow-hidden px-6 py-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${imageSource}')`,
            }}
          />

          <div className="absolute inset-0 bg-white/70" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#F2FBF8]/85 via-white/80 to-gray-50" />

          <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-[#007F73]/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-[#D94A00]/20 blur-3xl" />

          <ScrollReveal className="relative mx-auto max-w-7xl">
            <Link
              href={isAdminPreview ? "/admin/courses" : "/courses"}
              className="mb-8 inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              {isAdminPreview ? "Back to Admin Courses" : "Back to Courses"}
            </Link>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#007F73] shadow-sm">
                    {course.category || "General"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ${getAccessBadgeClass(
                      course.accessType
                    )}`}
                  >
                    {course.accessType === "FREE_PREVIEW" ? (
                      <Eye size={15} />
                    ) : (
                      <Lock size={15} />
                    )}

                    {getAccessLabel(course.accessType)}
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#07122E] shadow-sm">
                    {course.status}
                  </span>
                </div>

                <h1 className="max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">
                  {course.title}
                </h1>

                <p className="mt-6 max-w-3xl text-xl leading-9 text-gray-700">
                  {course.description ||
                    "A practical conservation learning course designed to support conservancy teams, leaders, and community-based conservation work."}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  {firstLesson ? (
                    <Link
                      href={
                        isAdminPreview
                          ? `/courses/${course.slug}/${firstLesson.slug}?adminPreview=true`
                          : `/courses/${course.slug}/${firstLesson.slug}`
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#00665d]"
                    >
                      Start Course
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-gray-300 px-7 py-4 font-bold text-gray-600"
                    >
                      Lessons Coming Soon
                    </button>
                  )}

                  {!isAdminPreview && <EnrollCourseButton courseSlug={course.slug} />}

                  {isAdminPreview && (
                    <Link
                      href={`/admin/courses/${course.slug}/edit`}
                      className="inline-flex items-center gap-2 rounded-xl border bg-white px-7 py-4 font-bold hover:bg-gray-50"
                    >
                      Edit Course
                    </Link>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="relative h-[380px] overflow-hidden rounded-3xl bg-[#07122E]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSource}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#07122E]/75 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-sm font-bold text-white/80">
                      KWCA LMS Course
                    </p>

                    <h2 className="mt-2 text-3xl font-extrabold">
                      {course.title}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-4">
            <CourseStat
              icon={<BookOpen size={28} />}
              label="Lessons"
              value={course.lessons.length.toString()}
            />

            <CourseStat
              icon={<ClipboardList size={28} />}
              label="Quiz Questions"
              value={course.quizQuestions.length.toString()}
            />

            <CourseStat
              icon={<Users size={28} />}
              label="Enrollments"
              value={course.enrollments.length.toString()}
            />

            <CourseStat
              icon={<Award size={28} />}
              label="Certificates"
              value={course.certificates.length.toString()}
            />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="text-[#007F73]" size={30} />

                <h2 className="text-3xl font-bold">Course Overview</h2>
              </div>

              <p className="text-lg leading-9 text-gray-600">
                {course.description ||
                  "This course provides practical knowledge and tools to help learners understand and apply strong conservation management practices."}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <InfoBox
                  title="Preview Lessons"
                  value={`${previewLessons} free lesson${
                    previewLessons === 1 ? "" : "s"
                  }`}
                  icon={<Eye size={22} />}
                />

                <InfoBox
                  title="Premium Lessons"
                  value={`${premiumLessons} premium lesson${
                    premiumLessons === 1 ? "" : "s"
                  }`}
                  icon={<Lock size={22} />}
                />

                <InfoBox
                  title="Practice Quiz"
                  value={`${practiceQuestions} question${
                    practiceQuestions === 1 ? "" : "s"
                  }`}
                  icon={<ClipboardList size={22} />}
                />

                <InfoBox
                  title="Final Quiz"
                  value={`${finalQuestions} question${
                    finalQuestions === 1 ? "" : "s"
                  }`}
                  icon={<GraduationCap size={22} />}
                />
              </div>

              {course.learningOutcomes && (
                <div className="mt-8 rounded-2xl bg-gray-50 p-6">
                  <h3 className="text-2xl font-bold">Learning Outcomes</h3>

                  <div className="mt-4 space-y-3 text-gray-600">
                    {course.learningOutcomes
                      .split(/\n\s*\n/)
                      .filter((item: string) => item.trim().length > 0)
                      .map((item: string, index: number) => (
                        <p key={index} className="leading-8">
                          {item.trim()}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="rounded-3xl bg-[#07122E] p-8 text-white shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <PlayCircle size={30} />

                <h2 className="text-3xl font-bold">Start Learning</h2>
              </div>

              <p className="leading-8 text-white/75">
                Begin with the free preview lessons, then unlock premium
                lessons, quizzes, and certificates when you are ready.
              </p>

              <div className="mt-8 space-y-4">
                {firstLesson ? (
                  <Link
                    href={
                      isAdminPreview
                        ? `/courses/${course.slug}/${firstLesson.slug}?adminPreview=true`
                        : `/courses/${course.slug}/${firstLesson.slug}`
                    }
                    className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-bold text-[#07122E] transition hover:-translate-y-1"
                  >
                    Continue to First Lesson
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <div className="rounded-2xl bg-white/10 px-5 py-4 font-bold text-white/70">
                    Lessons have not been added yet.
                  </div>
                )}

                {!isAdminPreview && (
                  <Link
                    href={`/pricing?courseId=${course.id}&courseSlug=${course.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-white/30 px-5 py-4 font-bold text-white hover:bg-white hover:text-[#07122E]"
                  >
                    View Pricing Options
                    <ArrowRight size={18} />
                  </Link>
                )}

                {isAdminPreview && (
                  <Link
                    href={`/admin/courses/${course.slug}/lessons`}
                    className="flex items-center justify-between rounded-2xl border border-white/30 px-5 py-4 font-bold text-white hover:bg-white hover:text-[#07122E]"
                  >
                    Manage Lessons
                    <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <ScrollReveal>
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-bold text-[#D94A00]">Course Lessons</p>

                  <h2 className="mt-3 text-4xl font-extrabold">
                    Lesson Outline
                  </h2>

                  <p className="mt-3 max-w-2xl text-gray-600">
                    Follow the course lesson by lesson. Free preview lessons are
                    open to all learners, while premium lessons require access.
                  </p>
                </div>

                <span className="rounded-full bg-[#F2FBF8] px-4 py-2 text-sm font-bold text-[#007F73]">
                  {course.lessons.length} Lessons
                </span>
              </div>

              {course.lessons.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-8 text-center">
                  <BookOpen
                    className="mx-auto text-[#007F73]"
                    size={42}
                  />

                  <h3 className="mt-4 text-2xl font-bold">
                    No lessons added yet
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Lessons will appear here once they are added by the admin.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.lessons.map((lesson: LessonRecord, index: number) => {
                    const isPreview = lesson.accessType === "PREVIEW";

                    return (
                      <div
                        key={lesson.id}
                        className="grid gap-5 rounded-2xl border p-5 transition hover:border-[#007F73] hover:bg-gray-50 md:grid-cols-[70px_1fr_auto]"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-xl font-extrabold text-[#007F73]">
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
                                Premium
                              </span>
                            )}

                            {lesson.videoUrl && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                <PlayCircle size={13} />
                                Video
                              </span>
                            )}

                            {lesson.readingUrl && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#F2FBF8] px-3 py-1 text-xs font-bold text-[#007F73]">
                                <FileText size={13} />
                                Reading
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold">{lesson.title}</h3>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                            {lesson.content ||
                              "Lesson content will appear here once added by the admin."}
                          </p>
                        </div>

                        <div className="flex items-center">
                          {isAdminPreview ? (
                            <Link
                              href={`/courses/${course.slug}/${lesson.slug}?adminPreview=true`}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                            >
                              Preview
                              <ArrowRight size={17} />
                            </Link>
                          ) : isPreview ? (
                            <Link
                              href={`/courses/${course.slug}/${lesson.slug}`}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                            >
                              Start
                              <ArrowRight size={17} />
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
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function CourseStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <ScrollReveal>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3 text-[#007F73]">
          {icon}
          <p className="text-sm font-bold text-gray-500">{label}</p>
        </div>

        <p className="text-4xl font-extrabold">{value}</p>
      </div>
    </ScrollReveal>
  );
}

function InfoBox({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5">
      <div className="mb-3 text-[#007F73]">{icon}</div>

      <p className="text-sm font-bold text-gray-500">{title}</p>

      <p className="mt-1 text-xl font-extrabold">{value}</p>
    </div>
  );
}