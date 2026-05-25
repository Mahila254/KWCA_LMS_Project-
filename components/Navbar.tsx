import Link from "next/link";
import { BookOpen, ShieldCheck, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-[#07122E]">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
            <BookOpen size={24} />
          </div>

          <div>
            <p className="text-lg font-extrabold leading-none">KWCA LMS</p>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              Conservation Learning
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/courses"
            className="font-semibold text-[#07122E] hover:text-[#007F73]"
          >
            Courses
          </Link>

          <Link
            href="/verify-certificate"
            className="font-semibold text-[#07122E] hover:text-[#007F73]"
          >
            Verify Certificate
          </Link>

          <Link
            href="/profile"
            className="font-semibold text-[#07122E] hover:text-[#007F73]"
          >
            Profile
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-4 py-2 font-bold text-white hover:bg-[#00665d]"
          >
            <UserCircle size={18} />
            Learner Profile
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/verify-certificate"
            className="flex h-10 w-10 items-center justify-center rounded-xl border text-[#007F73]"
            aria-label="Verify Certificate"
          >
            <ShieldCheck size={20} />
          </Link>

          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007F73] text-white"
            aria-label="Learner Profile"
          >
            <UserCircle size={20} />
          </Link>
        </div>
      </nav>
    </header>
  );
}