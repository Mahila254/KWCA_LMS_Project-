"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, KeyRound, Loader2, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { PASSWORD_RESET_EMAILS_ENABLED } from "@/lib/features";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setSending(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    setSending(false);

    if (resetError) {
      setError(
        resetError.status === 429
          ? "Too many requests. Please wait a few minutes and try again."
          : "We couldn't send the email just now. Please try again shortly."
      );
      return;
    }

    setSent(true);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-12 text-[#1E1D59] md:py-16">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-6 shadow-sm md:p-8">
          {!PASSWORD_RESET_EMAILS_ENABLED ? (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F0FA]">
                <KeyRound size={34} />
              </div>

              <h1 className="text-3xl font-bold">Need help signing in?</h1>

              <p className="mt-3 leading-7 text-gray-600">
                Resetting your password by email isn&rsquo;t available yet. If
                you&rsquo;ve forgotten your password, email{" "}
                <a
                  href="mailto:info@kwcakenya.com"
                  className="font-bold text-[#632854] underline-offset-2 hover:underline"
                >
                  info@kwcakenya.com
                </a>{" "}
                from the address you registered with and we&rsquo;ll help you
                get back in.
              </p>
            </>
          ) : sent ? (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <CheckCircle size={34} />
              </div>

              <h1 className="text-3xl font-bold">Check your email</h1>

              {/* Worded the same whether or not the account exists, so this
                  page can't be used to find out who has an account. */}
              <p className="mt-3 leading-7 text-gray-600">
                If an account exists for{" "}
                <strong className="break-words">{email.trim()}</strong>, we have
                sent a link to choose a new password. It may take a few minutes,
                so please check your spam folder too.
              </p>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 font-bold text-[#632854] underline-offset-2 hover:underline"
              >
                Use a different email
              </button>
            </>
          ) : (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F0FA]">
                <KeyRound size={34} />
              </div>

              <h1 className="text-3xl font-bold">
                Forgot your <em className="accent text-[#632854]">password?</em>
              </h1>

              <p className="mt-3 leading-7 text-gray-600">
                Enter the email you registered with and we&rsquo;ll send you a
                link to choose a new one.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block font-bold">
                    Email Address
                  </label>

                  <div className="flex items-center rounded-xl border bg-white px-4">
                    <Mail size={19} className="shrink-0 text-gray-400" />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3 py-3 outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending && <Loader2 size={18} className="animate-spin" />}
                  {sending ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}

          <Link
            href="/login"
            className="mt-6 flex items-center gap-2 font-bold text-[#1E1D59]"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
