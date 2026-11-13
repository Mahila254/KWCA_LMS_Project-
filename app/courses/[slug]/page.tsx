import type { Metadata } from "next";
import { courseMetadata } from "@/lib/courseMeta";
import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/isAdminRequest";
import CourseLearnerStats from "@/components/CourseLearnerStats";
import CourseContinueLink from "@/components/CourseContinueLink";
import PremiumLessonAccessButton from "@/components/PremiumLessonAccessButton";
import ScrollReveal from "@/components/ScrollReveal";
import FormattedText, { toSummary } from "@/components/FormattedText";
import { parseObjectives } from "@/lib/objectives";
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

  return "bg-lilac-tint text-accent";
}

export async function generateMetadata({
  params,
}: Pick<PageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  return courseMetadata(slug);
}

export default async function CourseDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const isAdminPreview =
    query.adminPreview === "true" && (await isAdminRequest());

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

  // Draft courses are only visible to an admin previewing them.
  if (!course || (course.status !== "PUBLISHED" && !isAdminPreview)) {
    return (
      <>
        {isAdminPreview ? <AdminNavbar /> : <Navbar />}

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-ink">
          <h1 className="text-4xl font-bold">Course not found</h1>

          <p className="mt-4 text-gray-600">
            This course may not exist or may have been removed.
          </p>

          <Link
            href={isAdminPreview ? "/admin/courses" : "/courses"}
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover"
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

  // Client components only get the slugs: passing whole lesson records
  // would send every lesson's content (premium too) to the browser.
  const lessonRefs = course.lessons.map((lesson: LessonRecord) => ({
    slug: lesson.slug,
  }));

  const practiceQuestions = course.quizQuestions.filter(
    (question: QuizQuestionRecord) => question.quizType === "PRACTICE"
  ).length;

  const finalQuestions = course.quizQuestions.filter(
    (question: QuizQuestionRecord) => question.quizType === "FINAL"
  ).length;

  const firstLesson = course.lessons[0];

  const objectives = parseObjectives(course.learningOutcomes);

  return (
    <>
      {isAdminPreview ? <AdminNavbar /> : <Navbar />}

      <main className="min-h-screen bg-gray-50 text-ink">
        {isAdminPreview && (
          <section className="border-b bg-deep px-6 py-4 text-white">
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
                className="rounded-full bg-surface px-5 py-3 font-bold text-ink hover:bg-gray-100"
              >
                Back to Admin Courses
              </Link>
            </div>
          </section>
        )}

        {/* The course picture fills the band and fades into navy on the
            left (top on phones), so the title sits on solid colour. */}
        <section className="relative isolate overflow-hidden bg-deep px-6 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSource}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full animate-ken-burns object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-deep/60 via-deep/90 to-deep lg:bg-gradient-to-r lg:from-deep lg:via-deep/85 lg:via-45% lg:to-deep/5" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-deep/60 to-transparent" />

          <ScrollReveal className="relative mx-auto max-w-7xl py-14 md:py-20 lg:py-24">
            <Link
              href={isAdminPreview ? "/admin/courses" : "/courses"}
              className="group mb-8 inline-flex items-center gap-2 font-bold text-white/80 hover:text-white"
            >
              <ArrowLeft
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              {isAdminPreview ? "Back to Admin Courses" : "Back to Courses"}
            </Link>

            <div className="max-w-2xl">
              <div className="mb-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-extrabold backdrop-blur-md">
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

                {/* Learners only ever see published courses. */}
                {isAdminPreview && (
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-extrabold backdrop-blur-md">
                    {course.status}
                  </span>
                )}
              </div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-highlight">
                About this course
              </p>

              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                {course.title.trim()}
              </h1>

              <div className="mt-6">
                <FormattedText
                  variant="intro"
                  tone="onDark"
                  text={
                    course.description ||
                    "A practical conservation learning course designed to support conservancy teams, leaders, and community-based conservation work."
                  }
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                {firstLesson ? (
                  isAdminPreview ? (
                    <Link
                      href={`/courses/${course.slug}/${firstLesson.slug}?adminPreview=true`}
                      className="inline-flex items-center gap-2 rounded-full bg-surface px-7 py-4 font-bold text-ink shadow-lg transition hover:-translate-y-1 hover:bg-tint"
                    >
                      Start Course
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <CourseContinueLink
                      courseSlug={course.slug}
                      lessons={lessonRefs}
                      initialLabel="Start Course"
                      className="inline-flex items-center gap-2 rounded-full bg-surface px-7 py-4 font-bold text-ink shadow-lg transition hover:-translate-y-1 hover:bg-tint"
                    />
                  )
                ) : (
                  <button
                    type="button"
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-white/20 px-7 py-4 font-bold text-white/70"
                  >
                    Lessons Coming Soon
                  </button>
                )}

                {isAdminPreview && (
                  <Link
                    href={`/admin/courses/${course.slug}/edit`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-md hover:border-white hover:bg-white/20"
                  >
                    Edit Course
                  </Link>
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {objectives.length > 0 && (
          <section
            aria-labelledby="objectives-heading"
            className="bg-canvas px-6 py-14 md:py-16"
          >
            <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
              <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Learning objectives
                </p>

                <h2
                  id="objectives-heading"
                  className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl"
                >
                  By the end of the course,{" "}
                  <em className="accent text-accent">you will be able to</em>
                </h2>
              </ScrollReveal>

              <ol className="mt-8 space-y-3 lg:mt-0">
                {objectives.map((objective, index) => (
                  <li key={index}>
                    <ScrollReveal delay={index * 70}>
                      <div className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-surface p-4 shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md sm:items-center sm:p-5">
                        <span
                          aria-hidden
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-extrabold text-white"
                        >
                          {index + 1}
                        </span>

                        <p className="pt-1.5 leading-7 text-gray-700 sm:pt-0 sm:text-lg">
                          {objective}
                        </p>
                      </div>
                    </ScrollReveal>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <CourseStat
              icon={<BookOpen size={28} />}
              label="Lessons"
              value={course.lessons.length.toString()}
            />

            {/* What the course builds up to, rather than a question count. */}
            <CourseStat
              icon={<GraduationCap size={28} />}
              label="At the End"
              value="Final Quiz"
              note={
                finalQuestions > 0
                  ? "Pass it to earn your certificate."
                  : "Being prepared. Pass it to earn your certificate."
              }
            />

            {/* Totals across all learners are for admins only; a learner
                sees whether they themself are enrolled and certified. */}
            {isAdminPreview ? (
              <>
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
              </>
            ) : (
              <CourseLearnerStats courseSlug={course.slug} />
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div className="rounded-3xl bg-surface p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="text-ink" size={30} />

                <h2 className="text-3xl font-bold">Course Overview</h2>
              </div>

              <p className="text-lg leading-8 text-gray-600">
                Here&apos;s what this course includes.
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
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="rounded-3xl bg-primary p-8 text-white shadow-sm">
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
                  isAdminPreview ? (
                    <Link
                      href={`/courses/${course.slug}/${firstLesson.slug}?adminPreview=true`}
                      className="flex items-center justify-between rounded-2xl bg-surface px-5 py-4 font-bold text-ink transition hover:-translate-y-1"
                    >
                      Continue to First Lesson
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <CourseContinueLink
                      courseSlug={course.slug}
                      lessons={lessonRefs}
                      initialLabel="Continue to First Lesson"
                      className="flex items-center justify-between rounded-2xl bg-surface px-5 py-4 font-bold text-ink transition hover:-translate-y-1"
                    />
                  )
                ) : (
                  <div className="rounded-2xl bg-white/10 px-5 py-4 font-bold text-white/70">
                    Lessons have not been added yet.
                  </div>
                )}

                {!isAdminPreview && (
                  <Link
                    href={`/pricing?courseId=${course.id}&courseSlug=${course.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-white/30 px-5 py-4 font-bold text-white hover:bg-surface hover:text-ink"
                  >
                    View Pricing Options
                    <ArrowRight size={18} />
                  </Link>
                )}

                {isAdminPreview && (
                  <Link
                    href={`/admin/courses/${course.slug}/lessons`}
                    className="flex items-center justify-between rounded-2xl border border-white/30 px-5 py-4 font-bold text-white hover:bg-surface hover:text-ink"
                  >
                    Manage Lessons
                    <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <ScrollReveal>
            <div className="rounded-3xl bg-surface p-8 shadow-sm">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-bold text-accent">Course Lessons</p>

                  <h2 className="mt-3 text-4xl font-extrabold">
                    Lesson Outline
                  </h2>

                  <p className="mt-3 max-w-2xl text-gray-600">
                    Follow the course lesson by lesson. Free preview lessons are
                    open to all learners, while premium lessons require access.
                  </p>
                </div>

                <span className="rounded-full bg-tint px-4 py-2 text-sm font-bold text-ink">
                  {course.lessons.length} Lessons
                </span>
              </div>

              {course.lessons.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-8 text-center">
                  <BookOpen
                    className="mx-auto text-ink"
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
                        className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-line p-5 transition hover:border-primary hover:bg-gray-50 md:grid-cols-[70px_1fr_auto] md:gap-5"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tint text-lg font-extrabold text-ink md:h-14 md:w-14 md:text-xl">
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
                              <span className="inline-flex items-center gap-1 rounded-full bg-lilac-tint px-3 py-1 text-xs font-bold text-accent">
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
                              <span className="inline-flex items-center gap-1 rounded-full bg-tint px-3 py-1 text-xs font-bold text-ink">
                                <FileText size={13} />
                                Reading
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold">{lesson.title}</h3>

                          {/* Premium lesson text must not be rendered here,
                              and free lessons only send a short summary. */}
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                            {isPreview || isAdminPreview
                              ? (lesson.content && toSummary(lesson.content)) ||
                                "Lesson content will appear here once added by the admin."
                              : "Unlock this premium lesson to read the full notes, video and reading."}
                          </p>
                        </div>

                        <div className="col-span-2 flex items-center md:col-span-1">
                          {isAdminPreview ? (
                            <Link
                              href={`/courses/${course.slug}/${lesson.slug}?adminPreview=true`}
                              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white hover:bg-primary-hover"
                            >
                              Preview
                              <ArrowRight size={17} />
                            </Link>
                          ) : isPreview ? (
                            <Link
                              href={`/courses/${course.slug}/${lesson.slug}`}
                              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white hover:bg-primary-hover"
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
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  // A word value with a line under it, styled like the learner's own
  // status cards (components/CourseLearnerStats) beside it.
  note?: string;
}) {
  return (
    <ScrollReveal>
      <div className="h-full rounded-3xl bg-surface p-4 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-ink sm:mb-4 sm:gap-3">
          {icon}
          <p className="text-xs font-bold text-gray-500 sm:text-sm">{label}</p>
        </div>

        {note ? (
          <>
            <p className="text-xl font-extrabold leading-tight sm:text-2xl">{value}</p>
            <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">{note}</p>
          </>
        ) : (
          <p className="text-4xl font-extrabold">{value}</p>
        )}
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
      <div className="mb-3 text-ink">{icon}</div>

      <p className="text-sm font-bold text-gray-500">{title}</p>

      <p className="mt-1 text-xl font-extrabold">{value}</p>
    </div>
  );
}