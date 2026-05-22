"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContinueLearning() {
  const [lesson, setLesson] = useState("lesson-1");

  useEffect(() => {
    const progress =
      JSON.parse(localStorage.getItem("courseProgress") || "{}");

    if (progress["lesson-1"]) {
      setLesson("lesson-2");
    }

    if (progress["lesson-2"]) {
      setLesson("lesson-3");
    }
  }, []);

  return (
    <div className="rounded-3xl bg-[#007F73] p-8 text-white">
      <p className="text-sm opacity-80">
        Continue Learning
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Resume your course
      </h2>

      <p className="mt-4">
        Pick up where you left off.
      </p>

      <Link
        href={`/courses/what-is-a-conservancy/${lesson.title}`}
        className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-[#007F73]"
      >
        Continue →
      </Link>
    </div>
  );
}