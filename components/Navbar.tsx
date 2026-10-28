"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import AdminBackToAdminBar from "@/components/AdminBackToAdminBar";
import MobileMenu from "@/components/MobileMenu";
import MobileTabBar from "@/components/MobileTabBar";

const links = [
  { href: "/#about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/#why-platform", label: "Resources" },
];

// Section links (/#about) are never "active"; real pages are active on
// themselves and their sub-pages (/courses/abc counts as Courses).
function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeHref = links.find((link) => isActive(pathname, link.href))?.href;
  // The pill sits under the hovered link, falling back to the current page.
  const pillHref = hovered ?? activeHref;

  return (
    <>
      <AdminBackToAdminBar />

      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled
            ? "border-white/10 bg-[#1E1D59]/85 shadow-[0_10px_30px_-12px_rgba(30,29,89,0.45)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-[#1E1D59]"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[padding] duration-500 sm:px-6 ${
            scrolled ? "py-2" : "py-3.5"
          }`}
        >
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="/logo-white.png"
              alt="Kenya Wildlife Conservancies Foundation"
              className={`w-auto object-contain transition-[height] duration-500 ${
                scrolled ? "h-9" : "h-11"
              }`}
            />

            <span className="hidden text-[15px] font-bold leading-tight tracking-tight text-white sm:block md:hidden lg:block">
              Conservancies
              <span className="block font-serif text-lg font-normal italic text-white/75">
                Learning Hub
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                aria-current={activeHref === link.href ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold ${
                  activeHref === link.href
                    ? "text-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {pillHref === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/12"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}

            <span className="mx-3 h-6 w-px bg-white/15" />

            <Link
              href="/profile"
              aria-current={pathname === "/profile" ? "page" : undefined}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/10 ${
                pathname === "/profile" ? "text-white" : "text-white/75 hover:text-white"
              }`}
            >
              <User size={16} />
              My Profile
            </Link>

            <Link
              href="/login"
              className="group ml-2 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#632854] py-2.5 pl-5 pr-4 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(99,40,84,0.8)] hover:bg-[#4F2043] hover:shadow-[0_12px_24px_-8px_rgba(99,40,84,0.9)]"
            >
              Enrol Now
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </nav>

          <MobileMenu
            links={[
              ...links,
              { href: "/dashboard", label: "My Learning" },
              { href: "/profile", label: "My Profile" },
              { href: "/verify-certificate", label: "Verify a Certificate" },
            ]}
          >
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-full bg-[#632854] px-6 py-4 text-center text-base font-bold text-white hover:bg-[#4F2043]"
            >
              Enrol Now
              <ArrowRight size={18} />
            </Link>
          </MobileMenu>
        </div>
      </header>

      <MobileTabBar />
    </>
  );
}
