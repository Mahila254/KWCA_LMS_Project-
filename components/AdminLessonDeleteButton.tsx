"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type AdminLessonDeleteButtonProps = {
  courseSlug: string;
  lessonSlug: string;
  title: string;
};

export default function AdminLessonDeleteButton({
  courseSlug,
  lessonSlug,
  title,
}: AdminLessonDeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/courses/${courseSlug}/lessons/${lessonSlug}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while deleting the lesson.");
        return;
      }

      alert("Lesson deleted successfully.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the lesson.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 size={17} />
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}