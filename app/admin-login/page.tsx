"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@kwca.org");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function loginAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail === "admin@kwca.org" &&
      password === "admin123"
    ) {
      localStorage.setItem("kwca-admin-login", "true");
      router.push("/admin");
      router.refresh();
      return;
    }

    setError("Invalid email or password.");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h1 className="text-5xl font-bold text-[#07122E]">
              Admin Login
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Sign in to manage KWCA Learning Hub.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-md px-6 py-12">
          <form
            onSubmit={loginAdmin}
            className="space-y-6 rounded-3xl bg-white p-8 shadow-sm"
          >
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block font-bold"
              >
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@kwca.org"
                autoComplete="email"
                required
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block font-bold"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white transition hover:bg-[#006c62]"
            >
              Login as Admin
            </button>

            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p className="font-bold">Demo credentials</p>
              <p>Email: admin@kwca.org</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}