import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSessionEmail,
} from "@/lib/adminSession";

/**
 * Verifies that a request is coming from a logged-in admin.
 *
 * Verifies the signed session cookie (see lib/adminSession.ts), then
 * re-confirms the account still has the ADMIN role in the database (so a
 * demoted admin's existing cookie stops working immediately, not just on
 * next login). Returns the admin user record, or null if unauthorized.
 *
 * Every /api/admin/** route must call this first — proxy.ts only protects
 * /admin/** pages, it does NOT cover /api/admin/** routes.
 */
export async function requireAdmin(request: NextRequest) {
  const adminEmail = readAdminSessionEmail(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  );

  if (!adminEmail) {
    return null;
  }

  const admin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    return null;
  }

  return admin;
}
