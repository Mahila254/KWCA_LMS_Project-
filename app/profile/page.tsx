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
  ClipboardList,
  CalendarDays,
  BarChart3,
} from "lucide-react";

type Learner = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

type Course = {
  title: string;
  slug: string;
  category?: string | null;
};

type QuizResult = {
  id: string;
  quizType: string;
  score: number;
  passed: boolean;
  createdAt: string;
  course: Course;
};

type Certificate = {
  id: string;
  certificateCode: string;
  issuedAt: string;
  course: Course;
};

type Enrollment = {
  id: string;
  progress: number;
  completed: boolean;
  course: Course;
};

type ProfileSummary = {
  enrolledCourses: number;
  quizResults: number;
  certificates: number;
  passedFinalQuizzes: number;
};

export default function ProfilePage() {
  const router = useRouter();

  const [learner, setLearner] = useState<Learner | null>(null);
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    async function loadUserAndProfile() {
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

        const learnerName =
          learnerUser.user_metadata?.full_name ||
          learnerUser.email ||
          "Learner";

        const syncResponse = await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: learnerUser.id,
            email: learnerUser.email,
            name: learnerName,
          }),
        });

        if (syncResponse.ok) {
          setSynced(true);
        } else {
          setSynced(false);
        }

        if (learnerUser.email) {
          const profileResponse = await fetch(
            `/api/profile?email=${encodeURIComponent(learnerUser.email)}`
          );

          const profileData = await profileResponse.json();

          if (profileResponse.ok) {
            setSummary(profileData.summary);
            setQuizResults(profileData.quizResults || []);
            setCertificates(profileData.certificates || []);
            setEnrollments(profileData.enrollments || []);
          } else {
            console.error(profileData.error || "Failed to load profile data.");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong while loading your profile.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUserAndProfile();
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
              Manage your learner account, continue your courses, view quiz
              results, and access your issued certificates.
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
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                  <BookOpen size={26} />
                </div>

                <p className="text-sm font-bold text-gray-500">
                  Enrolled Courses
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {summary?.enrolledCourses || 0}
                </h3>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                  <ClipboardList size={26} />
                </div>

                <p className="text-sm font-bold text-gray-500">
                  Quiz Results
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {summary?.quizResults || 0}
                </h3>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                  <CheckCircle size={26} />
                </div>

                <p className="text-sm font-bold text-gray-500">
                  Passed Finals
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {summary?.passedFinalQuizzes || 0}
                </h3>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2FBF8] text-[#007F73]">
                  <Award size={26} />
                </div>

                <p className="text-sm font-bold text-gray-500">
                  Certificates
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {summary?.certificates || 0}
                </h3>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Continue Learning</h2>

                  <p className="mt-3 leading-7 text-gray-600">
                    Browse available KWCA courses and continue your learning
                    journey.
                  </p>
                </div>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  <BookOpen size={18} />
                  Browse Courses
                </Link>
              </div>

              {enrollments.length > 0 ? (
                <div className="mt-8 space-y-4">
                  {enrollments.map((enrollment) => (
                    <Link
                      key={enrollment.id}
                      href={`/courses/${enrollment.course.slug}`}
                      className="block rounded-2xl border p-5 hover:bg-gray-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {enrollment.course.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-600">
                            {enrollment.course.category || "General"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-[#007F73]">
                            {enrollment.progress}% Progress
                          </p>

                          <p className="text-sm text-gray-500">
                            {enrollment.completed
                              ? "Completed"
                              : "In Progress"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
                  No enrollments yet. Once course enrollment is connected, your
                  active courses will appear here.
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <BarChart3 className="text-[#007F73]" size={28} />
                <h2 className="text-3xl font-bold">Quiz Results</h2>
              </div>

              {quizResults.length === 0 ? (
                <p className="rounded-2xl bg-gray-50 p-5 text-gray-600">
                  No quiz results yet. Final quiz results will appear here after
                  you submit a graded quiz.
                </p>
              ) : (
                <div className="space-y-4">
                  {quizResults.map((result) => {
                    const resultDate = new Date(
                      result.createdAt
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={result.id}
                        className="rounded-2xl border p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-500">
                              {result.quizType} Quiz
                            </p>

                            <h3 className="mt-1 text-xl font-bold">
                              {result.course.title}
                            </h3>

                            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                              <CalendarDays size={15} />
                              {resultDate}
                            </p>
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-3xl font-extrabold ${
                                result.passed
                                  ? "text-[#007F73]"
                                  : "text-red-600"
                              }`}
                            >
                              {result.score}%
                            </p>

                            <p
                              className={`mt-1 font-bold ${
                                result.passed
                                  ? "text-green-700"
                                  : "text-red-600"
                              }`}
                            >
                              {result.passed ? "Passed" : "Not Passed"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <Award className="text-[#007F73]" size={28} />
                <h2 className="text-3xl font-bold">My Certificates</h2>
              </div>

              {certificates.length === 0 ? (
                <p className="rounded-2xl bg-gray-50 p-5 text-gray-600">
                  No certificates yet. Certificates will appear here after you
                  pass a final quiz and generate a certificate.
                </p>
              ) : (
                <div className="space-y-4">
                  {certificates.map((certificate) => {
                    const issuedDate = new Date(
                      certificate.issuedAt
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={certificate.id}
                        className="rounded-2xl border p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-500">
                              Certificate ID
                            </p>

                            <h3 className="mt-1 text-xl font-bold text-[#007F73]">
                              {certificate.certificateCode}
                            </h3>

                            <p className="mt-2 font-bold">
                              {certificate.course.title}
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                              <CalendarDays size={15} />
                              {issuedDate}
                            </p>
                          </div>

                          <Link
                            href={`/courses/${certificate.course.slug}/certificate`}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
                          >
                            <Award size={17} />
                            View Certificate
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}