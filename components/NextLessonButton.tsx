"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";

type NextLessonButtonProps = {
  courseSlug: string;
  lessonSlug: string;
  href: string;
  label: string;
  isAdminPreview: boolean;
};

// "Next Lesson" is how a learner completes a lesson: it saves the lesson
// being left as complete, briefly confirms it, then opens the next part.
// There's no separate "Mark Lesson Complete" step any more. The progress
// route never lowers progress, so going back to re-read an earlier
// lesson and clicking Next again is harmless.
export default function NextLessonButton({
  courseSlug,
  lessonSlug,
  href,
  label,
  isAdminPreview,
}: NextLessonButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  async function handleClick() {
    if (isAdminPreview) {
      router.push(href);
      return;
    }

    setState("saving");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const response = await authFetch(`/api/courses/${courseSlug}/progress`, {
          method: "POST",
          body: JSON.stringify({ lessonSlug }),
        });

        if (response.ok) {
          setState("saved");
          // Long enough to read "Lesson complete", short enough not to
          // feel like waiting.
          await new Promise((resolve) => setTimeout(resolve, 450));
        }
      }
    } catch (error) {
      // Don't block moving on just because the save failed.
      console.error("Saving lesson progress failed:", error);
    } finally {
      router.push(href);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={state !== "idle"}
        className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white disabled:cursor-wait ${
          state === "saved"
            ? "bg-green-600"
            : "bg-[#1E1D59] hover:bg-[#14123D]"
        }`}
      >
        {state === "saving" && <Loader2 className="animate-spin" size={18} />}
        {state === "saved" && <CheckCircle size={18} />}
        {state === "saved" ? "Lesson complete" : label}
        {state !== "saved" && <ArrowRight size={18} />}
      </button>

      {!isAdminPreview && (
        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          <CheckCircle size={14} className="text-green-600" />
          Continuing marks this lesson as complete.
        </p>
      )}
    </div>
  );
}
