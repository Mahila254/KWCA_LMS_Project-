"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

// Shown only to a signed-in admin who has clicked through to the public
// site (e.g. via "Public Site" in the admin nav) — gives them a clear way
// back instead of having to edit the URL by hand. Renders nothing for
// everyone else, and nothing until the admin-session check resolves.
export default function AdminBackToAdminBar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAdminSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!cancelled && data?.authenticated) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Admin session check failed:", error);
      }
    }

    checkAdminSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="print-hidden bg-[#632854] print:hidden">
      <Link
        href="/admin"
        className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 py-2 text-xs font-bold text-white/90 transition hover:text-white sm:justify-start"
      >
        <ShieldCheck size={14} />
        You're viewing the public site as an admin
        <span className="inline-flex items-center gap-1 underline">
          <ArrowLeft size={12} />
          Back to Admin Dashboard
        </span>
      </Link>
    </div>
  );
}
