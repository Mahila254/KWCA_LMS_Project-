import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Award,
  Settings,
  Home,
} from "lucide-react";

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-[#07122E] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
            <LayoutDashboard size={24} />
          </div>

          <div>
            <p className="text-lg font-extrabold leading-none">KWCA Admin</p>
            <p className="mt-1 text-xs font-semibold text-white/60">
              LMS Control Centre
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/admin"
            className="font-semibold text-white/80 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/courses"
            className="font-semibold text-white/80 hover:text-white"
          >
            Courses
          </Link>

          <Link
            href="/admin/learners"
            className="font-semibold text-white/80 hover:text-white"
          >
            Learners
          </Link>

          <Link
            href="/admin/reports"
            className="font-semibold text-white/80 hover:text-white"
          >
            Reports
          </Link>

          <Link
            href="/admin/certificates"
            className="font-semibold text-white/80 hover:text-white"
          >
            Certificates
          </Link>

          <Link
            href="/admin/settings"
            className="font-semibold text-white/80 hover:text-white"
          >
            Settings
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 font-bold text-white hover:bg-white/10"
          >
            <Home size={18} />
            Public Site
          </Link>

          <AdminLogoutButton />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/admin/courses"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white"
            aria-label="Admin Courses"
          >
            <BookOpen size={20} />
          </Link>

          <Link
            href="/admin/learners"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white"
            aria-label="Admin Learners"
          >
            <Users size={20} />
          </Link>

          <Link
            href="/admin/reports"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white"
            aria-label="Admin Reports"
          >
            <BarChart3 size={20} />
          </Link>

          <Link
            href="/admin/certificates"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white"
            aria-label="Admin Certificates"
          >
            <Award size={20} />
          </Link>

          <Link
            href="/admin/settings"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white"
            aria-label="Admin Settings"
          >
            <Settings size={20} />
          </Link>
        </div>
      </nav>
    </header>
  );
}