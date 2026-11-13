import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { toPlainText } from "@/components/FormattedText";
import { prisma } from "@/lib/prisma";
import { coursePicture } from "@/lib/coursePictures";
import {
  ArrowRight,
  Award,
  BookOpen,
  Eye,
  Lock,
  ClipboardList,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse practical courses for Kenya's conservancies: governance, management, revenue, carbon projects, AGMs and more.",
};

export const dynamic = "force-dynamic";

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
  lessons: {
    id: string;
    accessType: "PREVIEW" | "PREMIUM";
  }[];
  quizQuestions: {
    id: string;
    quizType: "PRACTICE" | "FINAL";
  }[];
};

export default async function CoursesPage() {
  const courses: CourseRecord[] = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      lessons: {
        select: {
          id: true,
          accessType: true,
        },
      },
      quizQuestions: {
        select: {
          id: true,
          quizType: true,
        },
      },
    },
  });

  const totalLessons = courses.reduce(
    (total: number, course: CourseRecord) => total + course.lessons.length,
    0
  );

  // Quizzes, not questions: a course has at most a practice quiz and a
  // final quiz, each counted once however many questions it holds.
  const totalQuizzes = courses.reduce(
    (total: number, course: CourseRecord) =>
      total +
      new Set(course.quizQuestions.map((question) => question.quizType)).size,
    0
  );

  // Newest first, except the very first course published, which leads.
  const featured = courses[courses.length - 1];
  const others = courses.slice(0, -1);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-ink">
        <section className="relative overflow-hidden px-6 py-16 md:py-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/conservancy-training.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-surface/55" />

          <div className="absolute inset-0 bg-gradient-to-b from-tint/70 via-surface/70 to-gray-50" />

          <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-deep/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />

          <ScrollReveal className="relative mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="font-bold text-ink">KWCF Learning Courses</p>

              <h1 className="mt-4 text-5xl font-extrabold leading-tight md:text-7xl">
                Explore <em className="accent text-accent">Conservation Learning</em> Courses
              </h1>

              <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-600">
                Practical courses designed to support conservancy leaders,
                managers, board members, and community stakeholders with
                accessible digital learning.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-6">
              <HeroStat
                icon={<BookOpen size={28} />}
                label="Published Courses"
                value={courses.length.toString()}
              />

              <HeroStat
                icon={<GraduationCap size={28} />}
                label="Total Lessons"
                value={totalLessons.toString()}
              />

              <HeroStat
                icon={<ClipboardList size={28} />}
                label="Quizzes Available"
                value={totalQuizzes.toString()}
              />
            </div>
          </ScrollReveal>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <ScrollReveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-bold text-accent">Course Catalogue</p>

              <h2 className="mt-3 text-4xl font-extrabold">
                Available Courses
              </h2>

              <p className="mt-3 max-w-2xl text-gray-600">
                Start with free preview lessons, then unlock premium learning
                through course payment or subscription.
              </p>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-full border bg-surface px-6 py-3 font-bold hover:bg-gray-50"
            >
              View My Profile
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>

          {courses.length === 0 ? (
            <ScrollReveal>
              <div className="rounded-3xl bg-surface p-12 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-tint text-ink">
                  <BookOpen size={40} />
                </div>

                <h2 className="text-3xl font-bold">No courses available yet</h2>

                <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                  Published courses will appear here once they are added by the
                  KWCF LMS admin team.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid gap-6">
              {/* The first course published is where learners start, so it
                  gets the big picture card; the rest sit below it. */}
              <ScrollReveal>
                <FeaturedCourseCard course={featured} />
              </ScrollReveal>

              {others.length > 0 && (
                <div
                  className={`grid gap-6 md:grid-cols-2 ${
                    others.length >= 3 ? "xl:grid-cols-3" : ""
                  }`}
                >
                  {others.map((course, index) => (
                    <ScrollReveal
                      key={course.id}
                      delay={(index % 3) * 80}
                      className="h-full"
                    >
                      <CourseCard course={course} />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <ScrollReveal>
            <div className="overflow-hidden rounded-3xl bg-primary p-10 text-white shadow-sm md:p-14">
              <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
                <div>
                  <p className="font-bold text-on-deep-muted">Learning Pathway</p>

                  <h2 className="mt-3 text-4xl font-extrabold">
                    Build Skills for Stronger Conservancy Management
                  </h2>

                  <p className="mt-4 max-w-3xl leading-8 text-white/75">
                    The KWCF LMS brings together practical lessons, quizzes,
                    readings, and certificates to help conservation teams
                    strengthen governance, management, and sustainability.
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-surface px-7 py-4 font-bold text-ink transition hover:-translate-y-1 hover:bg-gray-100"
                >
                  Go to Learner Profile
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-surface/85 p-3 shadow-sm backdrop-blur-md sm:p-6">
      <div className="mb-2 flex flex-col items-start gap-1 text-ink sm:mb-4 sm:flex-row sm:items-center sm:gap-3">
        {icon}
        <p className="text-xs font-bold leading-tight text-gray-500 sm:text-sm">
          {label}
        </p>
      </div>

      <p className="text-4xl font-extrabold">{value}</p>
    </div>
  );
}

// The admin's picture, else the design's picture for that course, else
// the placeholder (lib/coursePictures.ts).
function courseImage(course: CourseRecord) {
  return coursePicture(course);
}

function courseSummary(course: CourseRecord) {
  return course.description
    ? toPlainText(course.description)
    : "A practical conservation learning course designed for conservancy teams and community-based conservation leaders.";
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function AccessBadge({ course }: { course: CourseRecord }) {
  return course.accessType === "FREE_PREVIEW" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
      <Eye size={13} />
      Free preview
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-lilac-tint px-3 py-1 text-xs font-bold text-lilac-text">
      <Lock size={13} />
      Premium
    </span>
  );
}

/**
 * Small icons for what a course includes: free and premium lessons, and
 * whether it has a practice quiz and a final quiz (not how many questions).
 */
function CourseFeatures({
  course,
  onImage = false,
}: {
  course: CourseRecord;
  onImage?: boolean;
}) {
  const features = [
    course.lessons.some((lesson) => lesson.accessType === "PREVIEW") && {
      icon: <Eye size={14} />,
      label: "Free lessons",
    },
    course.lessons.some((lesson) => lesson.accessType === "PREMIUM") && {
      icon: <Lock size={14} />,
      label: "Premium lessons",
    },
    course.quizQuestions.some((question) => question.quizType === "PRACTICE") && {
      icon: <ClipboardList size={14} />,
      label: "Practice quiz",
    },
    course.quizQuestions.some((question) => question.quizType === "FINAL") && {
      icon: <Award size={14} />,
      label: "Final quiz",
    },
  ].filter((feature) => feature !== false);

  if (features.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="This course includes">
      {features.map((feature) => (
        <li
          key={feature.label}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            onImage
              ? "bg-white/15 text-white backdrop-blur-md"
              : "bg-tint text-ink"
          }`}
        >
          {feature.icon}
          {feature.label}
        </li>
      ))}
    </ul>
  );
}

/** The big picture card for the course learners should start with. */
function FeaturedCourseCard({ course }: { course: CourseRecord }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-sm hover:shadow-xl md:min-h-[480px] md:p-10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={courseImage(course)}
        alt={course.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent" />

      <div className="relative">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-md">
            {course.category || "General"}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">
            Start here
          </span>
          <AccessBadge course={course} />
        </div>

        <h3 className="mb-3 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
          {course.title}
        </h3>
        <p className="mb-6 line-clamp-3 max-w-xl leading-7 text-white/80">
          {courseSummary(course)}
        </p>

        <CourseFeatures course={course} onImage />

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface py-3 pl-5 pr-4 text-sm font-bold text-ink transition-[gap] duration-300 group-hover:gap-3">
            Start course
            <ArrowRight size={16} />
          </span>

          <span className="flex items-center gap-1.5 text-sm font-semibold text-white/75">
            <BookOpen size={15} />
            {plural(course.lessons.length, "lesson")}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** A slim card, like the homepage's Key Learning Topics. */
function CourseCard({ course }: { course: CourseRecord }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-black/[0.03] hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          decoding="async"
          src={courseImage(course)}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          {course.category || "General"}
        </span>

        <span className="absolute right-4 top-4">
          <AccessBadge course={course} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-bold leading-snug group-hover:text-accent">
          {course.title}
        </h3>

        <p className="mb-5 line-clamp-3 flex-1 leading-7 text-gray-600">
          {courseSummary(course)}
        </p>

        <CourseFeatures course={course} />

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-4 text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <BookOpen size={15} />
            {plural(course.lessons.length, "lesson")}
          </span>

          <span className="flex items-center gap-1 font-bold text-accent">
            View course
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}