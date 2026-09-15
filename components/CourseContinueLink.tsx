"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";

type LessonRef = {
  slug: string;
};

type CourseContinueLinkProps = {
  courseSlug: string;
  lessons: LessonRef[];
  className: string;
  initialLabel?: string;
};

// The course page's primary CTA always used to say "Start Course" /
// "Continue to First Lesson" and point at lesson 1, no matter how far a
// learner had already gotten — so reopening a course you'd already
// finished (or were halfway through) looked exactly like starting it for
// the first time. This checks the learner's saved progress and swaps the
// label + destination to match: "Continue Learning" at the next
// unfinished lesson, or "Review Course" once it's done.
export default function CourseContinueLink({
  courseSlug,
  lessons,
  className,
  initialLabel = "Start Course",
}: CourseContinueLinkProps) {
  const firstLessonSlug = lessons[0]?.slug;

  const [label, setLabel] = useState(initialLabel);
  const [href, setHref] = useState(
    firstLessonSlug ? `/courses/${courseSlug}/${firstLessonSlug}` : "#"
  );

  useEffect(() => {
    if (lessons.length === 0) return;

    let cancelled = false;

    async function checkProgress() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const response = await authFetch(
          `/api/courses/${courseSlug}/learner-status`
        );

        const data = await response.json();

        if (cancelled || !response.ok || !data?.enrolled) return;

        const progress = data.enrollment?.progress ?? 0;
        const completed = Boolean(data.enrollment?.completed);

        if (completed || progress >= 100) {
          setLabel("Review Course");
          setHref(`/courses/${courseSlug}/${lessons[0].slug}`);
          return;
        }

        const completedLessons = Math.round((progress / 100) * lessons.length);
        const nextIndex = Math.min(
          Math.max(completedLessons, 0),
          lessons.length - 1
        );

        setLabel("Continue Learning");
        setHref(`/courses/${courseSlug}/${lessons[nextIndex].slug}`);
      } catch (error) {
        console.error("Course progress check failed:", error);
      }
    }

    checkProgress();

    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessons]);

  if (!firstLessonSlug) {
    return null;
  }

  return (
    <Link href={href} className={className}>
      {label}
      <ArrowRight size={18} />
    </Link>
  );
}
