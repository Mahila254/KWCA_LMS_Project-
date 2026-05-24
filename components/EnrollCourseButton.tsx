"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BookOpenCheck } from "lucide-react";

type EnrollCourseButtonProps = {
  courseSlug: string;
};

type SupabaseLearner = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function EnrollCourseButton({
  courseSlug,
}: EnrollCourseButtonProps) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);

  async function handleEnroll() {
    try {
      setEnrolling(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("Please login before enrolling in this course.");
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

      const response = await fetch(`/api/courses/${courseSlug}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: learner.id,
          email: learner.email,
          name: learnerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while enrolling.");
        return;
      }

      alert("✅ You have enrolled in this course!");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while enrolling in this course.");
    } finally {
      setEnrolling(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleEnroll}
      disabled={enrolling}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <BookOpenCheck size={18} />
      {enrolling ? "Enrolling..." : "Enroll in Course"}
    </button>
  );
}