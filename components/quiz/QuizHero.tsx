import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

/**
 * Title band at the top of the practice and final quiz pages. `compact`
 * is a single slim row (back link, course, quiz name) used while a quiz
 * is being answered, so the question itself fits on one screen.
 */
export default function QuizHero({
  courseTitle,
  courseSlug,
  title,
  subtitle,
  compact = false,
}: {
  courseTitle: string;
  courseSlug: string;
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  const backLink = (
    <Link
      href={`/courses/${courseSlug}`}
      className="group inline-flex items-center gap-2 font-bold text-[#1E1D59]"
    >
      <ArrowLeft
        size={18}
        className="transition-transform duration-300 group-hover:-translate-x-1"
      />
      Back to Course
    </Link>
  );

  const coursePill = (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#1E1D59] shadow-sm">
      <BookOpen size={15} className="shrink-0" />
      <span className="line-clamp-1">{courseTitle}</span>
    </span>
  );

  if (compact) {
    return (
      <section className="px-6 pb-3 pt-4 sm:pb-4 sm:pt-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2">
          {backLink}
          <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
          <span className="hidden sm:inline-flex">{coursePill}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-6 py-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/course-hero-background.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-white/70" />

      <div className="absolute inset-0 bg-gradient-to-b from-[#F1F0FA]/90 via-white/80 to-gray-50" />

      <div className="relative mx-auto max-w-6xl">
        {backLink}

        <div className="mt-5">
          {coursePill}

          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
            {title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
