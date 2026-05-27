"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Lock, LogIn, Loader2 } from "lucide-react";

type CourseAccessBadgeProps = {
  courseId: string;
};

type SupabaseLearner = {
  email?: string;
};

export default function CourseAccessBadge({ courseId }: CourseAccessBadgeProps) {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkCourseAccess() {
      try {
        setChecking(true);

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setLoggedIn(false);
          setHasAccess(false);
          return;
        }

        const learner = user as SupabaseLearner;

        if (!learner.email) {
          setLoggedIn(false);
          setHasAccess(false);
          return;
        }

        setLoggedIn(true);

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

    checkCourseAccess();
  }, [courseId]);

  if (checking) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600">
        <Loader2 className="animate-spin" size={15} />
        Checking Access
      </span>
    );
  }

  if (!loggedIn) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#D94A00]">
        <LogIn size={15} />
        Login to Check Access
      </span>
    );
  }

  if (hasAccess) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
        <CheckCircle size={15} />
        Premium Access Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#D94A00]">
      <Lock size={15} />
      Premium Access Required
    </span>
  );
}