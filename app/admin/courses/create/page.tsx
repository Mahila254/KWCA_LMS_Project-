"use client";

import { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import CourseImageUpload from "@/components/CourseImageUpload";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Governance");
  const [description, setDescription] = useState("");
  const [courseType, setCourseType] = useState("Free Preview");
  const [numberOfLessons, setNumberOfLessons] = useState("");
  const [status, setStatus] = useState("Draft");
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreateCourse() {
    if (!title.trim()) {
      alert("Please enter a course title.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          description,
          imageUrl: "",
          introVideoUrl,
          learningOutcomes,
          numberOfLessons,
          status,
          accessType: courseType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      alert("✅ Course created successfully!");
      window.location.href = "/admin/courses";
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the course.");
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
            <Link href="/admin/courses" className="font-bold text-[#007F73]">
              ← Back to Course Management
            </Link>

            <h1 className="mt-6 text-5xl font-bold">Add New Course</h1>

            <p className="mt-4 text-xl text-gray-600">
              Create a new course for the KWCA Learning Hub.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <form className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <label className="mb-2 block font-bold">Course Title</label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Financial Management for Conservancies"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">Course Category</label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
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
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Briefly describe what this course teaches..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <CourseImageUpload />

            <div>
              <label className="mb-2 block font-bold">Course Type</label>

              <select
                value={courseType}
                onChange={(event) => setCourseType(event.target.value)}
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
                  value={numberOfLessons}
                  onChange={(event) => setNumberOfLessons(event.target.value)}
                  placeholder="4"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Course Status</label>

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
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
                value={introVideoUrl}
                onChange={(event) => setIntroVideoUrl(event.target.value)}
                placeholder="Paste YouTube embed link"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">Learning Outcomes</label>

              <textarea
                rows={5}
                value={learningOutcomes}
                onChange={(event) => setLearningOutcomes(event.target.value)}
                placeholder="By the end of this course, learners should be able to..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="button"
                onClick={handleCreateCourse}
                disabled={saving}
                className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Course"}
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