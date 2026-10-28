"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type MobileMenuLink = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  links: MobileMenuLink[];
  // Extra actions shown under the links, e.g. "Enrol Now". Clicking these
  // doesn't close the menu; they navigate away, and the route change
  // closes it.
  children?: ReactNode;
};

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The menu for small screens. Navbar hides its link row below the md
 * breakpoint, so phones get this instead: a full-height sheet that drops
 * from under the header with the links rising in one after another.
 * Must sit inside a positioned header (sticky/relative).
 */
export default function MobileMenu({ links, children }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close whenever the page changes (covers links in `children` too).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Freeze the page behind the open sheet, and let Escape close it.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10"
      >
        {/* Two bars that cross into an X */}
        <span
          className={`absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
            open ? "rotate-45" : "-translate-y-[4px]"
          }`}
        />
        <span
          className={`absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
            open ? "-rotate-45" : "translate-y-[4px]"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu-panel"
            key="panel"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease }}
            className="absolute left-0 right-0 top-full flex h-[calc(100dvh-100%)] flex-col overflow-y-auto bg-[#1E1D59] px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4"
          >
            <ul className="flex flex-col">
              {links.map((link, index) => {
                const active = !link.href.includes("#") && pathname === link.href;

                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.08 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center justify-between border-b border-white/10 py-4 text-2xl font-semibold tracking-tight ${
                        active ? "text-white" : "text-white/80 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#F0A8C4]" />
                        )}
                        {link.label}
                      </span>
                      <ArrowUpRight
                        size={20}
                        className="text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.1 + links.length * 0.05 }}
                className="mt-8 flex flex-col gap-3"
              >
                {children}
              </motion.div>
            )}

            <p className="mt-auto pt-10 font-serif text-lg italic text-white/50">
              Living Nature. Living People.
            </p>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
