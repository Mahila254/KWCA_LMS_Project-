"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LearnerLogoutButton from "@/components/LearnerLogoutButton";
import {
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Loader2,
  Mail,
  User,
  XCircle,
  Clock,
  Hash,
} from "lucide-react";

type Course = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
};

type Enrollment = {
  id: string;
  progress: number;
  completed: boolean;
  createdAt: string;
  course: Course;
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

type Payment = {
  id: string;
  paymentType: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED";
  provider: string;
  providerRef: string | null;
  createdAt: string;
  course: Course | null;
};

type LearnerProfile = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  enrollments: Enrollment[];
  quizResults: QuizResult[];
  certificates: Certificate[];
  payments: Payment[];
};

type SupabaseLearner = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [learner, setLearner] = useState<LearnerProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setError("Please login to view your learner profile.");
          setLoading(false);
          return;
        }

        const supabaseUser = user as SupabaseLearner;

        if (!supabaseUser.email) {
          setError("Your account email could not be found. Please login again.");
          setLoading(false);
          return;
        }

        const learnerName =
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.email ||
          "Learner";

        await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: learnerName,
          }),
        });

        const response = await fetch(
          `/api/profile?email=${encodeURIComponent(supabaseUser.email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Something went wrong while loading profile.");
          setLoading(false);
          return;
        }

        setLearner(data.learner);
      } catch (error) {
        console.error(error);
        setError("Something went wrong while loading your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const passedFinalQuizzes =
    learner?.quizResults.filter(
      (result) => result.quizType === "FINAL" && result.passed
    ).length || 0;

  const paidPayments =
    learner?.payments.filter((payment) => payment.status === "PAID").length ||
    0;

  const pendingPayments =
    learner?.payments.filter((payment) => payment.status === "PENDING")
      .length || 0;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <p className="font-bold text-[#007F73]">Learner Profile</p>

            <h1 className="mt-3 text-5xl font-bold">My Learning Dashboard</h1>

            <p className="mt-4 max-w-3xl text-xl text-gray-600">
              Track your enrolled courses, quiz results, certificates, payment
              history, and learning progress.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                <Loader2 className="animate-spin" size={34} />
              </div>

              <h2 className="text-3xl font-bold">Loading Profile</h2>

              <p className="mt-3 text-gray-600">
                Please wait while we fetch your learning records.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                <XCircle size={34} />
              </div>

              <h2 className="text-3xl font-bold">Profile Unavailable</h2>

              <p className="mt-3 text-gray-600">{error}</p>

              <Link
                href="/login"
                className="mt-6 inline-flex rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                Login
              </Link>
            </div>
          ) : learner ? (
            <div className="space-y-8">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                      <User size={42} />
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold">
                        {learner.name || "Learner"}
                      </h2>

                      <p className="mt-2 flex items-center gap-2 text-gray-600">
                        <Mail size={17} />
                        {learner.email}
                      </p>

                      <p className="mt-2 text-sm font-bold text-[#007F73]">
                        Role: {learner.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/courses"
                      className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                    >
                      Browse Courses
                    </Link>

                    <LearnerLogoutButton />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-5">
                <SummaryCard
                  icon={<BookOpen size={28} />}
                  label="Enrolled Courses"
                  value={learner.enrollments.length.toString()}
                  tone="green"
                />

                <SummaryCard
                  icon={<ClipboardList size={28} />}
                  label="Quiz Results"
                  value={learner.quizResults.length.toString()}
                  tone="orange"
                />

                <SummaryCard
                  icon={<CheckCircle size={28} />}
                  label="Passed Finals"
                  value={passedFinalQuizzes.toString()}
                  tone="green"
                />

                <SummaryCard
                  icon={<Award size={28} />}
                  label="Certificates"
                  value={learner.certificates.length.toString()}
                  tone="green"
                />

                <SummaryCard
                  icon={<CreditCard size={28} />}
                  label="Paid Payments"
                  value={paidPayments.toString()}
                  tone="green"
                />
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <section className="rounded-3xl bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold">My Courses</h2>

                      <p className="mt-2 text-gray-600">
                        Your enrolled course progress.
                      </p>
                    </div>

                    <GraduationCap className="text-[#007F73]" size={34} />
                  </div>

                  {learner.enrollments.length === 0 ? (
                    <EmptyState
                      text="You have not enrolled in any courses yet."
                      href="/courses"
                      label="Browse Courses"
                    />
                  ) : (
                    <div className="space-y-4">
                      {learner.enrollments.map((enrollment) => (
                        <Link
                          key={enrollment.id}
                          href={`/courses/${enrollment.course.slug}`}
                          className="block rounded-2xl border p-5 hover:bg-gray-50"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold">
                                {enrollment.course.title}
                              </h3>

                              <p className="mt-1 text-gray-600">
                                {enrollment.course.category || "General"}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-sm font-bold ${
                                enrollment.completed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-[#D94A00]"
                              }`}
                            >
                              {enrollment.completed
                                ? "Completed"
                                : "In Progress"}
                            </span>
                          </div>

                          <div className="mt-5">
                            <div className="mb-2 flex justify-between text-sm font-bold text-gray-500">
                              <span>Progress</span>
                              <span>{enrollment.progress}%</span>
                            </div>

                            <div className="h-3 rounded-full bg-gray-100">
                              <div
                                className="h-3 rounded-full bg-[#007F73]"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-3xl bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold">My Payments</h2>

                      <p className="mt-2 text-gray-600">
                        Track your course and subscription payment records.
                      </p>
                    </div>

                    <CreditCard className="text-[#007F73]" size={34} />
                  </div>

                  <div className="mb-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-orange-50 p-5">
                      <p className="text-sm font-bold text-gray-500">
                        Pending Payments
                      </p>

                      <p className="mt-2 text-3xl font-bold text-[#D94A00]">
                        {pendingPayments}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F2FBF8] p-5">
                      <p className="text-sm font-bold text-gray-500">
                        Paid Payments
                      </p>

                      <p className="mt-2 text-3xl font-bold text-[#007F73]">
                        {paidPayments}
                      </p>
                    </div>
                  </div>

                  {learner.payments.length === 0 ? (
                    <EmptyState
                      text="You have not created any payment records yet."
                      href="/pricing"
                      label="View Pricing"
                    />
                  ) : (
                    <div className="space-y-4">
                      {learner.payments.map((payment) => {
                        const createdDate = new Date(
                          payment.createdAt
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <div
                            key={payment.id}
                            className="rounded-2xl border p-5"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <h3 className="text-xl font-bold">
                                  {payment.paymentType.replaceAll("_", " ")}
                                </h3>

                                <p className="mt-1 text-gray-600">
                                  {payment.course?.title ||
                                    "Subscription / General Access"}
                                </p>

                                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                  <Clock size={15} />
                                  {createdDate}
                                </p>
                              </div>

                              <span
                                className={`rounded-full px-3 py-1 text-sm font-bold ${
                                  payment.status === "PAID"
                                    ? "bg-green-100 text-green-700"
                                    : payment.status === "FAILED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-orange-100 text-[#D94A00]"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                              <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm font-bold text-gray-500">
                                  Amount
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                  {payment.currency}{" "}
                                  {payment.amount.toLocaleString()}
                                </p>
                              </div>

                              <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-sm font-bold text-gray-500">
                                  Reference
                                </p>

                                <p className="mt-1 flex items-center gap-2 break-words text-sm font-bold">
                                  <Hash size={14} />
                                  {payment.providerRef || "Not available"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                              <Link
                                href={`/payment-confirmation?paymentId=${payment.id}`}
                                className="rounded-xl bg-[#007F73] px-4 py-2 text-sm font-bold text-white hover:bg-[#00665d]"
                              >
                                View Payment
                              </Link>

                              {payment.course?.slug && (
                                <Link
                                  href={`/courses/${payment.course.slug}`}
                                  className="rounded-xl border px-4 py-2 text-sm font-bold hover:bg-gray-50"
                                >
                                  Open Course
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <section className="rounded-3xl bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold">Quiz Results</h2>

                      <p className="mt-2 text-gray-600">
                        Your submitted practice and final quiz scores.
                      </p>
                    </div>

                    <ClipboardList className="text-[#D94A00]" size={34} />
                  </div>

                  {learner.quizResults.length === 0 ? (
                    <p className="rounded-2xl bg-gray-50 p-5 text-gray-600">
                      No quiz results yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {learner.quizResults.map((result) => {
                        const resultDate = new Date(
                          result.createdAt
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <div
                            key={result.id}
                            className="rounded-2xl border p-5"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <h3 className="text-xl font-bold">
                                  {result.course.title}
                                </h3>

                                <p className="mt-1 text-gray-600">
                                  {result.quizType} Quiz • {resultDate}
                                </p>
                              </div>

                              {result.passed ? (
                                <CheckCircle
                                  className="text-green-600"
                                  size={24}
                                />
                              ) : (
                                <XCircle className="text-red-600" size={24} />
                              )}
                            </div>

                            <p
                              className={`mt-4 text-4xl font-extrabold ${
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
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className="rounded-3xl bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold">Certificates</h2>

                      <p className="mt-2 text-gray-600">
                        Your issued certificates and verification codes.
                      </p>
                    </div>

                    <Award className="text-[#007F73]" size={34} />
                  </div>

                  {learner.certificates.length === 0 ? (
                    <p className="rounded-2xl bg-gray-50 p-5 text-gray-600">
                      No certificates issued yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {learner.certificates.map((certificate) => {
                        const issuedDate = new Date(
                          certificate.issuedAt
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <div
                            key={certificate.id}
                            className="rounded-2xl border p-5"
                          >
                            <h3 className="text-xl font-bold">
                              {certificate.course.title}
                            </h3>

                            <p className="mt-2 font-bold text-[#007F73]">
                              {certificate.certificateCode}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              Issued {issuedDate}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-3">
                              <Link
                                href={`/courses/${certificate.course.slug}/certificate`}
                                className="rounded-xl bg-[#007F73] px-4 py-2 text-sm font-bold text-white hover:bg-[#00665d]"
                              >
                                View Certificate
                              </Link>

                              <Link
                                href="/verify-certificate"
                                className="rounded-xl border px-4 py-2 text-sm font-bold hover:bg-gray-50"
                              >
                                Verify
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "green" | "orange";
}) {
  const toneClass = tone === "green" ? "text-[#007F73]" : "text-[#D94A00]";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className={toneClass}>{icon}</div>
        <p className="text-sm font-bold text-gray-500">{label}</p>
      </div>

      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState({
  text,
  href,
  label,
}: {
  text: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6 text-center">
      <p className="text-gray-600">{text}</p>

      <Link
        href={href}
        className="mt-5 inline-flex rounded-xl bg-[#007F73] px-5 py-3 font-bold text-white hover:bg-[#00665d]"
      >
        {label}
      </Link>
    </div>
  );
}