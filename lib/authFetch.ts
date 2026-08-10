import { supabase } from "@/lib/supabase";

/**
 * Same as fetch(), but attaches the current learner's Supabase access
 * token as an Authorization header, so the server can verify who's
 * actually making the request instead of trusting the request body.
 * Use this for any call to a route protected by lib/requireUser.ts.
 */
export async function authFetch(input: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, { ...init, headers });
}
