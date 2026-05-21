import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { modules } from "@/data/modules";
import { lessons } from "@/data/lessons";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const course = modules.find((item) => item.slug === slug);
  const courseLessons = lessons[slug as keyof typeof lessons] || [];

  if (!course) {
    return (
      <main>
        <Navbar />

        <section className="py-24 px-6 text-center bg-white">
          <h1 className="text-4xl font-bold text-[#101828] mb-4">
            Course not found
          </h1>

          <Link href="/courses" className="text-[#007F73] font-bold">
            Back to courses
          </Link>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <section className="bg-[#F2FBF8] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/courses"
            className="text-[#007F73] font-bold mb-6 inline-block"
          >
            ← Back to all courses
          </Link>

          <p className="text-[#007F73] font-bold mb-3">
            {course.module}
          </p>

          <h1 className="text-5xl font-extrabold text-[#101828] mb-6">
            {course.title}
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl">
            This module includes practical conservation learning materials,
            downloadable resources, and structured lesson guidance.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#101828] mb-6">
              Lessons
            </h2>

            {courseLessons.length > 0 ? (
              <div className="space-y-4">
                {courseLessons.map((lesson, index) => (
                  <Link
                    key={lesson}
                    href={`/courses/${slug}/lesson-${index + 1}`}
                    className="border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-[#007F73] hover:bg-[#F2FBF8] transition group"
                  >
                    <div>
                      <p className="text-sm text-[#007F73] font-bold mb-1">
                        Lesson {index + 1}
                      </p>

                      <h3 className="font-bold text-[#101828]">
                        {lesson}
                      </h3>
                    </div>

                    <ArrowRight className="text-gray-400 group-hover:text-[#007F73]" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-xl p-6">
                <p className="text-gray-600">
                  Lessons for this module will be added soon.
                </p>
              </div>
            )}

            <Link
              href={
                courseLessons.length > 0
                  ? `/courses/${slug}/lesson-1`
                  : `/courses/${slug}`
              }
              className="mt-8 inline-block bg-[#007F73] text-white px-6 py-3 rounded-xl font-bold"
            >
              Start Module
            </Link>
          </div>

          <aside className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-[#101828] mb-4">
              Module Includes
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li>Video lessons</li>
              <li>Reading notes</li>
              <li>Downloadable resources</li>
              <li>Practical activities</li>
              <li>Quizzes</li>
              <li>Progress tracking</li>
            </ul>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}