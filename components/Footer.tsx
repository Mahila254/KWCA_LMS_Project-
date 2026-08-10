import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E1D59] px-6 pt-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/logo-white.png"
                alt="Kenya Wildlife Conservancies Foundation"
                className="h-11 w-auto object-contain"
              />

              <span className="text-base font-extrabold">
                Conservancies Learning Hub
              </span>
            </div>

            <p className="text-white/70">
              Empowering wildlife conservation through education and
              community engagement across Kenya&apos;s conservancies.
            </p>

            <p className="mt-4 text-sm font-extrabold uppercase tracking-wide text-[#F0A8C4]">
              Living Nature. Living People.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-white/60">
              Platform
            </h4>

            <div className="space-y-3 text-white/80">
              <Link href="/#about" className="block hover:text-white">
                About Us
              </Link>
              <Link href="/courses" className="block hover:text-white">
                All Courses
              </Link>
              <Link href="/#why-platform" className="block hover:text-white">
                Resources
              </Link>
              <Link
                href="/verify-certificate"
                className="block hover:text-white"
              >
                Verify Certificate
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-white/60">
              Organisation
            </h4>

            <div className="space-y-3 text-white/80">
              <p>Kenya Wildlife Conservancies Foundation</p>
              <p>Kenya Wildlife Conservancies Association</p>
              <p>Partners</p>
              <p>Annual Reports</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 rounded-3xl bg-white/5 p-6 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Mail size={17} />
            </span>
            <span className="text-sm text-white/80">info@kwcakenya.com</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Phone size={17} />
            </span>
            <span className="text-sm text-white/80">+254 XXX XXX XXX</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <MapPin size={17} />
            </span>
            <span className="text-sm text-white/80">Nairobi, Kenya</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Kenya Wildlife Conservancies
            Association. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
