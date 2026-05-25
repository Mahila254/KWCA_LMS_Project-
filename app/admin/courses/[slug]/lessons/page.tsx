import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminLessonDeleteButton from "@/components/AdminLessonDeleteButton";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Eye,
  Lock,
  PlayCircle,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminCourseLessonsPage({ params }: PageProps) {
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
        <AdminNavbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-4xl font-bold">Course not found</h1>

          <p className="mt-4 text-gray-600">
            This course may not exist or may have been deleted.
          </p>

          <Link
            href="/admin/courses"
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
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Course Management
            </Link>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#007F73]">Lesson Management</p>

                <h1 className="mt-3 text-5xl font-bold">{course.title}</h1>

                <p className="mt-4 max-w-3xl text-xl text-gray-600">
                  Add, edit, reorder, and manage lessons for this course.
                </p>
              </div>

              <Link
                href={`/admin/courses/${course.slug}/lessons/create`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                <Plus size={20} />
                Add New Lesson
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-500">Course Status</p>

              <p className="mt-2 text-2xl font-bold">
                {course.status === "PUBLISHED" ? "Published" : "Draft"}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-500">Total Lessons</p>

              <p className="mt-2 text-2xl font-bold">
                {course.lessons.length}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-500">Course Access</p>

              <p className="mt-2 text-2xl font-bold">
                {course.accessType === "FREE_PREVIEW"
                  ? "Free Preview"
                  : course.accessType === "SUBSCRIPTION_ONLY"
                  ? "Subscription Only"
                  : "Premium"}
              </p>
            </div>
          </div>

          {course.lessons.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                <BookOpen size={32} />
              </div>

              <h2 className="text-3xl font-bold">No lessons yet</h2>

              <p className="mt-3 text-gray-600">
                Start building this course by adding the first lesson.
              </p>

              <Link
                href={`/admin/courses/${course.slug}/lessons/create`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                <Plus size={18} />
                Add First Lesson
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-2xl font-bold">Course Lessons</h2>

                <p className="mt-1 text-gray-600">
                  Showing {course.lessons.length} lessons from the database.
                </p>
              </div>

              <div className="divide-y">
                {course.lessons.map((lesson) => {
                  const isPreview = lesson.accessType === "PREVIEW";

                  return (
                    <div
                      key={lesson.id}
                      className="grid gap-6 px-6 py-6 lg:grid-cols-[80px_1.5fr_1fr_auto]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-xl font-bold text-[#007F73]">
                        {lesson.order}
                      </div>

                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
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

                          {lesson.videoUrl && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                              <PlayCircle size={13} />
                              Video Added
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold">{lesson.title}</h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                          {lesson.content || "No lesson content added yet."}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-gray-500">
                          Slug: {lesson.slug}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Reading URL
                        </p>

                        <p className="mt-1 line-clamp-1 text-sm text-gray-600">
                          {lesson.readingUrl || "Not added"}
                        </p>

                        <p className="mt-4 text-sm font-bold text-gray-500">
                          Notes
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {lesson.notes || "Not added"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-start gap-3">
                        <Link
                          href={`/courses/${course.slug}/${lesson.slug}`}
                          className="rounded-xl border px-4 py-3 font-bold hover:bg-gray-50"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/courses/${course.slug}/lessons/${lesson.slug}/edit`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-4 py-3 font-bold text-white hover:bg-[#00665d]"
                        >
                          <Pencil size={17} />
                          Edit
                        </Link>

                        <AdminLessonDeleteButton
                          courseSlug={course.slug}
                          lessonSlug={lesson.slug}
                          title={lesson.title}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}