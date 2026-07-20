"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  ArrowLeft,
  Mail,
  KeyRound,
  AlertCircle,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@kwca.org");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoggingIn(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (
      normalizedEmail === "admin@kwca.org" &&
      normalizedPassword === "admin123"
    ) {
      localStorage.setItem("kwca-admin-login", "true");

      router.push("/admin");
      router.refresh();
      return;
    }

    setError("Invalid email or password.");
    setLoggingIn(false);
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
                Secure Admin Login
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
                This area is reserved for approved KWCA LMS administrators.
                Sign in to access the administration dashboard.
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
                Use the demo admin credentials below.
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block font-bold">
                    Admin Email
                  </label>

                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-xl border px-12 py-4 outline-none focus:border-[#007F73]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block font-bold">
                    Password
                  </label>

                  <div className="relative">
                    <KeyRound
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
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
                  {loggingIn ? "Opening Admin Dashboard..." : "Login as Admin"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-bold text-[#07122E]">Demo credentials</p>
                <p>Email: admin@kwca.org</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}