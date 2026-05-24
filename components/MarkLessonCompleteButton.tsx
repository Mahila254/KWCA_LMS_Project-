"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle } from "lucide-react";

type MarkLessonCompleteButtonProps = {
  courseSlug: string;
  lessonSlug: string;
};

type SupabaseLearner = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function MarkLessonCompleteButton({
  courseSlug,
  lessonSlug,
}: MarkLessonCompleteButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleMarkComplete() {
    try {
      setSaving(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("Please login before marking lesson progress.");
        router.push("/login");
        return;
      }

      const learner = user as SupabaseLearner;

      if (!learner.email) {
        alert("Your account email could not be found. Please login again.");
        router.push("/login");
        return;
      }

      const learnerName =
        learner.user_metadata?.full_name || learner.email || "Learner";

      const response = await fetch(`/api/courses/${courseSlug}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: learner.id,
          email: learner.email,
          name: learnerName,
          lessonSlug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while updating progress.");
        return;
      }

      alert(`✅ Lesson marked complete. Course progress is now ${data.enrollment.progress}%.`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while marking this lesson complete.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleMarkComplete}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CheckCircle size={18} />
      {saving ? "Saving Progress..." : "Mark Lesson Complete"}
    </button>
  );
}