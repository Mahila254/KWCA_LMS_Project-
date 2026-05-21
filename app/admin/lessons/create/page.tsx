import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CreateLessonPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Link
              href="/admin/lessons"
              className="font-bold text-[#007F73]"
            >
              ← Back to Lesson Management
            </Link>

            <h1 className="mt-6 text-5xl font-bold text-[#07122E]">
              Add New Lesson
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Create a lesson with video, notes, activity, and downloadable resources.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <form className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <label className="mb-2 block font-bold">
                Select Course
              </label>

              <select className="w-full rounded-xl border px-4 py-3">
                <option>What is a Conservancy?</option>
                <option>How to establish a strong Conservancy</option>
                <option>Managing a Conservancy effectively</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Lesson Title
              </label>

              <input
                type="text"
                placeholder="e.g. Definition of a wildlife conservancy"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold">
                  Lesson Number
                </label>

                <input
                  type="number"
                  placeholder="1"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Lesson Status
                </label>

                <select className="w-full rounded-xl border px-4 py-3">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-bold">
                YouTube Embed URL
              </label>

              <input
                type="text"
                placeholder="https://www.youtube.com/embed/..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Lesson Notes
              </label>

              <textarea
                rows={8}
                placeholder="Write the full lesson notes here..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Practical Activity
              </label>

              <textarea
                rows={4}
                placeholder="Add a learner activity, reflection question, or field task..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Resource Link
              </label>

              <input
                type="text"
                placeholder="Paste PDF/resource link"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white"
              >
                Create Lesson
              </button>

              <Link
                href="/admin/lessons"
                className="rounded-xl border px-6 py-3 font-bold"
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