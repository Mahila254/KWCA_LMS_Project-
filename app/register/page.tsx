"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UserPlus, Mail, Lock, User, Users } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            gender: gender || null,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "✅ Account created successfully. Please check your email to confirm your account."
      );

      setName("");
      setEmail("");
      setPassword("");
      setGender("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
        <section className="bg-[#F1F0FA] px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="font-bold text-[#1E1D59]">Learner Registration</p>

            <h1 className="mt-4 text-5xl font-extrabold">
              Create Your KWCA LMS Account
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Register as a learner to access courses, track progress, complete
              quizzes, and receive certificates.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F0FA] text-[#1E1D59]">
              <UserPlus size={34} />
            </div>

            <h2 className="text-3xl font-bold">Register</h2>

            <p className="mt-3 leading-7 text-gray-600">
              Create your learner profile using your name, email, and password.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block font-bold">Full Name</label>

                <div className="flex items-center rounded-xl border bg-white px-4">
                  <User size={19} className="text-gray-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-3 outline-none"
                  />
                </div>
              </div>

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
                <label className="mb-2 block font-bold">
                  Gender <span className="font-normal text-gray-400">(optional)</span>
                </label>

                <div className="flex items-center rounded-xl border bg-white px-4">
                  <Users size={19} className="text-gray-400" />

                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className="w-full appearance-none bg-transparent px-3 py-3 outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
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
                    placeholder="Create a password"
                    className="w-full px-3 py-3 outline-none"
                  />
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Use at least 6 characters.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="w-full rounded-xl bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-[#1E1D59]">
                  Login here
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#1E1D59] p-8 text-white">
            <h2 className="text-3xl font-bold">Why create an account?</h2>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold">Track your learning</h3>
                <p className="mt-2 leading-7 text-white/70">
                  Keep your course progress, quiz records, and certificates in
                  one learner profile.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold">Access premium content</h3>
                <p className="mt-2 leading-7 text-white/70">
                  Login will later connect to payments and subscriptions for
                  premium courses.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold">Receive certificates</h3>
                <p className="mt-2 leading-7 text-white/70">
                  Certificates will be linked to your verified learner account.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}