"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogIn, Mail, Lock, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("✅ Logged in successfully!");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="font-bold text-[#007F73]">Learner Login</p>

            <h1 className="mt-4 text-5xl font-extrabold">
              Login to Your KWCA LMS Account
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Sign in to continue learning, access your courses, track quiz
              progress, and manage your certificates.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
              <LogIn size={34} />
            </div>

            <h2 className="text-3xl font-bold">Login</h2>

            <p className="mt-3 leading-7 text-gray-600">
              Use the email and password you registered with.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-bold">Email Address</label>

                <div className="flex items-center rounded-xl border bg-white px-4">
                  <Mail size={19} className="text-gray-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-bold">Password</label>

                <div className="flex items-center rounded-xl border bg-white px-4">
                  <Lock size={19} className="text-gray-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-3 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging In..." : "Login"}
              </button>

              <p className="text-center text-gray-600">
                Do not have an account?{" "}
                <Link href="/register" className="font-bold text-[#007F73]">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#07122E] p-8 text-white">
            <h2 className="text-3xl font-bold">Your learner account helps you</h2>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <CheckCircle className="mt-1 shrink-0 text-[#00B894]" />
                <div>
                  <h3 className="text-xl font-bold">Continue learning</h3>
                  <p className="mt-2 leading-7 text-white/70">
                    Return to courses and continue where you left off.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="mt-1 shrink-0 text-[#00B894]" />
                <div>
                  <h3 className="text-xl font-bold">Track quiz results</h3>
                  <p className="mt-2 leading-7 text-white/70">
                    Your final quiz results will later be linked to your learner
                    profile.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="mt-1 shrink-0 text-[#00B894]" />
                <div>
                  <h3 className="text-xl font-bold">Access certificates</h3>
                  <p className="mt-2 leading-7 text-white/70">
                    Certificates will be issued under your verified learner
                    account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}