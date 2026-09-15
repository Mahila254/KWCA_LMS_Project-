"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
import { Award, BookOpenCheck, CheckCircle2 } from "lucide-react";

type EnrollCourseButtonProps = {
  courseSlug: string;
};

type LearnerStatus = {
  enrolled: boolean;
  enrollment: { completed: boolean } | null;
  finalQuizResult: { score: number } | null;
};

export default function EnrollCourseButton({
  courseSlug,
}: EnrollCourseButtonProps) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [status, setStatus] = useState<LearnerStatus | null>(null);

  // Checks whether this learner is already enrolled (and how far they got)
  // so returning to a course they've already started or finished doesn't
  // look like "Enroll in Course" all over again.
  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const response = await authFetch(
          `/api/courses/${courseSlug}/learner-status`
        );

        const data = await response.json();

        if (!cancelled && response.ok) {
          setStatus(data);
        }
      } catch (error) {
        console.error("Learner status check failed:", error);
      } finally {
        if (!cancelled) {
          setCheckingStatus(false);
        }
      }
    }

    checkStatus();

    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

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

      const response = await authFetch(`/api/courses/${courseSlug}/enroll`, {
        method: "POST",
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

  // Already completed the course (and passed the final quiz) — send them
  // straight to their certificate instead of an "Enroll" button.
  if (
    !checkingStatus &&
    status?.enrolled &&
    status.enrollment?.completed &&
    status.finalQuizResult
  ) {
    return (
      <Link
        href={`/courses/${courseSlug}/certificate`}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
      >
        <Award size={18} />
        Course Completed — View Certificate
      </Link>
    );
  }

  // Already enrolled but still working through it.
  if (!checkingStatus && status?.enrolled) {
    return (
      <span className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#1E1D59] bg-white px-6 py-3 font-bold text-[#1E1D59]">
        <CheckCircle2 size={18} />
        You're Enrolled
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleEnroll}
      disabled={enrolling}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <BookOpenCheck size={18} />
      {enrolling ? "Enrolling..." : "Enroll in Course"}
    </button>
  );
}
