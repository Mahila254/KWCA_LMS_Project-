"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditLessonPage() {
  const params = useParams<{
    slug: string;
    lessonSlug: string;
  }>();

  const router = useRouter();

  const courseSlug = params.slug;
  const lessonSlug = params.lessonSlug;

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [accessType, setAccessType] = useState("Free Preview");
  const [videoUrl, setVideoUrl] = useState("");
  const [readingUrl, setReadingUrl] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const response = await fetch(
          `/api/admin/courses/${courseSlug}/lessons/${lessonSlug}`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Lesson not found.");
          router.push(`/admin/courses/${courseSlug}/lessons`);
          return;
        }

        const lesson = data.lesson;

        setTitle(lesson.title || "");
        setOrder(String(lesson.order || ""));
        setVideoUrl(lesson.videoUrl || "");
        setReadingUrl(lesson.readingUrl || "");
        setContent(lesson.content || "");
        setNotes(lesson.notes || "");

        setAccessType(
          lesson.accessType === "PREMIUM" ? "Premium" : "Free Preview"
        );
      } catch (error) {
        console.error(error);
        alert("Something went wrong while loading the lesson.");
      } finally {
        setLoading(false);
      }
    }

    if (courseSlug && lessonSlug) {
      fetchLesson();
    }
  }, [courseSlug, lessonSlug, router]);

  async function handleUpdateLesson() {
    if (!title.trim()) {
      alert("Please enter a lesson title.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/courses/${courseSlug}/lessons/${lessonSlug}`,
        {
          method: "PATCH",
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

      alert("✅ Lesson updated successfully!");
      router.push(`/admin/courses/${courseSlug}/lessons`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating the lesson.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLesson() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this lesson? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/admin/courses/${courseSlug}/lessons/${lessonSlug}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      alert("Lesson deleted successfully.");
      router.push(`/admin/courses/${courseSlug}/lessons`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the lesson.");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-3xl font-bold">Loading lesson...</h1>
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
          <div className="mx-auto max-w-5xl px-6">
            <Link
              href={`/admin/courses/${courseSlug}/lessons`}
              className="font-bold text-[#007F73]"
            >
              ← Back to Lessons
            </Link>

            <h1 className="mt-6 text-5xl font-bold">Edit Lesson</h1>

            <p className="mt-4 text-xl text-gray-600">
              Update lesson content, access level, video, readings, and notes.
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
                  className="w-full rounded-xl border px-4 py-3"
                />
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
                Use an embed link, for example:
                https://www.youtube.com/embed/VIDEO_ID
              </p>
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Reading / Resource URL
              </label>

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
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Lesson Notes / Key Takeaway
              </label>

              <textarea
                rows={5}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="flex flex-wrap justify-between gap-4 pt-4">
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleUpdateLesson}
                  disabled={saving}
                  className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <Link
                  href={`/admin/courses/${courseSlug}/lessons`}
                  className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>

              <button
                type="button"
                onClick={handleDeleteLesson}
                className="rounded-xl border border-red-200 px-6 py-3 font-bold text-red-600 hover:bg-red-50"
              >
                Delete Lesson
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}