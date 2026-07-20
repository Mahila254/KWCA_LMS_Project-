"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
  Award,
  LayoutDashboard,
  CreditCard,
  LoaderCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const adminLogin = window.localStorage.getItem("kwca-admin-login");

    if (adminLogin === "true") {
      setHasAccess(true);
      setCheckingAccess(false);
      return;
    }

    router.replace("/admin/login");
  }, [router]);

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07122E] px-6 text-white">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-[#8BE0D4]"
            size={42}
          />

          <h1 className="mt-5 text-2xl font-bold">
            Opening Admin Dashboard
          </h1>

          <p className="mt-2 text-white/70">
            Checking your admin access...
          </p>
        </div>
      </main>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="font-bold text-[#007F73]">
              Admin Dashboard
            </p>

            <h1 className="mt-4 text-5xl font-bold">
              KWCA LMS Management
            </h1>

            <p className="mt-4 max-w-3xl text-xl text-gray-600">
              Manage courses, lessons, quiz questions, learners, payments,
              reports, certificates, and platform settings.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            <DashboardStatCard
              href="/admin/courses"
              title="Courses"
              label="Course Management"
              icon={<BookOpen size={26} />}
            />

            <DashboardStatCard
              href="/admin/learners"
              title="Learners"
              label="Learner Management"
              icon={<Users size={26} />}
            />

            <DashboardStatCard
              href="/admin/payments"
              title="Payments"
              label="Payment Records"
              icon={<CreditCard size={26} />}
            />

            <DashboardStatCard
              href="/admin/reports"
              title="Reports"
              label="Platform Reports"
              icon={<BarChart3 size={26} />}
            />

            <DashboardStatCard
              href="/admin/certificates"
              title="Certificates"
              label="Certificate Records"
              icon={<Award size={26} />}
            />

            <DashboardStatCard
              href="/admin/settings"
              title="Settings"
              label="Platform Settings"
              icon={<Settings size={26} />}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <DashboardActionCard
              href="/admin/courses"
              title="Manage Courses"
              description="Create, edit, publish, and manage all KWCA LMS courses, lessons, quizzes, and learning content."
              action="Open Courses"
              icon={<BookOpen size={30} />}
            />

            <DashboardActionCard
              href="/admin/courses/create"
              title="Add New Course"
              description="Add a new course to the platform, including course title, category, description, access type, and learning outcomes."
              action="Create Course"
              icon={<PlusCircle size={30} />}
            />

            <DashboardActionCard
              href="/admin/learners"
              title="Learners"
              description="View registered learners, course enrollments, quiz results, progress, and issued certificates."
              action="View Learners"
              icon={<Users size={30} />}
            />

            <DashboardActionCard
              href="/admin/payments"
              title="Payments"
              description="View learner payment requests, payment types, amounts, payment status, and provider references."
              action="View Payments"
              icon={<CreditCard size={30} />}
            />

            <DashboardActionCard
              href="/admin/certificates"
              title="Certificates"
              description="View issued learner certificates, certificate IDs, course titles, learner emails, and issue dates."
              action="View Certificates"
              icon={<Award size={30} />}
            />

            <DashboardActionCard
              href="/admin/reports"
              title="Reports"
              description="View platform activity, learner progress, quiz performance, completion rates, and certificate summaries."
              action="View Reports"
              icon={<BarChart3 size={30} />}
            />

            <DashboardActionCard
              href="/admin/settings"
              title="Settings"
              description="Manage platform settings, payment options, access rules, and system configuration."
              action="Open Settings"
              icon={<Settings size={30} />}
            />
          </div>

          <div className="mt-12 rounded-3xl bg-[#07122E] p-8 text-white">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <LayoutDashboard size={30} />
                </div>

                <h2 className="text-3xl font-bold">
                  KWCA LMS Admin Control Centre
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-white/70">
                  This dashboard brings together the core management tools for
                  courses, learners, payments, reports, certificates, platform
                  settings, and admin operations.
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
                  href="/admin/payments"
                  className="rounded-xl border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10"
                >
                  View Payments
                </Link>

                <Link
                  href="/admin/reports"
                  className="rounded-xl border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10"
                >
                  View Reports
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

type DashboardStatCardProps = {
  href: string;
  title: string;
  label: string;
  icon: React.ReactNode;
};

function DashboardStatCard({
  href,
  title,
  label,
  icon,
}: DashboardStatCardProps) {
  return (
    <Link
      href={href}
      className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
        {icon}
      </div>

      <p className="text-sm font-bold text-gray-500">
        {label}
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        {title}
      </h2>
    </Link>
  );
}

type DashboardActionCardProps = {
  href: string;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
};

function DashboardActionCard({
  href,
  title,
  description,
  action,
  icon,
}: DashboardActionCardProps) {
  return (
    <Link
      href={href}
      className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-[#07122E]">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

      <p className="mt-5 font-bold text-[#007F73]">
        {action} →
      </p>
    </Link>
  );
}