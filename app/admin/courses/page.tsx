import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  ListChecks,
  HelpCircle,
  Pencil,
  Trash2,
  Plus,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function deleteCourse(formData: FormData) {
  "use server";

  const courseId = formData.get("courseId") as string;

  if (!courseId) {
    return;
  }

  await prisma.course.delete({
    where: {
      id: courseId,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      lessons: true,
      quizQuestions: true,
    },
  });

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 font-bold text-[#007F73]"
                >
                  <ArrowLeft size={18} />
                  Back to Admin Dashboard
                </Link>

                <h1 className="mt-8 text-5xl font-bold">
                  Course Management
                </h1>

                <p className="mt-4 max-w-3xl text-xl text-gray-600">
                  Create, edit, publish, and manage KWCA LMS courses.
                </p>
              </div>

              <Link
                href="/admin/courses/create"
                className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                <Plus size={18} />
                Add New Course
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-2xl font-bold">All Courses</h2>

              <p className="mt-2 text-gray-600">
                Showing {courses.length} courses from the database.
              </p>
            </div>

            {courses.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                  <BookOpen size={34} />
                </div>

                <h3 className="text-3xl font-bold">No courses yet</h3>

                <p className="mt-3 text-gray-600">
                  Add your first KWCA LMS course to begin building the platform.
                </p>

                <Link
                  href="/admin/courses/create"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  <Plus size={18} />
                  Add New Course
                </Link>
              </div>
            ) : (
              <div>
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="grid gap-6 border-b p-6 last:border-b-0 lg:grid-cols-[280px_190px_190px_1fr]"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                        {course.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="h-full w-full rounded-2xl object-cover"
                          />
                        ) : (
                          <GraduationCap size={34} />
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold leading-snug">
                          {course.title}
                        </h3>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                          {course.description || "No description added yet."}
                        </p>

                        <p className="mt-2 text-sm font-bold text-gray-500">
                          Slug: {course.slug}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-500">
                        Category
                      </p>

                      <p className="mt-2 font-bold">
                        {course.category || "General"}
                      </p>

                      <p className="mt-5 text-sm font-bold text-gray-500">
                        Lessons
                      </p>

                      <p className="mt-2 font-bold">
                        {course.lessons.length}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-500">Status</p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                          course.status === "PUBLISHED"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-[#D94A00]"
                        }`}
                      >
                        {course.status === "PUBLISHED"
                          ? "Published"
                          : "Draft"}
                      </span>

                      <p className="mt-5 text-sm font-bold text-gray-500">
                        Access
                      </p>

                      <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                        {course.accessType === "FREE_PREVIEW"
                          ? "Free Preview"
                          : course.accessType === "PREMIUM"
                          ? "Premium"
                          : "Subscription Only"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-start gap-3 lg:justify-end">
                      <Link
                        href={`/courses/${course.slug}?adminPreview=true`}
                        className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-bold hover:bg-gray-50"
                      >
                        <Eye size={17} />
                        View
                      </Link>

                      <Link
                        href={`/admin/courses/${course.slug}/lessons`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#007F73] px-5 py-3 font-bold text-[#007F73] hover:bg-[#F2FBF8]"
                      >
                        <ListChecks size={17} />
                        Lessons
                      </Link>

                      <Link
                        href={`/admin/courses/${course.slug}/quiz-questions`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#D94A00] px-5 py-3 font-bold text-[#D94A00] hover:bg-orange-50"
                      >
                        <HelpCircle size={17} />
                        Quiz
                      </Link>

                      <Link
                        href={`/admin/courses/${course.slug}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                      >
                        <Pencil size={17} />
                        Edit
                      </Link>

                      <form action={deleteCourse}>
                        <input type="hidden" name="courseId" value={course.id} />

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}