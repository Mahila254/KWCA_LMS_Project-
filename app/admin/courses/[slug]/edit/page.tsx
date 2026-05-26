"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import CourseImageUpload from "@/components/CourseImageUpload";

export default function EditCoursePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = params.slug;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Governance");
  const [description, setDescription] = useState("");
  const [courseType, setCourseType] = useState("Free Preview");
  const [numberOfLessons, setNumberOfLessons] = useState("");
  const [status, setStatus] = useState("Draft");
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/admin/courses/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Course not found.");
          router.push("/admin/courses");
          return;
        }

        const course = data.course;

        setTitle(course.title || "");
        setCategory(course.category || "Governance");
        setDescription(course.description || "");
        setNumberOfLessons(String(course.numberOfLessons || ""));
        setIntroVideoUrl(course.introVideoUrl || "");
        setLearningOutcomes(course.learningOutcomes || "");
        setImageUrl(course.imageUrl || "");

        setStatus(course.status === "PUBLISHED" ? "Published" : "Draft");

        if (course.accessType === "PREMIUM") {
          setCourseType("Premium");
        } else if (course.accessType === "SUBSCRIPTION_ONLY") {
          setCourseType("Subscription Only");
        } else {
          setCourseType("Free Preview");
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong while loading the course.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchCourse();
    }
  }, [slug, router]);

  async function handleUpdateCourse() {
    if (!title.trim()) {
      alert("Please enter a course title.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/admin/courses/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          description,
          imageUrl,
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

      alert("✅ Course updated successfully!");
      router.push("/admin/courses");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating the course.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCourse() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/courses/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      alert("Course deleted successfully.");
      router.push("/admin/courses");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the course.");
    }
  }

  if (loading) {
    return (
      <>
        <AdminNavbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-3xl font-bold">Loading course...</h1>
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
          <div className="mx-auto max-w-5xl px-6">
            <Link href="/admin/courses" className="font-bold text-[#007F73]">
              ← Back to Course Management
            </Link>

            <h1 className="mt-6 text-5xl font-bold">Edit Course</h1>

            <p className="mt-4 text-xl text-gray-600">
              Update the selected course details.
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
              <label className="mb-2 block font-bold">Course Description</label>

              <textarea
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <CourseImageUpload />

            <div>
              <label className="mb-2 block font-bold">Course Image URL</label>

              <input
                type="text"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Image upload storage will be connected later"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

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
                <label className="mb-2 block font-bold">Number of Lessons</label>

                <input
                  type="number"
                  value={numberOfLessons}
                  onChange={(event) => setNumberOfLessons(event.target.value)}
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
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="flex flex-wrap justify-between gap-4 pt-4">
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleUpdateCourse}
                  disabled={saving}
                  className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <Link
                  href="/admin/courses"
                  className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>

              <button
                type="button"
                onClick={handleDeleteCourse}
                className="rounded-xl border border-red-200 px-6 py-3 font-bold text-red-600 hover:bg-red-50"
              >
                Delete Course
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}