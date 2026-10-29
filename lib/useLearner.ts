"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Learner = {
  email: string;
  firstName: string;
};

/**
 * The signed-in learner for the header, kept in step with Supabase so the
 * header updates on login and logout without a reload. `undefined` while
 * the session is still being read (render nothing yet, to avoid flashing
 * the wrong buttons), `null` when signed out.
 */
export function useLearner() {
  const [learner, setLearner] = useState<Learner | null | undefined>(undefined);

  useEffect(() => {
    // onAuthStateChange fires once straight away with the stored session,
    // then again on every sign-in, sign-out and token refresh.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (!user?.email) {
        setLearner(null);
        return;
      }

      const fullName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name.trim()
          : "";

      setLearner({
        email: user.email,
        firstName: fullName.split(/\s+/)[0] || user.email.split("@")[0],
      });
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return learner;
}
