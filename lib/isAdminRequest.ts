import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Server Component equivalent of lib/adminAuth.ts's requireAdmin — reads
 * the same admin session cookies proxy.ts and the admin API routes trust,
 * and re-confirms the account still has the ADMIN role.
 *
 * Use this anywhere a page reads an "adminPreview=true" query param (or
 * similar) to decide whether to show admin-only content. A query param on
 * its own proves nothing — anyone can type it into the URL bar. This is
 * what makes that flag trustworthy.
 */
export async function isAdminRequest() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("kwca_admin_session")?.value;
  const adminEmail = cookieStore.get("kwca_admin_email")?.value;

  if (adminSession !== "active" || !adminEmail) {
    return false;
  }

  const admin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  return Boolean(admin && admin.role === "ADMIN");
}
