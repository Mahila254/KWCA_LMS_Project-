"use client";

import Link from "next/link";
import { modules } from "@/data/modules";
import { lessons } from "@/data/lessons";

export default function DashboardProgress() {
  const firstCourse = modules[0];
  const courseLessons =
    lessons[firstCourse.slug as keyof typeof lessons] || [];

  let completedLessons: string[] = [];

  if (typeof window !== "undefined") {
    const savedProgress = localStorage.getItem(
      `progress-${firstCourse.slug}`
    );

    if (savedProgress) {
      completedLessons = JSON.parse(savedProgress);
    }
  }

  const progressPercent =
    courseLessons.length > 0
      ? Math.round((completedLessons.length / courseLessons.length) * 100)
      : 0;

  return (
    <>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-gray-500">Courses Enrolled</p>
        <h2 className="mt-2 text-4xl font-bold text-[#101828]">1</h2>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-gray-500">Lessons Completed</p>
        <h2 className="mt-2 text-4xl font-bold text-[#101828]">
          {completedLessons.length}
        </h2>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-gray-500">Overall Progress</p>
        <h2 className="mt-2 text-4xl font-bold text-[#101828]">
          {progressPercent}%
        </h2>
      </div>

      <section className="lg:col-span-4 mt-10">
        <h2 className="mb-6 text-3xl font-bold text-[#101828]">
          My Courses
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {modules.slice(0, 3).map((course) => {
            const courseLessonList =
              lessons[course.slug as keyof typeof lessons] || [];

            let courseCompleted: string[] = [];

            if (typeof window !== "undefined") {
              const saved = localStorage.getItem(`progress-${course.slug}`);
              if (saved) {
                courseCompleted = JSON.parse(saved);
              }
            }

            const courseProgress =
              courseLessonList.length > 0
                ? Math.round(
                    (courseCompleted.length / courseLessonList.length) * 100
                  )
                : 0;

            return (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-md"
              >
                <p className="font-bold text-[#007F73]">
                  {course.module}
                </p>

                <h3 className="mt-3 text-xl font-bold text-[#101828]">
                  {course.title}
                </h3>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#007F73]"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-600">
                  {courseProgress}% complete
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}