"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { useLearner } from "@/lib/useLearner";

type Course = { id: string; title: string; slug: string; category: string | null };

type Enrollment = {
  id: string;
  progress: number;
  completed: boolean;
  updatedAt: string;
  course: Course;
};

type Certificate = { id: string; certificateCode: string; course: Course };

type Profile = {
  name: string | null;
  enrollments: Enrollment[];
  certificates: Certificate[];
};

type State =
  | { status: "loading" }
  | { status: "ready"; profile: Profile }
  | { status: "error"; message: string };

/**
 * The learner's own dashboard: their name, their courses and real
 * progress (from /api/profile), the course to carry on with, and their
 * certificates. Signed-out visitors are pointed to the login page.
 */
export default function LearnerDashboard() {
  const learner = useLearner();
  const [state, setState] = useState<State>({ status: "loading" });
  const email = learner?.email;

  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    authFetch("/api/profile")
      .then(async (response) => {
        const data = await response.json();
        if (cancelled) return;
        setState(
          response.ok
            ? { status: "ready", profile: data.learner }
            : { status: "error", message: data.error || "Your courses couldn't be loaded." }
        );
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "error", message: "Your courses couldn't be loaded. Check your connection and try again." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  // Session still being read: hold the layout with a quiet skeleton.
  if (learner === undefined || (learner && state.status === "loading")) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10" aria-busy="true">
        <span className="sr-only">Loading your courses…</span>
        <div className="grid gap-5 md:grid-cols-4">
          {[0, 1, 2, 3].map((card) => (
            <div key={card} className="h-32 animate-pulse rounded-3xl bg-surface shadow-sm" />
          ))}
        </div>
        <div className="mt-8 h-44 animate-pulse rounded-3xl bg-surface shadow-sm" />
      </section>
    );
  }

  if (learner === null) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="rounded-3xl bg-surface p-10 shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-tint text-accent">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-3xl font-bold">Log in to see your learning</h2>
          <p className="mt-3 text-lg leading-8 text-gray-600">
            Your courses, progress and certificates are kept with your account.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/login" className="rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover">
              Log in
            </Link>
            <Link href="/register" className="rounded-full border border-line px-6 py-3 font-bold hover:bg-gray-50">
              Create an account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (state.status !== "ready") {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p role="alert" className="rounded-3xl bg-red-50 p-8 text-lg font-semibold text-red-700">
          {state.status === "error" ? state.message : "Your courses couldn't be loaded."}
        </p>
      </section>
    );
  }

  const { enrollments, certificates } = state.profile;
  const completed = enrollments.filter((item) => item.completed).length;
  const averageProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, item) => sum + item.progress, 0) / enrollments.length)
    : 0;

  // Carry on with the unfinished course touched most recently.
  const current = [...enrollments]
    .filter((item) => !item.completed)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        <Stat icon={<BookOpen size={24} />} label="Courses started" value={String(enrollments.length)} />
        <Stat icon={<CheckCircle2 size={24} />} label="Courses completed" value={String(completed)} />
        <Stat icon={<Award size={24} />} label="Certificates" value={String(certificates.length)} />
        <Stat icon={<GraduationCap size={24} />} label="Average progress" value={`${averageProgress}%`} />
      </div>

      {current ? (
        <div className="mt-8 flex flex-col gap-6 rounded-3xl bg-deep p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-on-deep-muted">
              Continue learning
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight">{current.course.title}</h2>

            <div className="mt-5 flex items-center gap-4">
              <div
                className="h-2.5 w-full max-w-sm overflow-hidden rounded-full bg-white/15"
                role="progressbar"
                aria-valuenow={current.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${current.course.title} progress`}
              >
                <div
                  className="h-full rounded-full bg-highlight transition-[width] duration-700 ease-soft"
                  style={{ width: `${current.progress}%` }}
                />
              </div>
              <span className="shrink-0 text-sm font-bold tabular-nums">{current.progress}%</span>
            </div>
          </div>

          <Link
            href={`/courses/${current.course.slug}`}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-secondary px-6 py-4 font-bold text-white hover:bg-secondary-hover"
          >
            <PlayCircle size={20} />
            {current.progress > 0 ? "Pick up where you left off" : "Start the course"}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-5 rounded-3xl bg-deep p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="text-3xl font-bold">
              {enrollments.length ? "You've finished every course you started" : "Start your first course"}
            </h2>
            <p className="mt-2 max-w-xl text-white/75">
              {enrollments.length
                ? "Have a look at the other courses when you're ready for the next one."
                : "Pick a course and your progress will show up here as you go."}
            </p>
          </div>
          <Link
            href="/courses"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-secondary px-6 py-4 font-bold text-white hover:bg-secondary-hover"
          >
            Browse courses
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {enrollments.length > 0 && (
        <>
          <h2 className="mt-12 text-3xl font-bold md:text-4xl">My courses</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {enrollments.map((item) => {
              const certificate = certificates.find((entry) => entry.course.id === item.course.id);

              return (
                <div key={item.id} className="flex flex-col rounded-3xl bg-surface p-7 shadow-sm">
                  <p className="text-sm font-bold text-accent">{item.course.category || "Course"}</p>
                  <h3 className="mt-2 text-xl font-bold leading-snug">{item.course.title}</h3>

                  <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-[width] duration-700 ease-soft ${
                        item.completed ? "bg-green-600" : "bg-primary"
                      }`}
                      style={{ width: `${item.completed ? 100 : item.progress}%` }}
                    />
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                    {item.completed ? (
                      <>
                        <CheckCircle2 size={16} className="text-green-700" />
                        Completed
                      </>
                    ) : (
                      `${item.progress}% complete`
                    )}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 pt-1">
                    <Link
                      href={`/courses/${item.course.slug}`}
                      className="inline-flex items-center gap-1.5 font-bold text-accent hover:underline"
                    >
                      {item.completed ? "Review course" : "Continue"}
                      <ArrowRight size={16} />
                    </Link>

                    {certificate && (
                      <Link
                        href={`/courses/${item.course.slug}/certificate`}
                        className="inline-flex items-center gap-1.5 font-bold text-warm-text hover:underline"
                      >
                        <Award size={16} />
                        View certificate
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-surface p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-2 text-accent">
        {icon}
        <p className="text-xs font-bold text-gray-500 sm:text-sm">{label}</p>
      </div>
      <p className="mt-3 text-4xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}
