"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";

type NextLessonButtonProps = {
  courseSlug: string;
  lessonSlug: string;
  href: string;
  label: string;
  isAdminPreview: boolean;
};

// Previously, moving on only saved progress if a learner separately
// clicked "Mark Lesson Complete" — clicking straight through with "Next
// Lesson" saved nothing, so progress (and what shows as done when the
// course is reopened) silently lagged behind what was actually read.
// This saves the lesson being left before navigating, so "Next Lesson"
// alone is enough to keep progress accurate.
export default function NextLessonButton({
  courseSlug,
  lessonSlug,
  href,
  label,
  isAdminPreview,
}: NextLessonButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    if (isAdminPreview) {
      router.push(href);
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await authFetch(`/api/courses/${courseSlug}/progress`, {
          method: "POST",
          body: JSON.stringify({ lessonSlug }),
        });
      }
    } catch (error) {
      // Don't block navigation on a failed save — the explicit "Mark
      // Lesson Complete" button is still there as a fallback.
      console.error("Auto-save lesson progress failed:", error);
    } finally {
      setSaving(false);
      router.push(href);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-xl bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {saving ? <Loader2 className="animate-spin" size={18} /> : null}
      {label}
      <ArrowRight size={18} />
    </button>
  );
}
