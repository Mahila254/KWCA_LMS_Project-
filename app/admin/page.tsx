import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminLogout from "@/components/AdminLogout";

import {
  BookOpen,
  Users,
  Video,
  FileText,
  HelpCircle,
  BarChart3,
} from "lucide-react";

export default function AdminPage() {
  const adminCards = [
    {
      title: "Manage Courses",
      description: "Create, edit, and organize course modules.",
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      title: "Manage Lessons",
      description: "Add lesson notes, videos, activities, and resources.",
      icon: Video,
      href: "/admin/lessons",
    },
    {
      title: "Resources",
      description: "Upload PDFs, guides, templates, and tools.",
      icon: FileText,
      href: "/admin/resources",
    },
    {
      title: "Quizzes",
      description: "Create quiz questions and manage assessments.",
      icon: HelpCircle,
      href: "/admin/quizzes",
    },
    {
      title: "Learners",
      description: "View learners, enrollments, and completion progress.",
      icon: Users,
      href: "/admin/learners",
    },
    {
      title: "Reports",
      description: "Track platform usage and course performance.",
      icon: BarChart3,
      href: "/admin/reports",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">

        {/* Hero */}

        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-6xl px-6">

            <p className="font-bold text-[#007F73]">
              Admin Dashboard
            </p>

            <h1 className="mt-3 text-6xl font-bold text-[#07122E]">
              Manage KWCA Learning Hub
            </h1>

            <p className="mt-4 max-w-2xl text-xl text-gray-600">
              Manage courses, lessons, resources,
              quizzes, learners and reports
              from one central dashboard.
            </p>

            {/* Logout Button */}

            <div className="mt-6">
              <AdminLogout />
            </div>

          </div>
        </section>

        {/* Dashboard Cards */}

        <section className="mx-auto max-w-6xl px-6 py-16">

          <div className="grid gap-8 md:grid-cols-3">

            {adminCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007F73] text-white">
                    <Icon size={30} />
                  </div>

                  <h2 className="text-3xl font-bold text-[#07122E]">
                    {card.title}
                  </h2>

                  <p className="mt-3 text-gray-600">
                    {card.description}
                  </p>

                </Link>
              );
            })}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}