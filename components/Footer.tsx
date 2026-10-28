import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

const platformLinks = [
  { href: "/#about", label: "About Us" },
  { href: "/courses", label: "All Courses" },
  { href: "/#why-platform", label: "Resources" },
  { href: "/verify-certificate", label: "Verify Certificate" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1E1D59] px-6 pt-20 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Big closing statement */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-14 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">
            Living Nature.{" "}
            <em className="accent text-[#F0A8C4]">Living People.</em>
          </h2>

          <Link
            href="/courses"
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-white/25 py-3 pl-6 pr-3 text-sm font-bold hover:border-white hover:bg-white hover:text-[#1E1D59] md:self-auto"
          >
            Browse courses
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:rotate-45 group-hover:bg-[#1E1D59] group-hover:text-white">
              <ArrowUpRight size={17} />
            </span>
          </Link>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img
                src="/logo-white.png"
                alt="Kenya Wildlife Conservancies Foundation"
                className="h-11 w-auto object-contain"
              />

              <span className="text-[15px] font-bold leading-tight">
                Conservancies
                <span className="block font-serif text-lg font-normal italic text-white/75">
                  Learning Hub
                </span>
              </span>
            </div>

            <p className="max-w-sm leading-7 text-white/70">
              Empowering wildlife conservation through education and
              community engagement across Kenya&apos;s conservancies.
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Platform
            </h4>

            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-white/80 hover:text-white"
                  >
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Organisation
            </h4>

            <ul className="space-y-3 text-white/80">
              <li>Kenya Wildlife Conservancies Foundation</li>
              <li>Kenya Wildlife Conservancies Association</li>
              <li>Partners</li>
              <li>Annual Reports</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Mail, text: "info@kwcakenya.com" },
            { icon: Phone, text: "+254 XXX XXX XXX" },
            { icon: MapPin, text: "Nairobi, Kenya" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <item.icon size={16} />
              </span>
              <span className="text-sm text-white/80">{item.text}</span>
            </div>
          ))}
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
