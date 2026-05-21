"use client";

import { useEffect, useState } from "react";

type ProgressButtonProps = {
  courseSlug: string;
  lessonSlug: string;
  totalLessons: number;
};

export default function ProgressButton({
  courseSlug,
  lessonSlug,
  totalLessons,
}: ProgressButtonProps) {
  const storageKey = `progress-${courseSlug}`;
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey);

    if (savedProgress) {
      setCompletedLessons(JSON.parse(savedProgress));
    }
  }, [storageKey]);

  const isCompleted = completedLessons.includes(lessonSlug);
  const progressPercent =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  function toggleComplete() {
    let updatedProgress: string[];

    if (isCompleted) {
      updatedProgress = completedLessons.filter((item) => item !== lessonSlug);
    } else {
      updatedProgress = [...completedLessons, lessonSlug];
    }

    setCompletedLessons(updatedProgress);
    localStorage.setItem(storageKey, JSON.stringify(updatedProgress));
  }

  return (
    <div className="mt-6">
      <div className="mb-4">
        <div className="flex justify-between text-sm font-bold text-[#101828] mb-2">
          <span>Course Progress</span>
          <span>{progressPercent}%</span>
        </div>

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#007F73] rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <button
        onClick={toggleComplete}
        className={`w-full py-3 rounded-xl font-bold transition ${
          isCompleted
            ? "bg-green-600 text-white"
            : "bg-[#8B2F0B] text-white"
        }`}
      >
        {isCompleted ? "Completed ✓" : "Mark Complete"}
      </button>
    </div>
  );
}