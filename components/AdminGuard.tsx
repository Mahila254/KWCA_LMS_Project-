"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("kwca-admin-login");

    if (adminLoggedIn === "true") {
      setIsAdmin(true);
    }

    setChecking(false);
  }, []);

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
          <h1 className="text-3xl font-bold text-[#07122E]">
            Admin Access Required
          </h1>

          <p className="mt-4 text-gray-600">
            Please login as an admin to access this section.
          </p>

          <Link
            href="/admin-login"
            className="mt-6 inline-block rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white"
          >
            Go to Admin Login
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}