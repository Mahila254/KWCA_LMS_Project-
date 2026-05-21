import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function EditCoursePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-[#edf6f3] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/courses"
            className="font-bold text-[#007F73]"
          >
            ← Back to courses
          </Link>

          <h1 className="mt-6 text-5xl font-extrabold text-[#101828]">
            Edit Course
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Update course details, status, and learning structure.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <form className="rounded-3xl bg-white p-8 shadow-sm space-y-6">
          <div>
            <label className="mb-2 block font-bold text-[#101828]">
              Course Title
            </label>

            <input
              type="text"
              defaultValue="What is a Conservancy?"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-[#101828]">
              Course Description
            </label>

            <textarea
              defaultValue="An introductory course explaining the meaning, purpose, and role of conservancies in Kenya."
              className="min-h-32 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold text-[#101828]">
                Course Status
              </label>

              <select className="w-full rounded-xl border px-4 py-3">
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold text-[#101828]">
                Number of Lessons
              </label>

              <input
                type="number"
                defaultValue={4}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-bold text-[#101828]">
              Featured Video URL
            </label>

            <input
              type="text"
              placeholder="Paste YouTube embed URL"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-[#101828]">
              Learning Outcomes
            </label>

            <textarea
              defaultValue={`By the end of this course, learners should understand what conservancies are, why they matter, and how they support both wildlife and communities.`}
              className="min-h-32 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="button"
              className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white"
            >
              Save Changes
            </button>

            <Link
              href="/admin/courses"
              className="rounded-xl border px-6 py-3 font-bold"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}