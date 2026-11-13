import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

// Limits password guessing on the admin login. Counts live in the database,
// not in memory, because Vercel runs many copies of the server at once.

const WINDOW_MINUTES = 15;
const WINDOW_MS = WINDOW_MINUTES * 60 * 1000;

// Three separate counters, so that:
// - pair: one person mistyping is stopped quickly, without locking the real
//   admin out from everywhere else;
// - ip: one machine can't try many different accounts;
// - email: many machines can't gang up on one account.
const LIMITS = { pair: 5, ip: 20, email: 30 } as const;

type LimitName = keyof typeof LIMITS;

// Hashed so the table never holds a readable email or IP address.
function hash(value: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "")
    .update(value)
    .digest("hex");
}

function loginKeys(email: string, ip: string) {
  const normalisedEmail = email.trim().toLowerCase();

  return {
    pair: `pair:${hash(`${normalisedEmail}|${ip}`)}`,
    ip: `ip:${hash(ip)}`,
    email: `email:${hash(normalisedEmail)}`,
  };
}

/** The caller's address, as set by Vercel's edge. */
export function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

/** Minutes left if this login is blocked right now, otherwise 0. */
export async function loginBlockedMinutes(email: string, ip: string) {
  const keys = loginKeys(email, ip);
  const names = Object.keys(keys) as LimitName[];

  const rows = await prisma.adminLoginAttempt.findMany({
    where: { key: { in: names.map((name) => keys[name]) } },
  });

  let blockedUntil = 0;

  for (const name of names) {
    const row = rows.find((item) => item.key === keys[name]);
    if (!row || row.failures < LIMITS[name]) continue;

    blockedUntil = Math.max(blockedUntil, row.windowStart.getTime() + WINDOW_MS);
  }

  const remaining = blockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
}

/** Adds one failure to every counter, starting afresh once a window ends. */
export async function recordLoginFailure(email: string, ip: string) {
  for (const key of Object.values(loginKeys(email, ip))) {
    await prisma.$executeRaw`
      INSERT INTO "AdminLoginAttempt" ("key", "failures", "windowStart")
      VALUES (${key}, 1, CURRENT_TIMESTAMP)
      ON CONFLICT ("key") DO UPDATE SET
        "failures" = CASE
          WHEN "AdminLoginAttempt"."windowStart" < CURRENT_TIMESTAMP - make_interval(mins => ${WINDOW_MINUTES}::int)
          THEN 1
          ELSE "AdminLoginAttempt"."failures" + 1
        END,
        "windowStart" = CASE
          WHEN "AdminLoginAttempt"."windowStart" < CURRENT_TIMESTAMP - make_interval(mins => ${WINDOW_MINUTES}::int)
          THEN CURRENT_TIMESTAMP
          ELSE "AdminLoginAttempt"."windowStart"
        END
    `;
  }

  // Finished windows are no use to anyone; keep the table tiny.
  await prisma.adminLoginAttempt.deleteMany({
    where: { windowStart: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });
}

/**
 * A successful login clears this account's counters. The IP counter stays,
 * so a machine guessing across accounts can't reset it by also logging in.
 */
export async function clearLoginFailures(email: string, ip: string) {
  const keys = loginKeys(email, ip);

  await prisma.adminLoginAttempt.deleteMany({
    where: { key: { in: [keys.pair, keys.email] } },
  });
}

// The public "verify a certificate" page uses the same counters, so nobody
// can run through certificate codes to collect learners' names. Only wrong
// codes count, so checking real certificates is never slowed down.
const CERTIFICATE_LOOKUP_LIMIT = 20;

function certificateLookupKey(ip: string) {
  return `certificate:${hash(ip)}`;
}

/** Minutes left if this address has guessed too many wrong codes, else 0. */
export async function certificateLookupBlockedMinutes(ip: string) {
  const row = await prisma.adminLoginAttempt.findUnique({
    where: { key: certificateLookupKey(ip) },
  });
  if (!row || row.failures < CERTIFICATE_LOOKUP_LIMIT) return 0;

  const remaining = row.windowStart.getTime() + WINDOW_MS - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
}

export async function recordWrongCertificateCode(ip: string) {
  const key = certificateLookupKey(ip);

  await prisma.$executeRaw`
    INSERT INTO "AdminLoginAttempt" ("key", "failures", "windowStart")
    VALUES (${key}, 1, CURRENT_TIMESTAMP)
    ON CONFLICT ("key") DO UPDATE SET
      "failures" = CASE
        WHEN "AdminLoginAttempt"."windowStart" < CURRENT_TIMESTAMP - make_interval(mins => ${WINDOW_MINUTES}::int)
        THEN 1
        ELSE "AdminLoginAttempt"."failures" + 1
      END,
      "windowStart" = CASE
        WHEN "AdminLoginAttempt"."windowStart" < CURRENT_TIMESTAMP - make_interval(mins => ${WINDOW_MINUTES}::int)
        THEN CURRENT_TIMESTAMP
        ELSE "AdminLoginAttempt"."windowStart"
      END
  `;
}
