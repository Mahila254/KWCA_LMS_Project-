import Link from "next/link";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1E1D59]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo-white.png"
            alt="Kenya Wildlife Conservancies Foundation"
            className="h-11 w-auto object-contain"
          />

          <span className="hidden text-base font-extrabold text-white sm:block">
            Conservancies Learning Hub
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#about"
            className="text-sm font-bold text-white/80 transition hover:text-white"
          >
            About
          </Link>

          <Link
            href="/courses"
            className="text-sm font-bold text-white/80 transition hover:text-white"
          >
            Courses
          </Link>

          <Link
            href="/#why-platform"
            className="text-sm font-bold text-white/80 transition hover:text-white"
          >
            Resources
          </Link>

          <span className="h-6 w-px bg-white/15" />

          <Link
            href="/profile"
            className="flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white"
          >
            <User size={17} />
            My Profile
          </Link>

          <Link
            href="/login"
            className="rounded-full bg-[#632854] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4F2043]"
          >
            Enrol Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
