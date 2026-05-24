import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
  Award,
  LayoutDashboard,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="font-bold text-[#007F73]">Admin Dashboard</p>

            <h1 className="mt-4 text-5xl font-bold">
              KWCA LMS Management
            </h1>

            <p className="mt-4 max-w-3xl text-xl text-gray-600">
              Manage courses, lessons, quiz questions, certificates, learners,
              reports, and platform settings.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 grid gap-6 md:grid-cols-4">
            <Link
              href="/admin/courses"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <BookOpen size={26} />
              </div>

              <p className="text-sm font-bold text-gray-500">
                Course Management
              </p>

              <h2 className="mt-2 text-3xl font-bold">Courses</h2>
            </Link>

            <Link
              href="/admin/certificates"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <Award size={26} />
              </div>

              <p className="text-sm font-bold text-gray-500">
                Certificate Records
              </p>

              <h2 className="mt-2 text-3xl font-bold">Certificates</h2>
            </Link>

            <Link
              href="/admin/learners"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <Users size={26} />
              </div>

              <p className="text-sm font-bold text-gray-500">
                Learner Management
              </p>

              <h2 className="mt-2 text-3xl font-bold">Learners</h2>
            </Link>

            <Link
              href="/admin"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <BarChart3 size={26} />
              </div>

              <p className="text-sm font-bold text-gray-500">
                Platform Reports
              </p>

              <h2 className="mt-2 text-3xl font-bold">Reports</h2>
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/courses"
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <BookOpen size={30} />
              </div>

              <h2 className="text-2xl font-bold text-[#07122E]">
                Manage Courses
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Create, edit, publish, and manage all KWCA LMS courses,
                lessons, quizzes, and learning content.
              </p>

              <p className="mt-5 font-bold text-[#007F73]">
                Open Courses →
              </p>
            </Link>

            <Link
              href="/admin/courses/create"
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <PlusCircle size={30} />
              </div>

              <h2 className="text-2xl font-bold text-[#07122E]">
                Add New Course
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Add a new course to the platform, including course title,
                category, description, access type, and learning outcomes.
              </p>

              <p className="mt-5 font-bold text-[#007F73]">
                Create Course →
              </p>
            </Link>

            <Link
              href="/admin/learners"
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <Users size={30} />
              </div>

              <h2 className="text-2xl font-bold text-[#07122E]">
                Learners
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                View registered learners, course enrollments, quiz results,
                progress, and issued certificates.
              </p>

              <p className="mt-5 font-bold text-[#007F73]">
                View Learners →
              </p>
            </Link>

            <Link
              href="/admin/certificates"
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <Award size={30} />
              </div>

              <h2 className="text-2xl font-bold text-[#07122E]">
                Certificates
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                View issued learner certificates, certificate IDs, course
                titles, learner emails, and issue dates.
              </p>

              <p className="mt-5 font-bold text-[#007F73]">
                View Certificates →
              </p>
            </Link>

            <Link
              href="/admin"
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <BarChart3 size={30} />
              </div>

              <h2 className="text-2xl font-bold text-[#07122E]">
                Reports
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Track course completion, quiz performance, certificates issued,
                learner engagement, and platform activity.
              </p>

              <p className="mt-5 font-bold text-gray-400">
                Coming Soon →
              </p>
            </Link>

            <Link
              href="/admin"
              className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <Settings size={30} />
              </div>

              <h2 className="text-2xl font-bold text-[#07122E]">
                Settings
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Manage platform settings, payment options, access rules, and
                system configuration.
              </p>

              <p className="mt-5 font-bold text-gray-400">
                Coming Soon →
              </p>
            </Link>
          </div>

          <div className="mt-12 rounded-3xl bg-[#07122E] p-8 text-white">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <LayoutDashboard size={30} />
                </div>

                <h2 className="text-3xl font-bold">
                  KWCA LMS Admin Control Centre
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-white/70">
                  This dashboard brings together the core management tools for
                  courses, lessons, quizzes, learners, certificates, and platform
                  reporting.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/courses"
                  className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  Manage Courses
                </Link>

                <Link
                  href="/admin/learners"
                  className="rounded-xl border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10"
                >
                  View Learners
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}