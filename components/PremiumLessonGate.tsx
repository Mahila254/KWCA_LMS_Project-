"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
import { CheckCircle, Loader2, Lock } from "lucide-react";
import {
  LessonMaterialData,
  LessonNotes,
  LessonReadingLink,
  LessonVideo,
} from "@/components/LessonMaterial";

type PremiumLessonGateProps = {
  courseId: string;
  courseSlug: string;
  lessonSlug: string;
  children: ReactNode;
};

// The server never puts premium material in the page. The gate fetches it
// from the material API (which checks payment) and hands it to the
// PremiumLesson* slots below through this context.
const PremiumMaterialContext = createContext<LessonMaterialData | null>(null);

export function PremiumLessonVideo({ title }: { title: string }) {
  const material = useContext(PremiumMaterialContext);

  return <LessonVideo title={title} videoUrl={material?.videoUrl ?? null} />;
}

export function PremiumLessonNotes() {
  const material = useContext(PremiumMaterialContext);

  return (
    <LessonNotes
      content={material?.content ?? null}
      notes={material?.notes ?? null}
    />
  );
}

export function PremiumLessonReadingLink() {
  const material = useContext(PremiumMaterialContext);

  return <LessonReadingLink readingUrl={material?.readingUrl ?? null} />;
}

export default function PremiumLessonGate({
  courseId,
  courseSlug,
  lessonSlug,
  children,
}: PremiumLessonGateProps) {
  const [checking, setChecking] = useState(true);
  const [material, setMaterial] = useState<LessonMaterialData | null>(null);
  const hasAccess = material !== null;

  useEffect(() => {
    async function loadMaterial() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setMaterial(null);
          return;
        }

        const response = await authFetch(
          `/api/courses/${courseSlug}/lessons/${lessonSlug}/material`
        );

        const data = await response.json();

        if (!response.ok || !data.material) {
          setMaterial(null);
          return;
        }

        setMaterial(data.material);
      } catch (error) {
        console.error(error);
        setMaterial(null);
      } finally {
        setChecking(false);
      }
    }

    loadMaterial();
  }, [courseSlug, lessonSlug]);

  if (checking) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-24">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F0FA] text-[#1E1D59]">
            <Loader2 className="animate-spin" size={34} />
          </div>

          <h1 className="text-4xl font-bold text-[#1E1D59]">
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
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5DCE6] text-[#632854]">
            <Lock size={32} />
          </div>

          <h1 className="text-4xl font-bold text-[#1E1D59]">
            Premium Lesson Locked
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            This lesson is premium. Complete payment for this course or use a
            monthly or annual subscription to unlock it.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/pricing?courseId=${courseId}&courseSlug=${courseSlug}`}
              className="rounded-full bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
            >
              Unlock Course
            </Link>

            <Link
              href={`/courses/${courseSlug}`}
              className="rounded-full border px-6 py-3 font-bold hover:bg-gray-50"
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

      <PremiumMaterialContext.Provider value={material}>
        {children}
      </PremiumMaterialContext.Provider>
    </>
  );
}