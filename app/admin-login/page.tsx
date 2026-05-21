"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function loginAdmin(e: React.FormEvent) {
    e.preventDefault();

    if (
      email === "admin@kwca.org" &&
      password === "admin123"
    ) {
      localStorage.setItem(
        "kwca-admin-login",
        "true"
      );

      alert("✅ Admin login successful");

      router.push("/admin");
    } else {
      alert("❌ Invalid email or password");
    }
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
            className="rounded-3xl bg-white p-8 shadow-sm space-y-6"
          >
            <div>
              <label className="mb-2 block font-bold">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="admin@kwca.org"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="********"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white"
            >
              Login
            </button>

            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p className="font-bold">
                Demo credentials:
              </p>

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