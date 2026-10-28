"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type MobileMenuLink = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  links: MobileMenuLink[];
  // Extra actions shown under the links, e.g. "Enrol Now" or the admin
  // logout button. Clicking these doesn't close the menu (the logout
  // button has to stay mounted until it finishes); they navigate away.
  children?: ReactNode;
};

/**
 * The ☰ menu for small screens. Navbar and AdminNavbar hide their link
 * rows below the md breakpoint, so without this a phone visitor sees only
 * the logo. Must sit inside a positioned header (sticky/relative): the
 * panel drops down from the bottom edge of that header.
 */
export default function MobileMenu({ links, children }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-white hover:bg-white/10"
      >
        {open ? <X size={26} /> : <Menu size={26} />}
      </button>

      {open && (
        <nav
          id="mobile-menu-panel"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          className="absolute left-0 right-0 top-full max-h-[80dvh] overflow-y-auto border-b border-white/10 bg-[#1E1D59] px-6 pb-6 pt-2 shadow-lg"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 py-4 text-base font-bold text-white/90 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {children && (
            <div className="mt-5 flex flex-col gap-3">{children}</div>
          )}
        </nav>
      )}
    </div>
  );
}
