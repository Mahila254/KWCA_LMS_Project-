"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const MIN_PASSWORD_LENGTH = 8;

type Stage = "checking" | "ready" | "invalid" | "done";

/**
 * Where the link in the password reset email lands. Supabase reads the token
 * from the link and signs the learner in, which is what lets them set a new
 * password. Without a valid session the link has expired or been used.
 */
export default function ResetPasswordPage() {
  const [stage, setStage] = useState<Stage>("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fires straight away with the session Supabase worked out from the link.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setStage((current) => {
        if (current === "done") return current;
        return session ? "ready" : "invalid";
      });
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Please use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmation) {
      setError("The two passwords don't match.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setSaving(false);

    if (updateError) {
      setError(
        updateError.code === "same_password"
          ? "Please choose a password different from your old one."
          : updateError.status === 401 || updateError.status === 403
            ? "This reset link has expired. Please request a new one."
            : updateError.code === "weak_password"
              ? "That password is too easy to guess. Please choose a stronger one."
              : "We couldn't save your new password. Please try again."
      );
      return;
    }

    setPassword("");
    setConfirmation("");
    setStage("done");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-12 text-ink md:py-16">
        <div className="mx-auto max-w-lg rounded-3xl bg-surface p-6 shadow-sm md:p-8">
          {stage === "checking" && (
            <p aria-busy="true" className="flex items-center gap-3 font-bold">
              <Loader2 size={22} className="animate-spin" />
              Checking your reset link…
            </p>
          )}

          {stage === "invalid" && (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <AlertCircle size={34} />
              </div>

              <h1 className="text-3xl font-bold">This link isn&rsquo;t valid</h1>

              <p className="mt-3 leading-7 text-gray-600">
                Reset links expire and can only be used once. Please request a
                new one and use the latest email we send you.
              </p>

              <Link
                href="/forgot-password"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover"
              >
                Request a New Link
              </Link>
            </>
          )}

          {stage === "ready" && (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-tint">
                <KeyRound size={34} />
              </div>

              <h1 className="text-3xl font-bold">
                Choose a new <em className="accent text-accent">password</em>
              </h1>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="password" className="mb-2 block font-bold">
                    New Password
                  </label>

                  <div className="flex items-center rounded-xl border bg-surface px-4">
                    <Lock size={19} className="shrink-0 text-gray-400" />

                    <input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a new password"
                      className="w-full px-3 py-3 outline-none"
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Use at least {MIN_PASSWORD_LENGTH} characters.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmation" className="mb-2 block font-bold">
                    Confirm New Password
                  </label>

                  <div className="flex items-center rounded-xl border bg-surface px-4">
                    <Lock size={19} className="shrink-0 text-gray-400" />

                    <input
                      id="confirmation"
                      type="password"
                      autoComplete="new-password"
                      value={confirmation}
                      onChange={(event) => setConfirmation(event.target.value)}
                      placeholder="Type it again"
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
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? "Saving..." : "Save New Password"}
                </button>
              </form>
            </>
          )}

          {stage === "done" && (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                <CheckCircle size={34} />
              </div>

              <h1 className="text-3xl font-bold">Password changed</h1>

              <p className="mt-3 leading-7 text-gray-600">
                Your new password is saved and you&rsquo;re signed in.
              </p>

              <Link
                href="/dashboard"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover"
              >
                Go to My Learning
              </Link>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
