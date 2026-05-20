import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { modules } from "@/data/modules";
import { lessons } from "@/data/lessons";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const course = modules.find((item) => item.slug === slug);

  const courseLessons =
    lessons[slug as keyof typeof lessons] || [];

  if (!course) {
    return (
      <main>
        <Navbar />

        <section className="py-24 px-6 text-center bg-white">
          <h1 className="text-4xl font-bold text-[#101828] mb-4">
            Course not found
          </h1>

          <Link
            href="/courses"
            className="text-[#007F73] font-bold"
          >
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

            <div className="space-y-4">
              {courseLessons.map((lesson, index) => (
                <div
                  key={lesson}
                  className="border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-[#007F73] transition"
                >
                  <div>
                    <p className="text-sm text-[#007F73] font-bold mb-1">
                      Lesson {index + 1}
                    </p>

                    <h3 className="font-bold text-[#101828]">
                      {lesson}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 bg-[#007F73] text-white px-6 py-3 rounded-xl font-bold">
              Start Module
            </button>

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