"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  User,
  Mail,
  LogOut,
  BookOpen,
  Award,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

type Learner = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function ProfilePage() {
  const router = useRouter();

  const [learner, setLearner] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/login");
          return;
        }

        setLearner(user as Learner);
      } catch (error) {
        console.error(error);
        alert("Something went wrong while loading your profile.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        alert(error.message);
        return;
      }

      alert("You have been logged out.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while logging out.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-3xl font-bold">Loading profile...</h1>
        </main>

        <Footer />
      </>
    );
  }

  const learnerName =
    learner?.user_metadata?.full_name || learner?.email || "Learner";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <p className="font-bold text-[#007F73]">Learner Profile</p>

            <h1 className="mt-4 text-5xl font-extrabold">
              Welcome, {learnerName}
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Manage your learner account, continue your courses, access your
              certificates, and track your learning journey.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-1">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
              <User size={42} />
            </div>

            <h2 className="text-3xl font-bold">{learnerName}</h2>

            <p className="mt-3 flex items-center gap-2 text-gray-600">
              <Mail size={18} />
              {learner?.email}
            </p>

            <div className="mt-6 rounded-2xl bg-[#F2FBF8] p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#007F73]" size={24} />

                <div>
                  <p className="font-bold">Logged In</p>
                  <p className="text-sm text-gray-600">
                    Your Supabase learner session is active.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-6 py-3 font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={18} />
              {loggingOut ? "Logging Out..." : "Logout"}
            </button>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                  <BookOpen size={26} />
                </div>

                <p className="text-sm font-bold text-gray-500">
                  Enrolled Courses
                </p>

                <h3 className="mt-2 text-3xl font-bold">0</h3>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                  <CheckCircle size={26} />
                </div>

                <p className="text-sm font-bold text-gray-500">
                  Completed Lessons
                </p>

                <h3 className="mt-2 text-3xl font-bold">0</h3>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                  <Award size={26} />
                </div>

                <p className="text-sm font-bold text-gray-500">
                  Certificates
                </p>

                <h3 className="mt-2 text-3xl font-bold">0</h3>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold">Continue Learning</h2>

              <p className="mt-3 leading-7 text-gray-600">
                Your enrolled courses and progress will appear here once we
                connect enrollments and course progress tracking.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  <BookOpen size={18} />
                  Browse Courses
                </Link>

                <Link
                  href="/admin/certificates"
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <Award size={18} />
                  View Certificate Records
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-[#07122E] p-8 text-white">
              <h2 className="text-3xl font-bold">Next Profile Upgrade</h2>

              <p className="mt-3 leading-7 text-white/70">
                The next backend step is linking this Supabase Auth user to your
                Prisma User table, so certificates and quiz results belong to
                the real logged-in learner instead of the demo learner.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}