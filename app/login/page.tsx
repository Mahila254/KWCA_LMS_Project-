"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PASSWORD_RESET_EMAILS_ENABLED } from "@/lib/features";
import { LogIn, Mail, Lock, CheckCircle } from "lucide-react";
import { notify } from "@/lib/notify";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim()) {
      notify("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      notify("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        notify(error.message);
        return;
      }

      notify("✅ Logged in successfully!");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error(error);
      notify("Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-ink">
        <section className="bg-tint px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="font-bold text-ink">Learner Login</p>

            <h1 className="mt-4 text-5xl font-extrabold">
              Login to Your KWCF LMS <em className="accent text-accent">Account</em>
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Sign in to continue learning, access your courses, track quiz
              progress, and manage your certificates.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-2">
          <div className="rounded-3xl bg-surface p-8 shadow-sm">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-tint text-ink">
              <LogIn size={34} />
            </div>

            <h2 className="text-3xl font-bold">Login</h2>

            <p className="mt-3 leading-7 text-gray-600">
              Use the email and password you registered with.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block font-bold">Email Address</label>

                <div className="flex items-center rounded-xl border bg-surface px-4">
                  <Mail size={19} className="text-gray-400" />

                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block font-bold">Password</label>

                <div className="flex items-center rounded-xl border bg-surface px-4">
                  <Lock size={19} className="text-gray-400" />

                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-3 outline-none"
                  />
                </div>

                {PASSWORD_RESET_EMAILS_ENABLED && (
                  <Link
                    href="/forgot-password"
                    className="mt-2 inline-block text-sm font-bold text-accent underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging In..." : "Login"}
              </button>

              <p className="text-center text-gray-600">
                Do not have an account?{" "}
                <Link href="/register" className="font-bold text-ink">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-primary p-8 text-white">
            <h2 className="text-3xl font-bold">Your learner account helps you</h2>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <CheckCircle className="mt-1 shrink-0 text-accent" />
                <div>
                  <h3 className="text-xl font-bold">Continue learning</h3>
                  <p className="mt-2 leading-7 text-white/70">
                    Return to courses and continue where you left off.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="mt-1 shrink-0 text-accent" />
                <div>
                  <h3 className="text-xl font-bold">Track quiz results</h3>
                  <p className="mt-2 leading-7 text-white/70">
                    Your final quiz results will later be linked to your learner
                    profile.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="mt-1 shrink-0 text-accent" />
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