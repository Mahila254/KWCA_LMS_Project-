import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  BookOpen,
  Eye,
  Lock,
  Award,
  ClipboardList,
  Users,
  PlayCircle,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

type CourseRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  introVideoUrl: string | null;
  learningOutcomes: string | null;
  numberOfLessons: number;
  status: "DRAFT" | "PUBLISHED";
  accessType: "FREE_PREVIEW" | "PREMIUM" | "SUBSCRIPTION_ONLY";
  createdAt: Date;
  updatedAt: Date;
  lessons: {
    id: string;
    accessType: "PREVIEW" | "PREMIUM";
  }[];
  quizQuestions: {
    id: string;
  }[];
  enrollments: {
    id: string;
  }[];
  certificates: {
    id: string;
  }[];
};

export default async function CoursesPage() {
  const courses: CourseRecord[] = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      lessons: {
        select: {
          id: true,
          accessType: true,
        },
      },
      quizQuestions: {
        select: {
          id: true,
        },
      },
      enrollments: {
        select: {
          id: true,
        },
      },
      certificates: {
        select: {
          id: true,
        },
      },
    },
  });

  const totalLessons = courses.reduce(
    (total: number, course: CourseRecord) => total + course.lessons.length,
    0
  );

  const totalLearners = courses.reduce(
    (total: number, course: CourseRecord) => total + course.enrollments.length,
    0
  );

  const totalCertificates = courses.reduce(
    (total: number, course: CourseRecord) =>
      total + course.certificates.length,
    0
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="relative overflow-hidden px-6 py-24">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/course-hero-background.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-white/55" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#F2FBF8]/70 via-white/70 to-gray-50" />

          <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-[#007F73]/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-[#D94A00]/20 blur-3xl" />

          <ScrollReveal className="relative mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="font-bold text-[#007F73]">KWCA Learning Courses</p>

              <h1 className="mt-4 text-5xl font-extrabold leading-tight md:text-7xl">
                Explore Conservation Learning Courses
              </h1>

              <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-600">
                Practical courses designed to support conservancy leaders,
                managers, board members, and community stakeholders with
                accessible digital learning.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <HeroStat
                icon={<BookOpen size={28} />}
                label="Published Courses"
                value={courses.length.toString()}
              />

              <HeroStat
                icon={<ClipboardList size={28} />}
                label="Total Lessons"
                value={totalLessons.toString()}
              />

              <HeroStat
                icon={<Users size={28} />}
                label="Learner Enrollments"
                value={totalLearners.toString()}
              />
            </div>
          </ScrollReveal>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <ScrollReveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-bold text-[#D94A00]">Course Catalogue</p>

              <h2 className="mt-3 text-4xl font-extrabold">
                Available Courses
              </h2>

              <p className="mt-3 max-w-2xl text-gray-600">
                Start with free preview lessons, then unlock premium learning
                through course payment or subscription.
              </p>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold hover:bg-gray-50"
            >
              View My Profile
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>

          {courses.length === 0 ? (
            <ScrollReveal>
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                  <BookOpen size={40} />
                </div>

                <h2 className="text-3xl font-bold">No courses available yet</h2>

                <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                  Published courses will appear here once they are added by the
                  KWCA LMS admin team.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course: CourseRecord) => {
                const previewLessons = course.lessons.filter(
                  (lesson) => lesson.accessType === "PREVIEW"
                ).length;

                const premiumLessons = course.lessons.filter(
                  (lesson) => lesson.accessType === "PREMIUM"
                ).length;

                const imageSource =
                  course.imageUrl && course.imageUrl.trim() !== ""
                    ? course.imageUrl
                    : "/images/course-placeholder.jpg";

                return (
                  <ScrollReveal key={course.id}>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="group block h-full overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                    >
                      <div className="relative h-56 overflow-hidden bg-[#07122E]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageSource}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#07122E]/75 via-[#07122E]/15 to-transparent" />

                        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#007F73]">
                            {course.category || "General"}
                          </span>

                          {course.accessType === "FREE_PREVIEW" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold text-green-700">
                              <Eye size={13} />
                              Free Preview
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-[#D94A00]">
                              <Lock size={13} />
                              Premium
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-5 left-5 right-5">
                          <p className="text-sm font-bold text-white/80">
                            KWCA LMS Course
                          </p>
                        </div>
                      </div>

                      <div className="p-7">
                        <h3 className="text-2xl font-extrabold leading-tight group-hover:text-[#007F73]">
                          {course.title}
                        </h3>

                        <p className="mt-4 line-clamp-4 leading-7 text-gray-600">
                          {course.description ||
                            "A practical conservation learning course designed for conservancy teams and community-based conservation leaders."}
                        </p>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                          <MiniStat
                            icon={<BookOpen size={17} />}
                            value={course.lessons.length.toString()}
                            label="Lessons"
                          />

                          <MiniStat
                            icon={<ClipboardList size={17} />}
                            value={course.quizQuestions.length.toString()}
                            label="Quizzes"
                          />

                          <MiniStat
                            icon={<Award size={17} />}
                            value={course.certificates.length.toString()}
                            label="Awards"
                          />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                            <Eye size={13} />
                            {previewLessons} Preview
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#D94A00]">
                            <Lock size={13} />
                            {premiumLessons} Premium
                          </span>

                          {course.introVideoUrl && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                              <PlayCircle size={13} />
                              Intro Video
                            </span>
                          )}
                        </div>

                        <div className="mt-7 flex items-center justify-between border-t pt-5">
                          <span className="inline-flex items-center gap-2 font-bold text-[#007F73]">
                            View Course
                            <ArrowRight
                              size={18}
                              className="transition group-hover:translate-x-1"
                            />
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F2FBF8] px-3 py-1 text-xs font-bold text-[#007F73]">
                            <CheckCircle size={13} />
                            Available
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <ScrollReveal>
            <div className="overflow-hidden rounded-3xl bg-[#07122E] p-10 text-white shadow-sm md:p-14">
              <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
                <div>
                  <p className="font-bold text-[#9DE0D2]">Learning Pathway</p>

                  <h2 className="mt-3 text-4xl font-extrabold">
                    Build Skills for Stronger Conservancy Management
                  </h2>

                  <p className="mt-4 max-w-3xl leading-8 text-white/75">
                    The KWCA LMS brings together practical lessons, quizzes,
                    readings, and certificates to help conservation teams
                    strengthen governance, management, and sustainability.
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-[#07122E] transition hover:-translate-y-1 hover:bg-gray-100"
                >
                  Go to Learner Profile
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-md">
      <div className="mb-4 flex items-center gap-3 text-[#007F73]">
        {icon}
        <p className="text-sm font-bold text-gray-500">{label}</p>
      </div>

      <p className="text-4xl font-extrabold">{value}</p>
    </div>
  );
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <div className="mb-2 text-[#007F73]">{icon}</div>

      <p className="text-xl font-extrabold">{value}</p>

      <p className="text-xs font-bold text-gray-500">{label}</p>
    </div>
  );
}