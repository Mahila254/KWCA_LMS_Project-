export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  ArrowRight,
  Lock,
  Eye,
  GraduationCap,
} from "lucide-react";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <p className="font-bold text-[#007F73]">KWCA Learning Hub</p>

            <h1 className="mt-4 max-w-4xl text-5xl font-extrabold">
              Explore Courses
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              Access practical courses designed for conservancy leaders,
              managers, board members, and community stakeholders.
            </p>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            {courses.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                  <BookOpen size={32} />
                </div>

                <h2 className="text-3xl font-bold">
                  No courses available yet
                </h2>

                <p className="mt-3 text-gray-600">
                  Courses added by the admin will appear here.
                </p>

                <Link
                  href="/admin/courses/create"
                  className="mt-6 inline-block rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  Add First Course
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-3">
                {courses.map((course) => {
                  const isFreePreview =
                    course.accessType === "FREE_PREVIEW";

                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#007F73] hover:shadow-xl"
                    >
                      <div className="flex h-48 items-center justify-center bg-[#F2FBF8]">
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-[#007F73]">
                            <GraduationCap
                              size={48}
                              className="mx-auto mb-2"
                            />
                            <p className="font-bold">Course Image</p>
                          </div>
                        )}
                      </div>

                      <div className="p-7">
                        <div className="mb-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                            {course.category || "General"}
                          </span>

                          {isFreePreview ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              <Eye size={13} />
                              Free Preview
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#D94A00]">
                              <Lock size={13} />
                              Premium
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl font-extrabold leading-snug">
                          {course.title}
                        </h2>

                        <p className="mt-4 line-clamp-3 leading-7 text-gray-600">
                          {course.description ||
                            "Course description will appear here."}
                        </p>

                        <div className="mt-6 flex items-center justify-between">
                          <p className="flex items-center gap-2 text-sm font-bold text-gray-500">
                            <BookOpen size={16} />
                            {course.numberOfLessons} Lessons
                          </p>

                          <ArrowRight className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#007F73]" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}