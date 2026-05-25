import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminCourseDeleteButton from "@/components/AdminCourseDeleteButton";
import {
  Plus,
  Pencil,
  BookOpen,
  Eye,
  Lock,
  GraduationCap,
  ListChecks,
  HelpCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Link href="/admin" className="font-bold text-[#007F73]">
                  ← Back to Admin Dashboard
                </Link>

                <h1 className="mt-6 text-5xl font-bold">Course Management</h1>

                <p className="mt-4 text-xl text-gray-600">
                  Create, edit, publish, and manage KWCA LMS courses.
                </p>
              </div>

              <Link
                href="/admin/courses/create"
                className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                <Plus size={20} />
                Add New Course
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          {courses.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                <BookOpen size={32} />
              </div>

              <h2 className="text-3xl font-bold">No courses yet</h2>

              <p className="mt-3 text-gray-600">
                Courses created by the admin will appear here.
              </p>

              <Link
                href="/admin/courses/create"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                <Plus size={18} />
                Add First Course
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-2xl font-bold">All Courses</h2>

                <p className="mt-1 text-gray-600">
                  Showing {courses.length} courses from the database.
                </p>
              </div>

              <div className="divide-y">
                {courses.map((course) => {
                  const isPreview = course.accessType === "FREE_PREVIEW";
                  const isPublished = course.status === "PUBLISHED";

                  return (
                    <div
                      key={course.id}
                      className="grid gap-6 px-6 py-6 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                          {course.imageUrl ? (
                            <img
                              src={course.imageUrl}
                              alt={course.title}
                              className="h-full w-full rounded-2xl object-cover"
                            />
                          ) : (
                            <GraduationCap size={32} />
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold">{course.title}</h3>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                            {course.description || "No description added yet."}
                          </p>

                          <p className="mt-2 text-sm font-semibold text-gray-500">
                            Slug: {course.slug}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Category
                        </p>

                        <p className="mt-1 font-bold">
                          {course.category || "General"}
                        </p>

                        <p className="mt-4 text-sm font-bold text-gray-500">
                          Lessons
                        </p>

                        <p className="mt-1 font-bold">
                          {course.numberOfLessons}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-500">
                          Status
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>

                        <p className="mt-4 text-sm font-bold text-gray-500">
                          Access
                        </p>

                        <span
                          className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                            isPreview
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-[#D94A00]"
                          }`}
                        >
                          {isPreview ? <Eye size={13} /> : <Lock size={13} />}
                          {isPreview ? "Free Preview" : "Premium"}
                        </span>
                      </div>

                      <div className="flex max-w-md flex-wrap items-start gap-3">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="rounded-xl border px-4 py-3 font-bold hover:bg-gray-50"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/courses/${course.slug}/lessons`}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#007F73] px-4 py-3 font-bold text-[#007F73] hover:bg-[#F2FBF8]"
                        >
                          <ListChecks size={17} />
                          Lessons
                        </Link>

                        <Link
                          href={`/admin/courses/${course.slug}/quiz-questions`}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#D94A00] px-4 py-3 font-bold text-[#D94A00] hover:bg-orange-50"
                        >
                          <HelpCircle size={17} />
                          Quiz
                        </Link>

                        <Link
                          href={`/admin/courses/${course.slug}/edit`}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-4 py-3 font-bold text-white hover:bg-[#00665d]"
                        >
                          <Pencil size={17} />
                          Edit
                        </Link>

                        <AdminCourseDeleteButton
                          slug={course.slug}
                          title={course.title}
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