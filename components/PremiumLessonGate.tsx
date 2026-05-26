"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Loader2, Lock } from "lucide-react";

type PremiumLessonGateProps = {
  courseId: string;
  courseSlug: string;
  children: ReactNode;
};

type SupabaseLearner = {
  email?: string;
};

export default function PremiumLessonGate({
  courseId,
  courseSlug,
  children,
}: PremiumLessonGateProps) {
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setHasAccess(false);
          return;
        }

        const learner = user as SupabaseLearner;

        if (!learner.email) {
          setHasAccess(false);
          return;
        }

        const response = await fetch("/api/access/check-premium", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: learner.email,
            courseId,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.hasAccess) {
          setHasAccess(false);
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error(error);
        setHasAccess(false);
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, [courseId]);

  if (checking) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-24">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
            <Loader2 className="animate-spin" size={34} />
          </div>

          <h1 className="text-4xl font-bold text-[#07122E]">
            Checking Premium Access
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Please wait while we confirm your course payment.
          </p>
        </section>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-24">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-[#D94A00]">
            <Lock size={32} />
          </div>

          <h1 className="text-4xl font-bold text-[#07122E]">
            Premium Lesson Locked
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            This lesson is premium. Complete payment for this course or use a
            monthly or annual subscription to unlock it.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/pricing?courseId=${courseId}&courseSlug=${courseSlug}`}
              className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
            >
              Unlock Course
            </Link>

            <Link
              href={`/courses/${courseSlug}`}
              className="rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
            >
              Back to Course
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <div className="border-b bg-green-50 px-6 py-4 text-green-800">
        <div className="mx-auto flex max-w-7xl items-center gap-2 font-bold">
          <CheckCircle size={18} />
          Premium access confirmed. This lesson is unlocked.
        </div>
      </div>

      {children}
    </>
  );
}