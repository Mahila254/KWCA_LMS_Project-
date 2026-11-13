"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import CourseImageUpload from "@/components/CourseImageUpload";
import FormattedTextEditor from "@/components/FormattedTextEditor";
import ObjectivesInput from "@/components/ObjectivesInput";
import { confirmAction, notify } from "@/lib/notify";

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
          notify(data.error || "Course not found.");
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
        notify("Something went wrong while loading the course.");
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
      notify("Please enter a course title.");
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
        notify(data.error || "Something went wrong.");
        return;
      }

      notify("✅ Course updated successfully!");
      router.push("/admin/courses");
      router.refresh();
    } catch (error) {
      console.error(error);
      notify("Something went wrong while updating the course.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCourse() {
    const confirmDelete = await confirmAction(
      "Are you sure you want to delete this course? This action cannot be undone.",
      { confirmLabel: "Delete" }
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin/courses/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || "Something went wrong.");
        return;
      }

      notify("Course deleted successfully.");
      router.push("/admin/courses");
      router.refresh();
    } catch (error) {
      console.error(error);
      notify("Something went wrong while deleting the course.");
    }
  }

  if (loading) {
    return (
      <>
        <AdminNavbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-ink">
          <h1 className="text-3xl font-bold">Loading course...</h1>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-ink">
        <section className="bg-canvas py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Link href="/admin/courses" className="font-bold text-ink">
              ← Back to Course Management
            </Link>

            <h1 className="mt-6 text-5xl font-bold">Edit Course</h1>

            <p className="mt-4 text-xl text-gray-600">
              Update the selected course details.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <form className="space-y-6 rounded-3xl bg-surface p-8 shadow-sm">
            <div>
              <label htmlFor="field-course-title" className="mb-2 block font-bold">Course Title</label>

              <input id="field-course-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="field-course-category" className="mb-2 block font-bold">Course Category</label>

              <select id="field-course-category"
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

            <FormattedTextEditor
              name="description"
              label="Course Description"
              rows={8}
              value={description}
              onChange={setDescription}
              placeholder="In two or three sentences: who the course is for, what it covers and why it matters."
              previewVariant="intro"
              hint="Shown as “About this course” at the top of the course page. Keep it to one or two short paragraphs. Lines you type one under another join into one paragraph; leave an empty line to start a new one. Put what learners will be able to do in the Learning Objectives fields below."
            />

            <CourseImageUpload value={imageUrl} onChange={setImageUrl} />

            <div>
              <label htmlFor="field-course-type" className="mb-2 block font-bold">Course Type</label>

              <select id="field-course-type"
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
                <label htmlFor="field-number-of-lessons" className="mb-2 block font-bold">Number of Lessons</label>

                <input id="field-number-of-lessons"
                  type="number"
                  value={numberOfLessons}
                  onChange={(event) => setNumberOfLessons(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label htmlFor="field-course-status" className="mb-2 block font-bold">Course Status</label>

                <select id="field-course-status"
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
              <label htmlFor="field-introduction-video-url" className="mb-2 block font-bold">
                Introduction Video URL
              </label>

              <input id="field-introduction-video-url"
                type="text"
                value={introVideoUrl}
                onChange={(event) => setIntroVideoUrl(event.target.value)}
                placeholder="Paste YouTube embed link"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <ObjectivesInput
              value={learningOutcomes}
              onChange={setLearningOutcomes}
            />

            <div className="flex flex-wrap justify-between gap-4 pt-4">
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleUpdateCourse}
                  disabled={saving}
                  className="rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <Link
                  href="/admin/courses"
                  className="rounded-full border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>

              <button
                type="button"
                onClick={handleDeleteCourse}
                className="rounded-full border border-red-200 px-6 py-3 font-bold text-red-700 hover:bg-red-50"
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