"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CreateCoursePage() {
  function handleCreateCourse() {
    alert("✅ Course created successfully!");
    window.location.href = "/admin/courses";
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">

        {/* Header */}

        <section className="bg-[var(--card)] py-16">
          <div className="mx-auto max-w-5xl px-6">

            <Link
              href="/admin/courses"
              className="font-bold text-[var(--primary)]"
            >
              ← Back to Course Management
            </Link>

            <h1 className="mt-6 text-5xl font-bold text-[var(--dark)]">
              Add New Course
            </h1>

            <p className="mt-4 text-xl text-gray-700">
              Create a new course for the KWCA Learning Hub
            </p>

          </div>
        </section>


        {/* Form */}

        <section className="mx-auto max-w-5xl px-6 py-12">

          <form className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">

            {/* Title */}

            <div>

              <label className="mb-2 block font-bold">
                Course Title
              </label>

              <input
                type="text"
                placeholder="Financial Management for Conservancies"
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>


            {/* Category */}

            <div>

              <label className="mb-2 block font-bold">
                Course Category
              </label>

              <select
                className="w-full rounded-xl border px-4 py-3"
              >
                <option>Governance</option>
                <option>Finance</option>
                <option>Conservation</option>
                <option>Leadership</option>
                <option>Community Engagement</option>
              </select>

            </div>


            {/* Description */}

            <div>

              <label className="mb-2 block font-bold">
                Course Description
              </label>

              <textarea
                rows={5}
                placeholder="Briefly describe the course..."
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>


            {/* Image Upload */}

            <div>

              <label className="mb-2 block font-bold">
                Course Thumbnail
              </label>

              <input
                type="file"
                accept="image/*"
                className="w-full rounded-xl border px-4 py-3"
              />

              <p className="mt-2 text-sm text-gray-500">
                Upload a course cover image
              </p>

            </div>


            {/* Course Type */}

            <div>

              <label className="mb-2 block font-bold">
                Course Type
              </label>

              <select
                className="w-full rounded-xl border px-4 py-3"
              >
                <option>Free Preview</option>
                <option>Premium</option>
                <option>Subscription Only</option>
              </select>

            </div>


            {/* Lessons + Status */}

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-bold">
                  Number of Lessons
                </label>

                <input
                  type="number"
                  placeholder="4"
                  className="w-full rounded-xl border px-4 py-3"
                />

              </div>


              <div>

                <label className="mb-2 block font-bold">
                  Course Status
                </label>

                <select
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option>Draft</option>
                  <option>Published</option>
                </select>

              </div>

            </div>


            {/* Video */}

            <div>

              <label className="mb-2 block font-bold">
                Introduction Video URL
              </label>

              <input
                type="text"
                placeholder="Paste YouTube link"
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>


            {/* Outcomes */}

            <div>

              <label className="mb-2 block font-bold">
                Learning Outcomes
              </label>

              <textarea
                rows={5}
                placeholder="By the end of this course learners should..."
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>


            {/* Buttons */}

            <div className="flex gap-4 pt-4">

              <button
                type="button"
                onClick={handleCreateCourse}
                className="rounded-xl bg-[var(--primary)] px-6 py-3 font-bold text-white"
              >
                Create Course
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

      </main>

      <Footer />
    </>
  );
}