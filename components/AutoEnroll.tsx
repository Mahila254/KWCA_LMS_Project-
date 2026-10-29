"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";

// Courses already enrolled in during this visit, so moving between
// lessons doesn't repeat the request.
const enrolledThisVisit = new Set<string>();

/**
 * Opening any lesson counts as starting the course: a signed-in learner
 * is enrolled straight away, so their progress is kept from the first
 * lesson on. Enrolling is once-only on the server, so an existing
 * enrolment (and its progress) is never touched. Renders nothing.
 * Premium courses still need payment first; that request is refused and
 * quietly ignored here.
 */
export default function AutoEnroll({ courseSlug }: { courseSlug: string }) {
  useEffect(() => {
    if (enrolledThisVisit.has(courseSlug)) return;

    async function enrol() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response = await authFetch(`/api/courses/${courseSlug}/enroll`, {
        method: "POST",
      });

      if (response.ok) {
        enrolledThisVisit.add(courseSlug);
      }
    }

    enrol().catch((error) => {
      console.error("Automatic enrolment failed:", error);
    });
  }, [courseSlug]);

  return null;
}
