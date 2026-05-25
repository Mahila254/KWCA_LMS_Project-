"use client";

import { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function CreateLessonPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const courseSlug = params.slug;

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [accessType, setAccessType] = useState("Free Preview");
  const [videoUrl, setVideoUrl] = useState("");
  const [readingUrl, setReadingUrl] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreateLesson() {
    if (!title.trim()) {
      alert("Please enter a lesson title.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/courses/${courseSlug}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            order,
            accessType,
            videoUrl,
            readingUrl,
            content,
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      alert("✅ Lesson created successfully!");
      router.push(`/admin/courses/${courseSlug}/lessons`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the lesson.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Link
              href={`/admin/courses/${courseSlug}/lessons`}
              className="font-bold text-[#007F73]"
            >
              ← Back to Lessons
            </Link>

            <h1 className="mt-6 text-5xl font-bold">Add New Lesson</h1>

            <p className="mt-4 text-xl text-gray-600">
              Create a lesson and attach it to this course.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <form className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <label className="mb-2 block font-bold">Lesson Title</label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Definition of a wildlife conservancy"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold">Lesson Order</label>

                <input
                  type="number"
                  value={order}
                  onChange={(event) => setOrder(event.target.value)}
                  placeholder="1"
                  className="w-full rounded-xl border px-4 py-3"
                />

                <p className="mt-2 text-sm text-gray-500">
                  Leave blank to add it after the last lesson.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-bold">Lesson Access</label>

                <select
                  value={accessType}
                  onChange={(event) => setAccessType(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option>Free Preview</option>
                  <option>Premium</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-bold">Lesson Video URL</label>

              <input
                type="text"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="Paste YouTube embed link"
                className="w-full rounded-xl border px-4 py-3"
              />

              <p className="mt-2 text-sm text-gray-500">
                Use an embed link, for example: https://www.youtube.com/embed/VIDEO_ID
              </p>
            </div>

            <div>
              <label className="mb-2 block font-bold">Reading / Resource URL</label>

              <input
                type="text"
                value={readingUrl}
                onChange={(event) => setReadingUrl(event.target.value)}
                placeholder="Paste reading or downloadable resource link"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">Lesson Content</label>

              <textarea
                rows={8}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write the main lesson explanation here..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">Lesson Notes / Key Takeaway</label>

              <textarea
                rows={5}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add short notes, reminders, or key takeaways..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={handleCreateLesson}
                disabled={saving}
                className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Lesson"}
              </button>

              <Link
                href={`/admin/courses/${courseSlug}/lessons`}
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