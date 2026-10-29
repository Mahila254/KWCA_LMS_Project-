import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

const platformLinks = [
  { href: "/#about", label: "About Us" },
  { href: "/courses", label: "All Courses" },
  { href: "/#why-platform", label: "Resources" },
  { href: "/verify-certificate", label: "Verify Certificate" },
];

// Same details as the Contact Us page of kwcakenya.com. Complaints and
// data requests have their own address, shown on the Privacy and Terms
// pages (components/LegalPage.tsx).
const contactDetails = [
  {
    icon: Mail,
    text: "info@kwcakenya.com",
    detail: "Email",
    href: "mailto:info@kwcakenya.com",
  },
  {
    icon: Phone,
    text: "+254 708 418 522",
    detail: "Mobile",
    href: "tel:+254708418522",
  },
  {
    icon: Phone,
    text: "+254 (20) 251 8211",
    detail: "Landline",
    href: "tel:+254202518211",
  },
  {
    icon: MapPin,
    text: "Seminary Road, off Magadi Road",
    detail: "Karen, Nairobi",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1E1D59] px-6 pt-12 text-white md:pt-16">
      <div className="mx-auto max-w-7xl">
        {/* Big closing statement */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] md:text-5xl">
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

        <div className="grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
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
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Platform
            </h4>

            <ul className="space-y-2.5">
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
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Organisation
            </h4>

            <ul className="space-y-2.5 text-white/80">
              <li>Kenya Wildlife Conservancies Foundation</li>
              <li>Kenya Wildlife Conservancies Association</li>
              <li>Partners</li>
              <li>Annual Reports</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {contactDetails.map((item) => {
            const content = (
              <>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <item.icon size={16} />
                </span>
                <span className="text-sm leading-snug text-white/80">
                  {item.text}
                  {item.detail && (
                    <span className="block text-white/55">{item.detail}</span>
                  )}
                </span>
              </>
            );
            const className =
              "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3";

            return item.href ? (
              <a
                key={item.text}
                href={item.href}
                className={`${className} hover:border-white/30 hover:bg-white/10`}
              >
                {content}
              </a>
            ) : (
              <div key={item.text} className={className}>
                {content}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 text-sm text-white/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Kenya Wildlife Conservancies
            Association. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
