import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <div>
            <h1 className="text-xl font-bold text-[#8B3A12]">
              KWCA
            </h1>
            <p className="text-xs text-gray-500">
              Living nature, living people
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
          <Link href="/#about">About Us</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/#resources">Resources</Link>

          <Link
            href="/login"
            className="font-bold text-[#007F73]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-[#007F73] px-6 py-3 text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}