import Link from "next/link";

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-[#07122E]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-2">
            <img
              src="/logo.png"
              alt="KWCA Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          <p className="text-lg font-extrabold">Admin</p>
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link href="/admin" className="font-bold hover:text-[#9DE0D2]">
            Dashboard
          </Link>

          <Link href="/admin/courses" className="font-bold hover:text-[#9DE0D2]">
            Courses
          </Link>

          <Link href="/admin/learners" className="font-bold hover:text-[#9DE0D2]">
            Learners
          </Link>

          <Link href="/admin/payments" className="font-bold hover:text-[#9DE0D2]">
            Payments
          </Link>

          <Link href="/admin/reports" className="font-bold hover:text-[#9DE0D2]">
            Reports
          </Link>

          <Link
            href="/admin/certificates"
            className="font-bold hover:text-[#9DE0D2]"
          >
            Certificates
          </Link>

          <Link href="/admin/settings" className="font-bold hover:text-[#9DE0D2]">
            Settings
          </Link>

          <Link href="/" className="font-bold hover:text-[#9DE0D2]">
            Public Site
          </Link>

          <Link
            href="/api/admin/logout"
            className="rounded-xl bg-white px-4 py-2 font-bold text-[#07122E] hover:bg-gray-100"
          >
            Logout
          </Link>
        </nav>
      </div>
    </header>
  );
}