import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Lock,
  Eye,
  BookOpen,
  FileText,
  Download,
  HelpCircle,
} from "lucide-react";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
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
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center">
          <h1 className="text-4xl font-bold text-[#07122E]">
            Course not found
          </h1>

          <p className="mt-4 text-gray-600">
            This course may not exist or may have been removed.
          </p>

          <Link
            href="/courses"
            className="mt-6 inline-block rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
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

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#007F73]">
                {course.category || "General"}
              </span>

              {course.accessType === "FREE_PREVIEW" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  <Eye size={15} />
                  Free Preview
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#D94A00]">
                  <Lock size={15} />
                  Premium
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-extrabold">
              {course.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              {course.description ||
                "This course includes structured lessons, learning notes, downloadable resources, and assessments."}
            </p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Course Lessons</h2>

                  <p className="mt-2 text-gray-600">
                    Start with the free preview, then unlock premium lessons.
                  </p>
                </div>

                <span className="rounded-full bg-[#F2FBF8] px-4 py-2 text-sm font-bold text-[#007F73]">
                  {course.lessons.length} Lessons
                </span>
              </div>

              {course.lessons.length > 0 ? (
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => {
                    const isPreview = lesson.accessType === "PREVIEW";
                    const lessonUrl = `/courses/${course.slug}/${lesson.slug}`;

                    return (
                      <Link
                        key={lesson.id}
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

                          {lesson.content && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                              {lesson.content}
                            </p>
                          )}
                        </div>

                        {isPreview ? (
                          <ArrowRight className="shrink-0 text-[#007F73] transition group-hover:translate-x-1" />
                        ) : (
                          <Lock className="shrink-0 text-[#D94A00]" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                  <BookOpen className="mx-auto mb-3 text-gray-400" size={34} />

                  <p className="font-bold text-gray-700">
                    No lessons added yet
                  </p>

                  <p className="mt-2 text-gray-600">
                    Lessons added by the admin will appear here.
                  </p>
                </div>
              )}

              <Link
                href={
                  course.lessons.length > 0
                    ? `/courses/${course.slug}/${course.lessons[0].slug}`
                    : "/courses"
                }
                className="mt-8 inline-block rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                Start Free Preview
              </Link>
            </div>

            <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold">Module Includes</h3>

              <ul className="mt-6 space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <BookOpen className="shrink-0 text-[#007F73]" size={20} />
                  Free preview lesson
                </li>

                <li className="flex gap-3">
                  <Lock className="shrink-0 text-[#D94A00]" size={20} />
                  Premium locked lessons
                </li>

                <li className="flex gap-3">
                  <FileText className="shrink-0 text-[#007F73]" size={20} />
                  Reading notes
                </li>

                <li className="flex gap-3">
                  <Download className="shrink-0 text-[#007F73]" size={20} />
                  Downloadable resources
                </li>

                <li className="flex gap-3">
                  <HelpCircle className="shrink-0 text-[#007F73]" size={20} />
                  Practice and final quiz
                </li>
              </ul>

              {course.learningOutcomes && (
                <div className="mt-8 rounded-2xl bg-gray-50 p-5">
                  <p className="font-bold">Learning Outcomes</p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {course.learningOutcomes}
                  </p>
                </div>
              )}

              <div className="mt-8 rounded-2xl bg-[#F2FBF8] p-5">
                <p className="font-bold">Want full access?</p>

                <p className="mt-2 text-sm text-gray-600">
                  Unlock all premium lessons through course payment or
                  subscription.
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