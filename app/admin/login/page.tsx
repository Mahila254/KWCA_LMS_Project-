"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  AlertCircle,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoggingIn(true);
      setError("");

      if (!accessCode.trim()) {
        setError("Please enter the admin access code.");
        return;
      }

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessCode: accessCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid admin access code.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong while logging in.");
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07122E] px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
          <section className="bg-[#07122E] p-10 text-white">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-white/80 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Public Site
            </Link>

            <div className="mt-20">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
                <ShieldCheck size={34} />
              </div>

              <p className="font-bold text-[#8BE0D4]">KWCA LMS Admin</p>

              <h1 className="mt-4 text-5xl font-extrabold leading-tight">
                Secure Admin Access
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
                This area is reserved for approved KWCA LMS administrators who
                manage courses, learners, reports, certificates, and platform
                settings.
              </p>
            </div>
          </section>

          <section className="p-10 text-[#07122E]">
            <div className="mx-auto max-w-md">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                <Lock size={34} />
              </div>

              <h2 className="text-4xl font-bold">Admin Login</h2>

              <p className="mt-3 leading-7 text-gray-600">
                Enter the admin access code to unlock the LMS control centre.
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="accessCode" className="mb-2 block font-bold">
                    Admin Access Code
                  </label>

                  <div className="relative">
                    <KeyRound
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />

                    <input
                      id="accessCode"
                      type="password"
                      value={accessCode}
                      onChange={(event) => setAccessCode(event.target.value)}
                      placeholder="Enter admin code"
                      className="w-full rounded-xl border px-12 py-4 outline-none focus:border-[#007F73]"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl bg-red-50 p-4 text-red-700">
                    <div className="flex gap-3">
                      <AlertCircle className="mt-1 shrink-0" size={20} />

                      <p className="text-sm font-semibold">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full rounded-xl bg-[#007F73] px-6 py-4 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingIn ? "Checking Access..." : "Unlock Admin Dashboard"}
                </button>
              </form>

              <p className="mt-6 text-sm leading-6 text-gray-500">
                For now, this protects admin pages using a secure server-side
                cookie. Later, we can connect this to real admin user roles.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}