import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Verifies the caller's identity from a Supabase access token, instead of
 * trusting whatever id/email/name a request body claims. The client must
 * send the token as `Authorization: Bearer <token>` (see lib/authFetch.ts).
 *
 * Returns the verified learner's id/email/name/gender/consent, or null if
 * the token is missing or invalid. Every route that reads or writes data
 * tied to "the current learner" must use this instead of body-supplied
 * id/email — those are just claims from the client and can be forged.
 */
export async function requireUser(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user || !data.user.email) {
    return null;
  }

  const metadata = data.user.user_metadata as
    | {
        full_name?: string;
        gender?: string;
        consent?: boolean;
        consentedAt?: string;
      }
    | null;

  return {
    id: data.user.id,
    email: data.user.email,
    name: metadata?.full_name || null,
    gender: metadata?.gender || null,
    consentGiven: Boolean(metadata?.consent),
    consentedAt: metadata?.consentedAt || null,
  };
}
