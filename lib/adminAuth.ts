import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Verifies that a request is coming from a logged-in admin.
 *
 * Checks the same session cookies proxy.ts checks for admin pages, then
 * re-confirms the account still has the ADMIN role in the database (so a
 * demoted admin's existing cookie stops working immediately, not just on
 * next login). Returns the admin user record, or null if unauthorized.
 *
 * Every /api/admin/** route must call this first — proxy.ts only protects
 * /admin/** pages, it does NOT cover /api/admin/** routes.
 */
export async function requireAdmin(request: NextRequest) {
  const adminSession = request.cookies.get("kwca_admin_session")?.value;
  const adminEmail = request.cookies.get("kwca_admin_email")?.value;

  if (adminSession !== "active" || !adminEmail) {
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
