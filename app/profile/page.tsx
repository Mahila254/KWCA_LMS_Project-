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
  Database,
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
  const [synced, setSynced] = useState(false);

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

        const learnerUser = user as Learner;
        setLearner(learnerUser);

        const response = await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: learnerUser.id,
            email: learnerUser.email,
            name:
              learnerUser.user_metadata?.full_name ||
              learnerUser.email ||
              "Learner",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(data.error || "User sync failed.");
          setSynced(false);
        } else {
          setSynced(true);
        }
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

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[#F2FBF8] p-5">
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

              <div
                className={`rounded-2xl p-5 ${
                  synced ? "bg-green-50" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database
                    className={synced ? "text-green-600" : "text-[#D94A00]"}
                    size={24}
                  />

                  <div>
                    <p
                      className={`font-bold ${
                        synced ? "text-green-700" : "text-[#D94A00]"
                      }`}
                    >
                      {synced ? "Database Synced" : "Database Sync Pending"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {synced
                        ? "Your learner account is saved in the LMS database."
                        : "Your Supabase account has not synced to the LMS database yet."}
                    </p>
                  </div>
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
              <h2 className="text-3xl font-bold">User Sync Active</h2>

              <p className="mt-3 leading-7 text-white/70">
                This learner profile is now connected to Supabase Auth and the
                Prisma User table. The next step is linking certificates and
                quiz results to this real learner account.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}