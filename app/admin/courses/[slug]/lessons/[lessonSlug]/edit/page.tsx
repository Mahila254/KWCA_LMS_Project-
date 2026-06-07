import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Save } from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
};

type LessonRecord = {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  content: string | null;
  videoUrl: string | null;
  readingUrl: string | null;
  notes: string | null;
  order: number;
  accessType: "PREVIEW" | "PREMIUM";
  createdAt: Date;
  updatedAt: Date;
};

type CourseRecord = {
  id: string;
  title: string;
  slug: string;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function updateLesson(formData: FormData) {
  "use server";

  const lessonId = formData.get("lessonId") as string;
  const courseSlug = formData.get("courseSlug") as string;
  const title = formData.get("title") as string;
  const customSlug = formData.get("slug") as string;
  const orderValue = formData.get("order") as string;
  const accessType = formData.get("accessType") as "PREVIEW" | "PREMIUM";
  const videoUrl = formData.get("videoUrl") as string;
  const readingUrl = formData.get("readingUrl") as string;
  const content = formData.get("content") as string;
  const notes = formData.get("notes") as string;

  if (!lessonId || !courseSlug || !title) {
    return;
  }

  const lessonSlug = customSlug ? createSlug(customSlug) : createSlug(title);
  const order = Number(orderValue) || 1;

  await prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data: {
      title,
      slug: lessonSlug,
      order,
      accessType,
      videoUrl: videoUrl || null,
      readingUrl: readingUrl || null,
      content: content || null,
      notes: notes || null,
    },
  });

  revalidatePath(`/admin/courses/${courseSlug}/lessons`);
  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath(`/courses/${courseSlug}/${lessonSlug}`);

  redirect(`/admin/courses/${courseSlug}/lessons`);
}

export default async function EditLessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params;

  const course: CourseRecord | null = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  const lesson: LessonRecord | null = await prisma.lesson.findFirst({
    where: {
      course: {
        slug,
      },
      slug: lessonSlug,
    },
  });

  if (!course || !lesson) {
    return (
      <>
        <AdminNavbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-4xl font-bold">Lesson not found</h1>

          <p className="mt-4 text-gray-600">
            This lesson may not exist or may have been deleted.
          </p>

          <Link
            href={`/admin/courses/${slug}/lessons`}
            className="mt-6 inline-block rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
          >
            Back to Lessons
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href={`/admin/courses/${course.slug}/lessons`}
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Lessons
            </Link>

            <div className="mt-8">
              <p className="font-bold text-[#007F73]">Edit Lesson</p>

              <h1 className="mt-3 text-5xl font-bold">Edit Lesson</h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Update lesson content, access level, video, readings, and notes
                for{" "}
                <span className="font-bold text-[#07122E]">
                  {course.title}
                </span>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <form
            action={updateLesson}
            className="rounded-3xl bg-white p-8 shadow-sm"
          >
            <input type="hidden" name="lessonId" value={lesson.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />

            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2FBF8] text-[#007F73]">
                <BookOpen size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Lesson Information</h2>
                <p className="text-gray-600">
                  Update the lesson details below.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="mb-2 block font-bold">Lesson Title</label>

                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={lesson.title}
                  className="w-full rounded-xl border px-5 py-4 text-lg outline-none focus:border-[#007F73]"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Lesson Slug</label>

                <input
                  name="slug"
                  type="text"
                  defaultValue={lesson.slug}
                  className="w-full rounded-xl border px-5 py-4 text-lg outline-none focus:border-[#007F73]"
                />

                <p className="mt-2 text-sm text-gray-500">
                  This controls the lesson URL. Example: lesson-1
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-bold">Lesson Order</label>

                  <input
                    name="order"
                    type="number"
                    min="1"
                    defaultValue={lesson.order}
                    className="w-full rounded-xl border px-5 py-4 text-lg outline-none focus:border-[#007F73]"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">Lesson Access</label>

                  <select
                    name="accessType"
                    defaultValue={lesson.accessType}
                    className="w-full rounded-xl border px-5 py-4 text-lg outline-none focus:border-[#007F73]"
                  >
                    <option value="PREVIEW">Free Preview</option>
                    <option value="PREMIUM">Premium Locked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block font-bold">Lesson Video URL</label>

                <input
                  name="videoUrl"
                  type="url"
                  defaultValue={lesson.videoUrl || ""}
                  placeholder="Example: https://www.youtube.com/embed/ogaR6G9Cm7M"
                  className="w-full rounded-xl border px-5 py-4 text-lg outline-none focus:border-[#007F73]"
                />

                <p className="mt-2 text-sm text-gray-500">
                  Recommended YouTube format:
                  https://www.youtube.com/embed/VIDEO_ID
                </p>
              </div>

              <div>
                <label className="mb-2 block font-bold">Reading URL</label>

                <input
                  name="readingUrl"
                  type="url"
                  defaultValue={lesson.readingUrl || ""}
                  placeholder="Optional reading or downloadable file link"
                  className="w-full rounded-xl border px-5 py-4 text-lg outline-none focus:border-[#007F73]"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Lesson Content</label>

                <textarea
                  name="content"
                  rows={12}
                  defaultValue={lesson.content || ""}
                  className="w-full rounded-xl border px-5 py-4 text-lg leading-8 outline-none focus:border-[#007F73]"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Lesson Notes</label>

                <textarea
                  name="notes"
                  rows={6}
                  defaultValue={lesson.notes || ""}
                  className="w-full rounded-xl border px-5 py-4 text-lg leading-8 outline-none focus:border-[#007F73]"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                <Save size={18} />
                Save Changes
              </button>

              <Link
                href={`/courses/${course.slug}/${lesson.slug}?adminPreview=true`}
                className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
              >
                Preview Lesson
              </Link>

              <Link
                href={`/admin/courses/${course.slug}/lessons`}
                className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}