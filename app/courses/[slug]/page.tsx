import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import EnrollCourseButton from "@/components/EnrollCourseButton";
import PremiumLessonAccessButton from "@/components/PremiumLessonAccessButton";
import CourseAccessBadge from "@/components/CourseAccessBadge";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  Lock,
  PlayCircle,
  Award,
  ClipboardList,
  Users,
  ArrowRight,
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

type EnrollmentRecord = {
  id: string;
};

type CertificateRecord = {
  id: string;
};

type CourseDetailsRecord = {
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
  enrollments: EnrollmentRecord[];
  certificates: CertificateRecord[];
};

export default async function CourseDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const isAdminPreview = query.adminPreview === "true";

  const course: CourseDetailsRecord | null = await prisma.course.findUnique({
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

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-[#07122E]">
            Course not found
          </h1>

          <Link
            href={isAdminPreview ? "/admin/courses" : "/courses"}
            className="mt-6 inline-flex rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
          >
            {isAdminPreview ? "Back to Admin Courses" : "Back to Courses"}
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const previewLessons = course.lessons.filter(
    (lesson: LessonRecord) => lesson.accessType === "PREVIEW"
  );

  const premiumLessons = course.lessons.filter(
    (lesson: LessonRecord) => lesson.accessType === "PREMIUM"
  );

  const practiceQuestions = course.quizQuestions.filter(
    (question: QuizQuestionRecord) => question.quizType === "PRACTICE"
  );

  const finalQuestions = course.quizQuestions.filter(
    (question: QuizQuestionRecord) => question.quizType === "FINAL"
  );

  const backHref = isAdminPreview ? "/admin/courses" : "/courses";

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
                  You are viewing this course as an administrator.
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

        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              {isAdminPreview ? "Back to Admin Courses" : "Back to Courses"}
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#007F73]">
                    {course.category || "General"}
                  </span>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      course.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-[#D94A00]"
                    }`}
                  >
                    {course.status}
                  </span>

                  {!isAdminPreview && <CourseAccessBadge courseId={course.id} />}

                  {isAdminPreview && (
                    <span className="rounded-full bg-[#07122E] px-4 py-2 text-sm font-bold text-white">
                      Admin Preview
                    </span>
                  )}
                </div>

                <h1 className="mt-6 text-5xl font-extrabold leading-tight">
                  {course.title}
                </h1>

                <p className="mt-5 max-w-3xl text-xl leading-8 text-gray-600">
                  {course.description ||
                    "A practical KWCA learning course designed to support conservancy teams with clear, structured, and accessible training content."}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  {!isAdminPreview && (
                    <EnrollCourseButton courseSlug={course.slug} />
                  )}

                  {previewLessons[0] ? (
                    <Link
                      href={
                        isAdminPreview
                          ? `/courses/${course.slug}/${previewLessons[0].slug}?adminPreview=true`
                          : `/courses/${course.slug}/${previewLessons[0].slug}`
                      }
                      className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold hover:bg-gray-50"
                    >
                      <PlayCircle size={20} />
                      {isAdminPreview ? "Preview First Lesson" : "Start Free Preview"}
                    </Link>
                  ) : course.lessons[0] ? (
                    isAdminPreview ? (
                      <Link
                        href={`/courses/${course.slug}/${course.lessons[0].slug}?adminPreview=true`}
                        className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold hover:bg-gray-50"
                      >
                        <PlayCircle size={20} />
                        Preview First Lesson
                      </Link>
                    ) : (
                      <PremiumLessonAccessButton
                        courseId={course.id}
                        courseSlug={course.slug}
                        lessonSlug={course.lessons[0].slug}
                      />
                    )
                  ) : null}

                  {isAdminPreview && (
                    <Link
                      href={`/admin/courses/${course.slug}/lessons`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                    >
                      Manage Lessons
                      <ArrowRight size={18} />
                    </Link>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-[#07122E] text-white">
                  {course.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <BookOpen className="mx-auto mb-4" size={72} />
                      <p className="text-3xl font-bold">KWCA LMS Course</p>
                      <p className="mt-2 text-white/70">
                        Course image will appear here.
                      </p>
                    </div>
                  )}
                </div>

                {course.introVideoUrl && (
                  <Link
                    href={course.introVideoUrl}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                  >
                    <PlayCircle size={20} />
                    Watch Intro Video
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <StatCard
              icon={<BookOpen size={28} />}
              label="Lessons"
              value={course.lessons.length.toString()}
              tone="green"
            />

            <StatCard
              icon={<Eye size={28} />}
              label="Free Preview"
              value={previewLessons.length.toString()}
              tone="green"
            />

            <StatCard
              icon={<Lock size={28} />}
              label="Premium"
              value={premiumLessons.length.toString()}
              tone="orange"
            />

            <StatCard
              icon={<Award size={28} />}
              label="Certificates"
              value={course.certificates.length.toString()}
              tone="green"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="space-y-8 lg:col-span-2">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold">About This Course</h2>

                <p className="mt-4 leading-8 text-gray-600">
                  {course.description ||
                    "This course is structured to help learners understand the topic step by step through video lessons, readings, practical activities, quizzes, and certificates."}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold">Learning Outcomes</h2>

                {course.learningOutcomes ? (
                  <div className="mt-5 whitespace-pre-line leading-8 text-gray-600">
                    {course.learningOutcomes}
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <OutcomeCard text="Understand the core concepts covered in this course." />
                    <OutcomeCard text="Apply the learning to real conservancy management contexts." />
                    <OutcomeCard text="Use practical tools, examples, and reflections to strengthen decision-making." />
                    <OutcomeCard text="Complete quizzes and earn a certificate after meeting completion requirements." />
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold">Course Lessons</h2>

                    <p className="mt-2 text-gray-600">
                      Start with free preview lessons, then unlock premium
                      lessons through course payment or subscription.
                    </p>
                  </div>

                  {!isAdminPreview && <CourseAccessBadge courseId={course.id} />}
                </div>

                {course.lessons.length === 0 ? (
                  <div className="rounded-2xl bg-gray-50 p-6 text-center">
                    <p className="text-gray-600">
                      No lessons have been added to this course yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {course.lessons.map(
                      (lesson: LessonRecord, index: number) => {
                        const isPreview = lesson.accessType === "PREVIEW";

                        return (
                          <div
                            key={lesson.id}
                            className="rounded-2xl border bg-white p-5 transition-all duration-300 hover:border-[#007F73] hover:shadow-sm"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-5">
                              <div className="flex gap-4">
                                <div
                                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                                    isPreview
                                      ? "bg-green-100 text-green-700"
                                      : "bg-orange-100 text-[#D94A00]"
                                  }`}
                                >
                                  {index + 1}
                                </div>

                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-xl font-bold">
                                      {lesson.title}
                                    </h3>

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
                                  </div>

                                  <p className="mt-2 line-clamp-2 text-gray-600">
                                    {lesson.content ||
                                      "Lesson content and video materials are available inside this lesson."}
                                  </p>
                                </div>
                              </div>

                              {isPreview || isAdminPreview ? (
                                <Link
                                  href={
                                    isAdminPreview
                                      ? `/courses/${course.slug}/${lesson.slug}?adminPreview=true`
                                      : `/courses/${course.slug}/${lesson.slug}`
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                                >
                                  {isAdminPreview ? "Preview Lesson" : "Open Lesson"}
                                  <ArrowRight size={18} />
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
                      }
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold">Quizzes & Certificate</h2>

                <p className="mt-3 leading-8 text-gray-600">
                  Learners can complete practice quizzes for revision and a
                  final graded quiz for certificate eligibility.
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  <QuizCard
                    icon={<ClipboardList size={28} />}
                    title="Practice Quiz"
                    description={`${practiceQuestions.length} practice questions available.`}
                    href={`/courses/${course.slug}/quiz/practice`}
                  />

                  <QuizCard
                    icon={<CheckCircle size={28} />}
                    title="Final Quiz"
                    description={`${finalQuestions.length} final graded questions available.`}
                    href={`/courses/${course.slug}/quiz/final`}
                  />

                  <QuizCard
                    icon={<Award size={28} />}
                    title="Certificate"
                    description="Generate your certificate after completion and passing the final quiz."
                    href={`/courses/${course.slug}/certificate`}
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold">Course Access</h2>

                <div className="mt-5">
                  {isAdminPreview ? (
                    <span className="inline-flex rounded-full bg-[#07122E] px-4 py-2 text-sm font-bold text-white">
                      Admin Preview Mode
                    </span>
                  ) : (
                    <CourseAccessBadge courseId={course.id} />
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <AccessRow
                    icon={<Eye size={20} />}
                    title="Free preview lessons"
                    description="Available to learners before payment."
                    tone="green"
                  />

                  <AccessRow
                    icon={<Lock size={20} />}
                    title="Premium lessons"
                    description="Unlocked after payment or subscription."
                    tone="orange"
                  />

                  <AccessRow
                    icon={<Award size={20} />}
                    title="Certificate"
                    description="Available after completion and final quiz pass."
                    tone="green"
                  />
                </div>

                {isAdminPreview ? (
                  <Link
                    href={`/admin/courses/${course.slug}/lessons`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                  >
                    Manage Lessons
                  </Link>
                ) : (
                  <Link
                    href={`/pricing?courseId=${course.id}&courseSlug=${course.slug}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                  >
                    View Pricing Options
                  </Link>
                )}
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold">Course Details</h2>

                <div className="mt-6 space-y-4">
                  <DetailRow
                    icon={<BookOpen size={20} />}
                    label="Total Lessons"
                    value={course.lessons.length.toString()}
                  />

                  <DetailRow
                    icon={<Clock size={20} />}
                    label="Estimated Duration"
                    value={`${Math.max(course.lessons.length * 15, 30)} mins`}
                  />

                  <DetailRow
                    icon={<Users size={20} />}
                    label="Enrollments"
                    value={course.enrollments.length.toString()}
                  />

                  <DetailRow
                    icon={<Award size={20} />}
                    label="Certificates Issued"
                    value={course.certificates.length.toString()}
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-[#07122E] p-8 text-white shadow-sm">
                <h2 className="text-2xl font-bold">
                  {isAdminPreview ? "Admin Tools" : "Need Support?"}
                </h2>

                <p className="mt-3 leading-7 text-white/70">
                  {isAdminPreview
                    ? "Use the admin panel to edit lessons, update course content, and manage quizzes."
                    : "Contact the KWCA learning team if you need help accessing lessons, confirming payment, or generating your certificate."}
                </p>

                <Link
                  href={
                    isAdminPreview
                      ? `/admin/courses/${course.slug}/lessons`
                      : "/profile"
                  }
                  className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-[#07122E] hover:bg-gray-100"
                >
                  {isAdminPreview ? "Manage Lessons" : "Go to Profile"}
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "green" | "orange";
}) {
  const toneClass = tone === "green" ? "text-[#007F73]" : "text-[#D94A00]";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className={toneClass}>{icon}</div>
        <p className="text-sm font-bold text-gray-500">{label}</p>
      </div>

      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}

function OutcomeCard({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-gray-50 p-5">
      <CheckCircle className="mt-1 shrink-0 text-[#007F73]" size={20} />
      <p className="leading-7 text-gray-600">{text}</p>
    </div>
  );
}

function QuizCard({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border p-6 transition-all duration-300 hover:border-[#007F73] hover:bg-gray-50"
    >
      <div className="mb-4 text-[#007F73]">{icon}</div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-2 leading-7 text-gray-600">{description}</p>
    </Link>
  );
}

function AccessRow({
  icon,
  title,
  description,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: "green" | "orange";
}) {
  const toneClass = tone === "green" ? "text-[#007F73]" : "text-[#D94A00]";

  return (
    <div className="flex gap-3 rounded-2xl bg-gray-50 p-4">
      <div className={`mt-1 shrink-0 ${toneClass}`}>{icon}</div>

      <div>
        <h3 className="font-bold">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="text-[#007F73]">{icon}</div>
        <p className="font-bold text-gray-600">{label}</p>
      </div>

      <p className="font-extrabold text-[#07122E]">{value}</p>
    </div>
  );
}