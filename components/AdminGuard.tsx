"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!cancelled) {
          setIsAdmin(Boolean(data.authenticated));
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setIsAdmin(false);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [isLoginPage]);

  // The login page must always render on its own — gating it behind
  // "already logged in as admin" would make it impossible to log in.
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Checking admin access...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-sm text-center">
          <h1 className="text-3xl font-bold text-[#1E1D59]">
            Admin Access Required
          </h1>

          <p className="mt-4 text-gray-600">
            Please login as an admin to access this section.
          </p>

          <Link
            href="/admin/login"
            className="mt-6 inline-block rounded-xl bg-[#1E1D59] px-6 py-3 font-bold text-white"
          >
            Go to Admin Login
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
