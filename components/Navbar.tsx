import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="KWCA Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/courses"
            className="font-bold text-gray-700 hover:text-[#007F73]"
          >
            Courses
          </Link>

          <Link
            href="/verify-certificate"
            className="font-bold text-gray-700 hover:text-[#007F73]"
          >
            Verify Certificate
          </Link>

          <Link
            href="/profile"
            className="font-bold text-gray-700 hover:text-[#007F73]"
          >
            Profile
          </Link>

          <Link
            href="/login"
            className="rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
          >
            Learner Login
          </Link>
        </nav>
      </div>
    </header>
  );
}