"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function EditLessonPage() {
  function saveLesson() {
    alert("✅ Lesson saved successfully!");
    window.location.href = "/admin/lessons";
  }

  function deleteLesson() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (confirmDelete) {
      alert("🗑️ Lesson deleted successfully!");
      window.location.href = "/admin/lessons";
    }
  }

  function cancelEdit() {
    window.location.href = "/admin/lessons";
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Link href="/admin/lessons" className="font-bold text-[#007F73]">
              ← Back to Lesson Management
            </Link>

            <h1 className="mt-6 text-5xl font-bold text-[#07122E]">
              Edit Lesson
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Update lesson video, notes, activity resources and publishing
              status.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <form className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <label className="mb-2 block font-bold">Select Course</label>
              <select className="w-full rounded-xl border px-4 py-3">
                <option>What is a Conservancy?</option>
                <option>How to establish a strong Conservancy</option>
                <option>Managing a Conservancy effectively</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold">Lesson Title</label>
              <input
                type="text"
                defaultValue="Definition of a wildlife conservancy"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">Lesson Notes</label>
              <textarea
                rows={8}
                defaultValue="A wildlife conservancy is an area of land managed for conservation, wildlife protection, and community benefit."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={saveLesson}
                className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white"
              >
                Save Lesson
              </button>

              <button
                type="button"
                onClick={deleteLesson}
                className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white"
              >
                Delete Lesson
              </button>

              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border px-6 py-3 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}