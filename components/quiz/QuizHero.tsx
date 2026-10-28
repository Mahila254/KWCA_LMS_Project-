import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

/** Title band at the top of the practice and final quiz pages. */
export default function QuizHero({
  courseTitle,
  courseSlug,
  title,
  subtitle,
}: {
  courseTitle: string;
  courseSlug: string;
  title: string;
  subtitle: string;
}) {
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

        <div className="mt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#1E1D59] shadow-sm">
            <BookOpen size={15} />
            {courseTitle}
          </span>

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
