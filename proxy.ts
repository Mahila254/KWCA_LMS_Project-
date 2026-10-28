import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSessionEmail,
} from "@/lib/adminSession";
import { prisma } from "@/lib/prisma";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";

  if (isAdminPage && !isAdminLoginPage) {
    // This is the only server-side gate for /admin/** pages (AdminGuard runs
    // in the browser), so it checks both that the server issued the cookie
    // and that the account still has the ADMIN role.
    const adminEmail = readAdminSessionEmail(
      request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    );

    const admin = adminEmail
      ? await prisma.user.findUnique({
          where: {
            email: adminEmail,
          },
          select: {
            role: true,
          },
        })
      : null;

    if (admin?.role !== "ADMIN") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};