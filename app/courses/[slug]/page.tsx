import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { modules } from "@/data/modules";
import { lessons } from "@/data/lessons";
import { ArrowRight, Lock, Eye, BookOpen } from "lucide-react";

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

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/courses"
              className="mb-6 inline-block font-bold text-[#007F73]"
            >
              ← Back to all courses
            </Link>

            <p className="font-bold text-[#007F73]">
              {course.module}
            </p>

            <h1 className="mt-4 max-w-4xl text-5xl font-extrabold">
              {course.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              This module includes structured lessons, free preview content,
              premium learning material, downloadable resources, and quizzes.
            </p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">
                    Course Lessons
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Start with the free preview, then unlock the full course.
                  </p>
                </div>

                <span className="rounded-full bg-[#F2FBF8] px-4 py-2 text-sm font-bold text-[#007F73]">
                  {courseLessons.length} Lessons
                </span>
              </div>

              {courseLessons.length > 0 ? (
                <div className="space-y-4">
                  {courseLessons.map((lesson, index) => {
                    const isPreview = lesson.type === "preview";
                    const lessonUrl = `/courses/${slug}/lesson-${index + 1}`;

                    return (
                      <Link
                        key={lesson.title}
                        href={isPreview ? lessonUrl : "/pricing"}
                        className={`group flex items-center justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                          isPreview
                            ? "border-[#007F73]/30 bg-[#F2FBF8] hover:border-[#007F73]"
                            : "border-gray-200 bg-white hover:border-[#D94A00] hover:bg-orange-50"
                        }`}
                      >
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <p className="text-sm font-bold text-gray-500">
                              Lesson {index + 1}
                            </p>

                            {isPreview ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                <Eye size={13} />
                                Free Preview
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#D94A00]">
                                <Lock size={13} />
                                Premium Locked
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-[#07122E]">
                            {lesson.title}
                          </h3>
                        </div>

                        {isPreview ? (
                          <ArrowRight className="text-[#007F73] transition group-hover:translate-x-1" />
                        ) : (
                          <Lock className="text-[#D94A00]" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-600">
                    Lessons for this course will be added soon.
                  </p>
                </div>
              )}

              <Link
                href={
                  courseLessons.length > 0
                    ? `/courses/${slug}/lesson-1`
                    : "/courses"
                }
                className="mt-8 inline-block rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                Start Free Preview
              </Link>
            </div>

            <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold">
                Module Includes
              </h3>

              <ul className="mt-6 space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <BookOpen className="text-[#007F73]" size={20} />
                  Free preview lesson
                </li>

                <li className="flex gap-3">
                  <Lock className="text-[#D94A00]" size={20} />
                  Premium locked lessons
                </li>

                <li className="flex gap-3">
                  <BookOpen className="text-[#007F73]" size={20} />
                  Reading notes
                </li>

                <li className="flex gap-3">
                  <BookOpen className="text-[#007F73]" size={20} />
                  Downloadable resources
                </li>

                <li className="flex gap-3">
                  <BookOpen className="text-[#007F73]" size={20} />
                  Practice and final quiz
                </li>
              </ul>

              <div className="mt-8 rounded-2xl bg-gray-50 p-5">
                <p className="font-bold">
                  Want full access?
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Unlock all lessons through course payment or subscription.
                </p>

                <Link
                  href="/pricing"
                  className="mt-4 inline-block rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  View Pricing
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