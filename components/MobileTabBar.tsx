"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Home, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard", label: "Learning", icon: GraduationCap },
  { href: "/profile", label: "Profile", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Thumb-reach navigation for phones (hidden from md up, where the header
 * shows full links). Slides away while scrolling down to read and comes
 * back on the first scroll up. globals.css pads the page bottom whenever
 * this bar is on the page ([data-tabbar]).
 */
export default function MobileTabBar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      // Small jitters (and iOS bounce at the top) shouldn't flicker it.
      if (Math.abs(delta) < 8) return;

      setHidden(delta > 0 && y > 120);
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always show the bar again on a new page.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setHidden(false);
  }

  // Quizzes are a focus mode: the bar would sit on top of the
  // Previous/Next buttons, and the header menu is still there.
  if (pathname.includes("/quiz/")) {
    return null;
  }

  return (
    <nav
      data-tabbar
      aria-label="Quick navigation"
      className={`fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden print:hidden ${
        hidden ? "pointer-events-none translate-y-[140%] opacity-0" : ""
      }`}
    >
      <ul className="mx-auto flex max-w-md items-center justify-between rounded-full border border-white/10 bg-[#1E1D59]/90 p-1.5 shadow-[0_16px_40px_-12px_rgba(30,29,89,0.6)] backdrop-blur-xl backdrop-saturate-150">
        {tabs.map((tab) => {
          const active = isActive(pathname, tab.href);

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-semibold ${
                  active ? "text-white" : "text-white/60"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-white/12"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <tab.icon size={19} className="relative" strokeWidth={active ? 2.4 : 2} />
                <span className="relative">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
