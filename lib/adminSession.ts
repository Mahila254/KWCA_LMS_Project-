import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed admin session cookie.
 *
 * The cookie used to be just "kwca_admin_session=active" plus a plain
 * "kwca_admin_email" cookie, which anyone could type into their browser to
 * become an admin. Now the cookie holds the admin's email and an expiry,
 * signed with ADMIN_SESSION_SECRET (server-only, never NEXT_PUBLIC_). A
 * cookie that was edited, forged, or has expired fails verification.
 *
 * Server-only: this reads a secret and must never be imported into a
 * "use client" component.
 */

export const ADMIN_SESSION_COOKIE = "kwca_admin_session";

// Old plain-text email cookie from before sessions were signed. Only kept
// so login/logout can clear it from browsers that still have it.
export const LEGACY_ADMIN_EMAIL_COOKIE = "kwca_admin_email";

export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  // Fail closed: without a proper secret no admin session is ever valid.
  if (!secret || secret.length < 32) {
    return null;
  }

  return secret;
}

export function isAdminSessionConfigured() {
  return getSecret() !== null;
}

function sign(payloadPart: string, secret: string) {
  return createHmac("sha256", secret).update(payloadPart).digest("base64url");
}

/**
 * Creates the signed cookie value for a logged-in admin. Returns null if
 * ADMIN_SESSION_SECRET is missing or too short.
 */
export function createAdminSessionToken(email: string) {
  const secret = getSecret();

  if (!secret) {
    return null;
  }

  const payloadPart = Buffer.from(
    JSON.stringify({
      email,
      exp: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
    })
  ).toString("base64url");

  return `${payloadPart}.${sign(payloadPart, secret)}`;
}

/**
 * Returns the admin email inside a valid, unexpired session cookie, or
 * null if the cookie is missing, tampered with, or expired. This only
 * proves the server issued the cookie — callers that grant admin access
 * must still confirm the account has the ADMIN role in the database.
 */
export function readAdminSessionEmail(token: string | undefined) {
  const secret = getSecret();

  if (!secret || !token) {
    return null;
  }

  const [payloadPart, signature] = token.split(".");

  if (!payloadPart || !signature) {
    return null;
  }

  const expected = Buffer.from(sign(payloadPart, secret));
  const received = Buffer.from(signature);

  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadPart, "base64url").toString("utf8")
    ) as { email?: unknown; exp?: unknown };

    if (
      typeof payload.email !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp < Date.now()
    ) {
      return null;
    }

    return payload.email;
  } catch {
    return null;
  }
}
