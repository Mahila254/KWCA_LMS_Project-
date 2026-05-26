"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, PlayCircle } from "lucide-react";

type PremiumLessonAccessButtonProps = {
  courseId: string;
  courseSlug: string;
  lessonSlug: string;
};

type SupabaseLearner = {
  email?: string;
};

export default function PremiumLessonAccessButton({
  courseId,
  courseSlug,
  lessonSlug,
}: PremiumLessonAccessButtonProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function handleAccessPremiumLesson() {
    try {
      setChecking(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("Please login before accessing premium lessons.");
        router.push("/login");
        return;
      }

      const learner = user as SupabaseLearner;

      if (!learner.email) {
        alert("Your account email could not be found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/access/check-premium", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: learner.email,
          courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while checking access.");
        return;
      }

      if (!data.hasAccess) {
        alert(
          "This is premium content. Please complete payment or subscription to unlock it."
        );
        router.push("/pricing");
        return;
      }

      router.push(`/courses/${courseSlug}/${lessonSlug}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while checking premium access.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAccessPremiumLesson}
      disabled={checking}
      className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#D94A00] hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {checking ? (
        <>
          <Lock size={15} />
          Checking...
        </>
      ) : (
        <>
          <PlayCircle size={15} />
          Unlock Premium
        </>
      )}
    </button>
  );
}