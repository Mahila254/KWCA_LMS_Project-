"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import AdminLogoutButton from "@/components/AdminLogoutButton";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/learners", label: "Learners" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/quiz-results", label: "Quiz Results" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/settings", label: "Settings" },
];

// /admin is only active on itself; the rest also cover their sub-pages
// (/admin/courses/abc/edit counts as Courses).
function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Admin header: a slim top bar (logo, public site, logout) and a tab row
 * underneath. The tab row is one line at every width: on phones and
 * tablets it swipes sideways, and the current tab scrolls itself into
 * view so you never land on a page with its tab hidden off-screen.
 */
export default function AdminNavbar() {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#1E1D59]/95 text-white shadow-[0_10px_30px_-14px_rgba(30,29,89,0.6)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-3 sm:px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-1.5">
            <img
              src="/logo.png?v=2"
              alt="KWCA Logo"
              className="h-9 w-auto object-contain"
            />
          </div>

          <p className="text-lg font-bold leading-tight">
            Admin
            <span className="block font-serif text-sm font-normal italic text-white/60">
              Learning Hub
            </span>
          </p>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="Public Site"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">Public Site</span>
          </Link>

          <AdminLogoutButton />
        </div>
      </div>

      <nav
        aria-label="Admin sections"
        className="no-scrollbar mx-auto max-w-7xl overflow-x-auto px-2 sm:px-4"
      >
        <ul className="flex w-max gap-1 py-2.5">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  ref={active ? activeRef : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`relative block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                    active ? "text-[#1E1D59]" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-tab"
                      className="absolute inset-0 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
