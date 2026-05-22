"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import CourseImageUpload from "@/components/CourseImageUpload";

export default function EditCoursePage() {
  function handleSaveCourse() {
    alert("✅ Course updated successfully!");
    window.location.href = "/admin/courses";
  }

  function handleDeleteCourse() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (confirmDelete) {
      alert("🗑️ Course deleted successfully!");
      window.location.href = "/admin/courses";
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Link
              href="/admin/courses"
              className="font-bold text-[#007F73]"
            >
              ← Back to Course Management
            </Link>

            <h1 className="mt-6 text-5xl font-bold">
              Edit Course
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Update course details, image, access type, and learning structure.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <form className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <label className="mb-2 block font-bold">
                Course Title
              </label>

              <input
                type="text"
                defaultValue="What is a Conservancy?"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Course Category
              </label>

              <select
                defaultValue="Governance"
                className="w-full rounded-xl border px-4 py-3"
              >
                <option>Governance</option>
                <option>Finance</option>
                <option>Conservation Management</option>
                <option>Leadership</option>
                <option>Community Engagement</option>
                <option>Greenlisting</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Course Description
              </label>

              <textarea
                rows={5}
                defaultValue="An introductory course explaining what conservancies are, why they matter, and how they support both wildlife conservation and community livelihoods."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <CourseImageUpload />

            <div>
              <label className="mb-2 block font-bold">
                Course Type
              </label>

              <select
                defaultValue="Free Preview"
                className="w-full rounded-xl border px-4 py-3"
              >
                <option>Free Preview</option>
                <option>Premium</option>
                <option>Subscription Only</option>
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold">
                  Number of Lessons
                </label>

                <input
                  type="number"
                  defaultValue={4}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">
                  Course Status
                </label>

                <select
                  defaultValue="Published"
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Introduction Video URL
              </label>

              <input
                type="text"
                defaultValue="https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Learning Outcomes
              </label>

              <textarea
                rows={5}
                defaultValue="By the end of this course, learners should understand what conservancies are, why they matter, and how they support wildlife and communities."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={handleSaveCourse}
                className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleDeleteCourse}
                className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
              >
                Delete Course
              </button>

              <Link
                href="/admin/courses"
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