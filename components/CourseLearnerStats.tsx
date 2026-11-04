"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, Users } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";

type LearnerStatus = {
  enrolled: boolean;
  enrollment: { progress: number; completed: boolean } | null;
  finalQuizResult: { score: number } | null;
  certificate: { certificateCode: string } | null;
};

/**
 * The two course page cards about the learner themself: are they enrolled,
 * and do they have the certificate? Learners see their own status here,
 * not how many other people enrolled (admins previewing a course still get
 * those totals). `undefined` while loading, `null` when signed out.
 */
export default function CourseLearnerStats({
  courseSlug,
}: {
  courseSlug: string;
}) {
  const [status, setStatus] = useState<LearnerStatus | null | undefined>(
    undefined
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          if (!cancelled) setStatus(null);
          return;
        }

        const response = await authFetch(
          `/api/courses/${courseSlug}/learner-status`
        );
        const data = response.ok ? await response.json() : null;

        if (!cancelled) setStatus(data);
      } catch (error) {
        console.error("Learner status check failed:", error);
        if (!cancelled) setStatus(null);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  const progress = status?.enrollment?.progress ?? 0;
  const completed = Boolean(status?.enrollment?.completed) || progress >= 100;
  const loading = status === undefined;

  return (
    <>
      <StatusCard
        icon={<Users size={28} />}
        label="Your Enrollment"
        loading={loading}
        positive={Boolean(status?.enrolled)}
        value={status?.enrolled ? "Enrolled" : "Not enrolled"}
      >
        {status?.enrolled ? (
          <>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2">
              {completed ? "All lessons complete" : `${progress}% complete`}
            </p>
          </>
        ) : status === null ? (
          <p>
            <Link href="/login" className="font-bold text-accent underline-offset-2 hover:underline">
              Log in
            </Link>{" "}
            to save your progress.
          </p>
        ) : (
          <p>You&rsquo;re enrolled as soon as you start a lesson.</p>
        )}
      </StatusCard>

      <StatusCard
        icon={<Award size={28} />}
        label="Your Certificate"
        loading={loading}
        positive={Boolean(status?.certificate)}
        value={
          status?.certificate
            ? "Earned"
            : status?.finalQuizResult
              ? "Ready to claim"
              : "Not yet earned"
        }
      >
        {status?.certificate || status?.finalQuizResult ? (
          <Link
            href={`/courses/${courseSlug}/certificate`}
            className="font-bold text-accent underline-offset-2 hover:underline"
          >
            {status.certificate ? "View certificate" : "Get your certificate"}
          </Link>
        ) : (
          <p>Pass the final quiz to earn it.</p>
        )}
      </StatusCard>
    </>
  );
}

function StatusCard({
  icon,
  label,
  value,
  positive,
  loading,
  children,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  positive: boolean;
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <div className="h-full rounded-3xl bg-surface p-4 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-ink sm:mb-4 sm:gap-3">
          {icon}
          <p className="text-xs font-bold text-gray-500 sm:text-sm">{label}</p>
        </div>

        {loading ? (
          <div aria-busy="true" className="space-y-3">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          </div>
        ) : (
          <>
            <p
              className={`flex items-center gap-2 text-xl font-extrabold leading-tight sm:text-2xl ${
                positive ? "text-green-700" : ""
              }`}
            >
              {positive && <CheckCircle2 size={22} className="shrink-0" />}
              {value}
            </p>

            <div className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
              {children}
            </div>
          </>
        )}
      </div>
    </ScrollReveal>
  );
}
